// AGPL-3.0-or-later. The host joins a stopped search before switching engines.
#include "ChessEngineBackend.h"
#include <condition_variable>
#include <iostream>
#include <mutex>
extern "C" {
void *cinder_create(void (*)(const unsigned char *, size_t));
void cinder_command(void *, const char *);
void cinder_destroy(void *);
void *viridithas_create(void (*)(const unsigned char *, size_t));
void viridithas_command(void *, const char *);
void viridithas_destroy(void *);
}
class AsyncRustBackend final : public ChessEngineBackend {
    using Create = void *(*)(void (*)(const unsigned char *, size_t));
    using Command = void (*)(void *, const char *);
    using Destroy = void (*)(void *);
    static AsyncRustBackend *active;
    void *handle;
    Command send;
    Destroy destroy;
    std::mutex mutex;
    std::condition_variable finished;
    bool searching = false;
    static void receive(const unsigned char *bytes, size_t count) {
        const std::string line(reinterpret_cast<const char *>(bytes), count);
        std::cout << line;
        if(line.rfind("bestmove ",0)==0 && active) {
            std::lock_guard<std::mutex> lock(active->mutex);
            active->searching=false;
            active->finished.notify_all();
        }
    }
public:
    AsyncRustBackend(Create create, Command command, Destroy close) : send(command), destroy(close) {
        active=this;
        handle=create(receive);
    }
    ~AsyncRustBackend() override { stop(); destroy(handle); active=nullptr; }
    void stop() override {
        std::unique_lock<std::mutex> lock(mutex);
        if(!searching) return;
        send(handle,"stop");
        finished.wait(lock,[this]{return !searching;});
    }
    void command(const std::string& text) override {
        if(text=="stop" || text=="quit") { stop(); return; }
        if(text.rfind("setoption name Skill Level ",0)==0 || text.rfind("setoption name UCI_ShowWDL ",0)==0 || text.rfind("setoption name SyzygyPath ",0)==0) return;
        stop();
        if(text.rfind("go ",0)==0) { std::lock_guard<std::mutex> lock(mutex); searching=true; }
        send(handle,text.c_str());
    }
};
AsyncRustBackend *AsyncRustBackend::active=nullptr;
std::unique_ptr<ChessEngineBackend> makeCinder() { return std::make_unique<AsyncRustBackend>(cinder_create,cinder_command,cinder_destroy); }
std::unique_ptr<ChessEngineBackend> makeViridithas() { return std::make_unique<AsyncRustBackend>(viridithas_create,viridithas_command,viridithas_destroy); }
