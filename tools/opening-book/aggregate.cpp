#include "vendor/chess.hpp"
#include <fstream>
#include <iostream>
#include <unordered_map>
#include <unordered_set>

using namespace chess;
struct Count { uint16_t move; uint32_t games=0, points=0; };
struct Position { std::string fen; uint32_t games=0; std::vector<Count> moves; };
struct Step { uint64_t key; uint16_t move; std::string fen; bool white; };
struct Sketch {
    static constexpr size_t width=1<<24;
    std::vector<uint16_t> cells=std::vector<uint16_t>(3*width);
    size_t index(uint64_t key,size_t n) const {
        key+=0x9e3779b97f4a7c15ULL*(n+1);
        key=(key^(key>>30))*0xbf58476d1ce4e5b9ULL;
        key=(key^(key>>27))*0x94d049bb133111ebULL;
        return n*width+((key^(key>>31))&(width-1));
    }
    void add(uint64_t key){for(size_t n=0;n<3;n++){auto &v=cells[index(key,n)];if(v<65535)++v;}}
    unsigned count(uint64_t key) const {unsigned v=65535;for(size_t n=0;n<3;n++)v=std::min(v,unsigned(cells[index(key,n)]));return v;}
};
class BookVisitor : public pgn::Visitor {
public:
    Sketch sketch;
    bool firstPass=false;
    std::unordered_map<uint64_t,Position> positions;
    std::unordered_set<std::string> seenGames;
    Board board;
    std::vector<Step> steps;
    std::string result, url, variant, setup, event;
    int whiteElo=0, blackElo=0;
    bool accepted=false, bad=false;
    size_t read=0, kept=0, rejected=0;
    void startPgn() override {
        board=Board();steps.clear();result=url=variant=setup=event="";
        whiteElo=blackElo=0;accepted=bad=false;
    }
    void header(std::string_view key,std::string_view value) override {
        if(key=="Result")result=value;
        if(key=="LichessURL"||key=="Site")url=value;
        if(key=="Variant")variant=value;
        if(key=="FEN"||key=="SetUp")setup=value;
        if(key=="Event")event=value;
        try {
            if(key=="WhiteElo")whiteElo=std::stoi(std::string(value));
            if(key=="BlackElo")blackElo=std::stoi(std::string(value));
        } catch(...) {bad=true;}
    }
    void startMoves() override {
        accepted=!bad && setup.empty() && (variant.empty()||variant=="Standard") &&
            std::min(whiteElo,blackElo)>=2300 && std::max(whiteElo,blackElo)>=2500 &&
            event.find("Bullet")==std::string::npos &&
            (result=="1-0"||result=="0-1"||result=="1/2-1/2");
        if(accepted && !url.empty() && url!="?")accepted=seenGames.insert(url).second;
        if(!accepted)skipPgn(true);
    }
    void move(std::string_view san,std::string_view) override {
        try {
            auto move=uci::parseSan(board,san);
            auto key=board.hash();
            steps.push_back({key,move.move(),!firstPass&&sketch.count(key)>=12?board.getFen(false):"",board.sideToMove()==Color::WHITE});
            board.makeMove(move);
            if(steps.size()>=40)skipPgn(true);
        } catch(...) {bad=true;skipPgn(true);}
    }
    void endPgn() override {
        ++read;
        if(!accepted||bad||steps.empty()){++rejected;return;}
        ++kept;
        std::unordered_set<uint64_t> seenPositions;
        for(auto &step:steps) {
            if(!seenPositions.insert(step.key).second)continue;
            if(firstPass){sketch.add(step.key);continue;}
            if(sketch.count(step.key)<12)continue;
            auto &p=positions[step.key];
            if(++p.games>=2 && p.fen.empty())p.fen=step.fen;
            auto it=std::find_if(p.moves.begin(),p.moves.end(),[&](const Count &c){return c.move==step.move;});
            if(it==p.moves.end()){p.moves.push_back({step.move});it=std::prev(p.moves.end());}
            ++it->games;
            it->points+=result=="1/2-1/2"?1:((result=="1-0")==step.white?2:0);
        }
        if(kept%100000==0)std::cerr<<"Games "<<kept<<" positions "<<positions.size()<<std::endl;
    }
};
int main(int argc,char **argv) {
    if(argc!=4)return 2;
    BookVisitor visitor;
    visitor.firstPass=std::string(argv[1])=="count";
    if(!visitor.firstPass){std::ifstream in(argv[2],std::ios::binary);in.read(reinterpret_cast<char*>(visitor.sketch.cells.data()),visitor.sketch.cells.size()*2);if(!in)return 2;}
    pgn::StreamParser parser(std::cin);
    auto error=parser.readGames(visitor);
    if(error){std::cerr<<error.message()<<std::endl;return 1;}
    if(visitor.firstPass){std::ofstream out(argv[2],std::ios::binary);out.write(reinterpret_cast<char*>(visitor.sketch.cells.data()),visitor.sketch.cells.size()*2);return out.good()?0:1;}
    std::ofstream out(argv[3]);
    for(auto &[key,p]:visitor.positions) {
        if(p.games<12||p.fen.empty())continue;
        for(auto &c:p.moves) {
            // Require repetition, at least 1% support, and a 35% game score.
            if(c.games<8 || double(c.games)/p.games<.01 || double(c.points)/(2*c.games)<.35)continue;
            out<<p.fen<<'\t'<<uci::moveToUci(Move(c.move))<<'\t'<<c.games<<'\t'<<c.points<<'\t'<<p.games<<'\n';
        }
    }
    std::cerr<<"DONE read="<<visitor.read<<" kept="<<visitor.kept<<" rejected="<<visitor.rejected<<std::endl;
    return out.good()?0:1;
}
