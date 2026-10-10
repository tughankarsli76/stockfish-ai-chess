// GPL-3.0-or-later. Pawnocchio 2.0.1 in-process Zig adapter.
#include "ChessEngineBackend.h"
#include <iostream>
#include <stdexcept>
extern "C" {
bool pawnocchio_create(void (*)(const unsigned char *, size_t));
bool pawnocchio_command(const char *);
void pawnocchio_stop();
void pawnocchio_destroy();
}
class PawnocchioBackend final : public ChessEngineBackend {
public:
    PawnocchioBackend() {
        if(!pawnocchio_create([](const unsigned char *bytes, size_t count) {
            std::cout.write(reinterpret_cast<const char *>(bytes), count);
        })) throw std::runtime_error("Pawnocchio initialization failed");
    }
    ~PawnocchioBackend() override { pawnocchio_destroy(); }
    void stop() override { pawnocchio_stop(); }
    void command(const std::string& text) override {
        if(text=="stop" || text=="quit") { stop(); return; }
        if(text.rfind("setoption name Skill Level ",0)==0 || text.rfind("setoption name MultiPV ",0)==0 || text.rfind("setoption name SyzygyPath ",0)==0) return;
        if(!pawnocchio_command(text.c_str())) std::cout << "info string Pawnocchio command failed" << std::endl;
    }
};
std::unique_ptr<ChessEngineBackend> makePawnocchio() { return std::make_unique<PawnocchioBackend>(); }
