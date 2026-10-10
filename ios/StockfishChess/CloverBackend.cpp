// GPL-3.0-or-later. Isolated native host for Clover 9.1.
#include "ChessEngineBackend.h"
#include "EnginePorts/Prelude.h"
#include "EnginePorts/CloverTablebaseNames.h"
#include "../../engine/clover-9.1/src/3rdparty/Fathom/src/tbprobe.h"
#define INCBIN_PREFIX Clover
#define gNetData CloverNetData
#define VERSION_NAME "9.1"
#ifndef CLOVER_EVALFILE
#define CLOVER_EVALFILE "../../engine/clover-9.1/src/quantised.nnue"
#endif
#define EVALFILE CLOVER_EVALFILE
namespace CloverIOS {
#include "../../engine/clover-9.1/src/cuckoo.h"
#include "../../engine/clover-9.1/src/uci.h"
}
class CloverBackend final : public ChessEngineBackend {
    std::unique_ptr<CloverIOS::UCI> uci;
public:
    CloverBackend() {
        static std::once_flag initialized;
        std::call_once(initialized,[]{CloverIOS::init_defs();CloverIOS::attacks::init();CloverIOS::cuckoo::init();CloverIOS::load_nnue_weights();});
        uci=std::make_unique<CloverIOS::UCI>();
        uci->native_init();
    }
    ~CloverBackend() override { stop(); uci.reset(); CloverIOS::thread_pool.create_pool(0); CloverIOS::TT.reset(); clover_tb_free(); }
    void stop() override { CloverIOS::thread_pool.stop(); CloverIOS::thread_pool.wait_for_finish(); }
    void command(const std::string& text) override {
        if(text=="stop" || text=="quit") { stop(); return; }
        if(text.rfind("setoption name Skill Level ",0)==0 || text.rfind("setoption name UCI_ShowWDL ",0)==0 || text.rfind("setoption name SyzygyPath ",0)==0) return;
        stop(); uci->native_command(text);
    }
};
std::unique_ptr<ChessEngineBackend> makeClover() { return std::make_unique<CloverBackend>(); }
