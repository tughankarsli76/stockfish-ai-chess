// GPL-3.0; in-process host for the accompanying PlentyChess 8.0.0 source.
#include "ChessEngineBackend.h"
#include "../../engine/plentychess-8.0.0/src/uci.h"
#include "../../engine/plentychess-8.0.0/src/thread.h"
#include "../../engine/plentychess-8.0.0/src/zobrist.h"
#include "../../engine/plentychess-8.0.0/src/magic.h"
#include "../../engine/plentychess-8.0.0/src/bitboard.h"
#include <mutex>
extern ThreadPool threads;
void plentyCommand(const std::string&, Board&, std::vector<Hash>&);
class PlentyChessBackend final : public ChessEngineBackend {
    Board board;
    std::vector<Hash> history;
public:
    PlentyChessBackend() {
        static std::once_flag initialized;
        std::call_once(initialized, [] {
            generateMagics(); BB::init(); initReductions(); Zobrist::init(); initNetworkData();
        });
        UCI::Options = UCI::UCIOptions{};
        UCI::Options.hash.value = 32;
        UCI::Options.syzygyProbeLimit.value = 0;
        UCI::optionsDirty = false;
        TT.resize(32);
        threads.resize(1);
        board.startpos(); history.push_back(board.hashes.hash);
    }
    ~PlentyChessBackend() override { stop(); threads.shutdown(); TT.release(); }
    void stop() override { threads.stopSearching(); threads.waitForSearchFinished(); }
    void command(const std::string& text) override {
        if(text=="stop" || text=="quit") { stop(); return; }
        if(text.rfind("setoption name Skill Level ",0)==0 || text.rfind("setoption name UCI_ShowWDL ",0)==0 || text.rfind("setoption name SyzygyPath ",0)==0) return;
        stop();
        plentyCommand(text,board,history);
    }
};
std::unique_ptr<ChessEngineBackend> makePlentyChess() { return std::make_unique<PlentyChessBackend>(); }
