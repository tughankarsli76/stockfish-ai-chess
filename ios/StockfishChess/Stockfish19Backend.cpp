#include "ChessEngineBackend.h"
#include "../../engine/stockfish-progress/src/attacks.h"
#include "../../engine/stockfish-progress/src/position.h"
#include "../../engine/stockfish-progress/src/uci.h"
#include "../../engine/stockfish-progress/src/tune.h"
namespace {
class Backend19 final : public ChessEngineBackend {
    std::string executable;
    char *argv[2];
    std::unique_ptr<Stockfish::UCIEngine> engine;
public:
    Backend19(const std::string& path,const std::string& resources):executable(path),argv{executable.data(),nullptr} {
        static bool initialized=false;
        if(!initialized){Stockfish::Attacks::init();Stockfish::Position::init();initialized=true;}
        engine=std::make_unique<Stockfish::UCIEngine>(Stockfish::CommandLine(1,argv));
        Stockfish::Tune::init(engine->engine_options());
        engine->command("setoption name EvalFile value "+resources+"/nn-1a298aa575a0.nnue");
    }
    ~Backend19() override { engine->stop_and_wait(); }
    void command(const std::string& command) override {engine->command(command);}
    void stop() override {engine->stop_and_wait();}
};
}
std::unique_ptr<ChessEngineBackend> makeStockfish19(const std::string& executable,const std::string& resources) {return std::make_unique<Backend19>(executable,resources);}
