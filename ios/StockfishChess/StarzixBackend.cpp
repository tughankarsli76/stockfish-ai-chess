// GPL-3.0-or-later host; upstream Starzix code/model remain WTFPL-2.0.
#include "ChessEngineBackend.h"
#include "EnginePorts/Prelude.h"
#define INCBIN_PREFIX Starzix
#define gNetFileData StarzixNetFileData
#define INCBIN_SILENCE_BITCODE_WARNING
namespace StarzixIOS {
#include "../../engine/starzix-6.1/src/uci.hpp"
}
class StarzixBackend final : public ChessEngineBackend {
    std::unique_ptr<StarzixIOS::Searcher> state=std::make_unique<StarzixIOS::Searcher>();
    std::thread search;
public:
    ~StarzixBackend() override { stop(); }
    void stop() override { state->iosStop(); if(search.joinable())search.join(); }
    void command(const std::string& text) override {
        if(text=="stop" || text=="quit") { stop(); return; }
        if(text.rfind("setoption name Skill Level ",0)==0 || text.rfind("setoption name UCI_ShowWDL ",0)==0 || text.rfind("setoption name SyzygyPath ",0)==0 || text.rfind("setoption name MultiPV ",0)==0) return;
        stop();
        if(text.rfind("go ",0)==0) {
            state->iosPrepare();
            search=std::thread([this,text]{std::string command=text;StarzixIOS::uci::runCommand(command,*state);});
        } else { std::string command=text;StarzixIOS::uci::runCommand(command,*state); }
    }
};
std::unique_ptr<ChessEngineBackend> makeStarzix() { return std::make_unique<StarzixBackend>(); }
