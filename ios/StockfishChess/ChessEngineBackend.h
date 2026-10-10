// GPL-3.0-or-later. One engine owns the native output stream at a time.
#pragma once
#include <memory>
#include <string>
struct ChessEngineBackend {
    virtual ~ChessEngineBackend() = default;
    virtual void command(const std::string&) = 0;
    virtual void stop() = 0;
};
std::unique_ptr<ChessEngineBackend> makeStockfish19(const std::string& executable, const std::string& resources);
std::unique_ptr<ChessEngineBackend> makeReckless();
std::unique_ptr<ChessEngineBackend> makePlentyChess();
std::unique_ptr<ChessEngineBackend> makePawnocchio();
std::unique_ptr<ChessEngineBackend> makeObsidian();
std::unique_ptr<ChessEngineBackend> makeCinder();
std::unique_ptr<ChessEngineBackend> makeViridithas();
std::unique_ptr<ChessEngineBackend> makeHalogen();
std::unique_ptr<ChessEngineBackend> makeClover();
std::unique_ptr<ChessEngineBackend> makeStarzix();
