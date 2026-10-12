// GPLv3/AGPLv3 combined research engine; retained grants: engine/karsli-1.0/NOTICE.md.
// Compiled with Stockfish=KarsliIOS, independently of the existing Stockfish backend.
#include "ChessEngineBackend.h"
#include "KarsliProfile.h"
#include "../../engine/karsli-1.0/src/attacks.h"
#include "../../engine/karsli-1.0/src/position.h"
#include "../../engine/karsli-1.0/src/uci.h"
#include "../../engine/karsli-1.0/src/tune.h"
#include <iostream>
namespace {
class KarsliBackend final : public ChessEngineBackend {
    std::string executable;
    char *argv[2];
    std::unique_ptr<Stockfish::UCIEngine> engine;
public:
    KarsliBackend(const std::string& path,const std::string& resources)
      : executable(path),argv{executable.data(),nullptr} {
        static bool initialized=false;
        if(!initialized){Stockfish::Attacks::init();Stockfish::Position::init();initialized=true;}
        engine=std::make_unique<Stockfish::UCIEngine>(Stockfish::CommandLine(1,argv));
        Stockfish::Tune::init(engine->engine_options());
        engine->command("setoption name EvalFile value "+resources+"/nn-1a298aa575a0.nnue");
        // The phone's selectable Karsli entry always runs the tested full blend.
        for(const auto& setting:KarsliIOSProfile)engine->command(setting.command);
    }
    ~KarsliBackend() override {engine->stop_and_wait();}
    void command(const std::string& command) override {
        if(command=="uci") {
            // Report current values, rather than the standalone UCI defaults.
            std::cout<<"info string Karsli profile "<<KarsliIOSProfileSHA256;
            for(const auto& setting:KarsliIOSProfile)
                std::cout<<" | "<<setting.name<<"="<<int(engine->engine_options()[setting.name]);
            std::cout<<std::endl;
        }
        engine->command(command);
    }
    void stop() override {engine->stop_and_wait();}
};
}
std::unique_ptr<ChessEngineBackend> makeKarsli(const std::string& executable,const std::string& resources){return std::make_unique<KarsliBackend>(executable,resources);}
