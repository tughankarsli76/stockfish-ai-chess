// GPL-3.0. Isolated native host for Halogen 16.0.0.
#include "ChessEngineBackend.h"
#include "EnginePorts/Prelude.h"
#define HALOGEN_IOS 1
namespace HalogenIOS {
using std::abs;
#include "../../engine/halogen-16.0.0/src/search/cuckoo.h"
#include "../../engine/halogen-16.0.0/src/search/thread.h"
#include "../../engine/halogen-16.0.0/src/uci/uci.h"
}
class HalogenBackend final : public ChessEngineBackend {
    HalogenIOS::UCI::UciOutput output;
    std::unique_ptr<HalogenIOS::SearchThreadPool> pool;
    std::unique_ptr<HalogenIOS::UCI::Uci> uci;
public:
    HalogenBackend() {
        static std::once_flag initialized;
        std::call_once(initialized,[]{HalogenIOS::Cuckoo::init();});
        pool=std::make_unique<HalogenIOS::SearchThreadPool>(output,1);
        uci=std::make_unique<HalogenIOS::UCI::Uci>("16.0.0",*pool,output);
    }
    ~HalogenBackend() override { stop(); }
    void stop() override { uci->handle_stop(); uci->native_wait(); }
    void command(const std::string& text) override {
        if(text=="stop" || text=="quit") { stop(); return; }
        if(text.rfind("setoption name Skill Level ",0)==0 || text.rfind("setoption name UCI_ShowWDL ",0)==0 || text.rfind("setoption name SyzygyPath ",0)==0) return;
        stop(); uci->process_input(text);
    }
};
std::unique_ptr<ChessEngineBackend> makeHalogen() { return std::make_unique<HalogenBackend>(); }
