// AGPL-3.0; hosts the accompanying Reckless 0.9.0 library in-process.
#include "ChessEngineBackend.h"
#include <iostream>
#include <thread>
extern "C" {
void *reckless_create(void (*)(const unsigned char *, size_t));
void reckless_command(void *, const char *);
void reckless_prepare(void *);
void reckless_stop(void *);
void reckless_destroy(void *);
}
class RecklessBackend final : public ChessEngineBackend {
    void *handle;
    std::thread search;
public:
    RecklessBackend() : handle(reckless_create([](const unsigned char *bytes, size_t count) {
        std::cout.write(reinterpret_cast<const char *>(bytes), count);
    })) {}
    ~RecklessBackend() override { stop(); reckless_destroy(handle); }
    void stop() override {
        reckless_stop(handle);
        if(search.joinable()) search.join();
    }
    void command(const std::string& text) override {
        if(text=="stop" || text=="quit") { stop(); return; }
        // Unsupported Stockfish-specific options must not alter Reckless.
        if(text.rfind("setoption name Skill Level ",0)==0 || text.rfind("setoption name UCI_ShowWDL ",0)==0 || text.rfind("setoption name SyzygyPath ",0)==0) return;
        stop();
        if(text.rfind("go ",0)==0) {
            reckless_prepare(handle);
            search=std::thread([this,text]{reckless_command(handle,text.c_str());});
        } else reckless_command(handle,text.c_str());
    }
};
std::unique_ptr<ChessEngineBackend> makeReckless() { return std::make_unique<RecklessBackend>(); }
