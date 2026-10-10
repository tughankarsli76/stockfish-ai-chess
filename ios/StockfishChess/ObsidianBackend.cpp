// GPL-3.0; in-process host for Obsidian 16.0.
#include "ChessEngineBackend.h"
#include "../../engine/Obsidian-16.0/src/cuckoo.h"
#include "../../engine/Obsidian-16.0/src/threads.h"
#include "../../engine/Obsidian-16.0/src/tt.h"
#include "../../engine/Obsidian-16.0/src/uci.h"
#include <mutex>
class ObsidianBackend final : public ChessEngineBackend {
    Obsidian::Position board;
public:
    ObsidianBackend() {
        using namespace Obsidian;
        static std::once_flag initialized;
        std::call_once(initialized, [] {
            Zobrist::init(); Bitboards::init(); positionInit(); Cuckoo::init(); Search::init(); NNUE::loadWeights();
        });
        UCI::Options.clear(); UCI::init(); UCI::contemptValue=0;
        Threads::setThreadCount(1); UCI::Options["Hash"].set("32");
        UCI::command("position startpos",board);
        UCI::command("ucinewgame",board);
    }
    ~ObsidianBackend() override { stop(); Obsidian::Threads::setThreadCount(0); Obsidian::TT::release(); }
    void stop() override { Obsidian::Threads::stopSearch(); Obsidian::Threads::waitForSearch(); }
    void command(const std::string& text) override {
        if(text=="stop" || text=="quit") { stop(); return; }
        if(text.rfind("setoption name Skill Level ",0)==0 || text.rfind("setoption name UCI_ShowWDL ",0)==0 || text.rfind("setoption name SyzygyPath ",0)==0) return;
        stop(); Obsidian::UCI::command(text,board);
    }
};
std::unique_ptr<ChessEngineBackend> makeObsidian() { return std::make_unique<ObsidianBackend>(); }
