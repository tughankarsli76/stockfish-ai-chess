// GPL-3.0-or-later; links the accompanying modified Stockfish 19 source.
#import "SFEngine.h"
#import "TablebasePaths.h"
#include "ChessEngineBackend.h"
#include <functional>
#include <iostream>
#include <mutex>
#include <sstream>
#include <streambuf>

// Stockfish's synchronized UCI output (including its node heartbeat) stays
// in-process. Never redirect stdin/stdout file descriptors or create a subprocess.
class LineOutput : public std::streambuf {
    std::string pending;
    std::mutex mutex;
public:
    std::function<void(std::string)> sink;
    int overflow(int c) override {
        if (c == traits_type::eof()) return traits_type::not_eof(c);
        std::lock_guard<std::mutex> lock(mutex);
        if(c == '\n') { if(sink) sink(pending); pending.clear(); }
        else pending += char(c);
        return c;
    }
    int sync() override { return 0; }
};

@implementation SFEngine {
    dispatch_queue_t _queue;
    std::unique_ptr<ChessEngineBackend> _engine;
    NSString *_engineID;
    NSString *_syzygyPath;
    LineOutput _output;
    NSString *_session;
    void (^_receive)(NSString *, NSString *);
}
+ (instancetype)shared { static SFEngine *instance; static dispatch_once_t once; dispatch_once(&once, ^{ instance = [SFEngine new]; }); return instance; }
- (instancetype)init { if((self=[super init])) _queue=dispatch_queue_create("chess.stockfish.commands", DISPATCH_QUEUE_SERIAL); return self; }
- (void)open:(NSString *)session engine:(NSString *)engineID output:(void (^)(NSString *, NSString *))output {
    dispatch_async(_queue, ^{
        if(self->_engine) self->_engine->stop();
        if(![self->_engineID isEqual:engineID]){self->_engine.reset();self->_syzygyPath=nil;}
        self->_engineID=[engineID copy];
        self->_session=[session copy]; self->_receive=[output copy];
        if(!self->_engine) {
            self->_output.sink=[self](std::string line) {
                NSString *text=[[NSString alloc] initWithBytes:line.data() length:line.size() encoding:NSUTF8StringEncoding];
                NSString *identifier=self->_session;
                void (^receive)(NSString *, NSString *)=self->_receive;
                if(text && identifier && receive) dispatch_async(dispatch_get_main_queue(), ^{ receive(identifier, text); });
            };
            std::cout.rdbuf(&self->_output);
            const std::string executable=NSBundle.mainBundle.executablePath.UTF8String;
            const std::string resources=NSBundle.mainBundle.resourcePath.UTF8String;
            self->_engine=[engineID isEqual:@"obsidian160"]?makeObsidian():[engineID isEqual:@"pawn201"]?makePawnocchio():[engineID isEqual:@"plenty800"]?makePlentyChess():[engineID isEqual:@"reckless090"]?makeReckless():[engineID isEqual:@"cinder061"]?makeCinder():[engineID isEqual:@"viridithas200"]?makeViridithas():[engineID isEqual:@"halogen160"]?makeHalogen():[engineID isEqual:@"clover91"]?makeClover():[engineID isEqual:@"starzix61"]?makeStarzix():makeStockfish19(executable,resources);
        }
        // Use every available tablebase file, including optional completed downloads.
        // Reset any limit left by an earlier session; this is an internal engine default.
        if([engineID isEqual:@"stockfish19"])self->_engine->command("setoption name SyzygyProbeLimit value 7");
        self->_engine->command("ucinewgame");
    });
}
- (void)send:(NSString *)command session:(NSString *)session {
    // Resolve the default to our bundled offline data, never a web-supplied path.
    if([command isEqual:@"setoption name SyzygyPath value <empty>"]) {
        NSString *path=ChessTablebaseSearchPath();
        command=[@"setoption name SyzygyPath value " stringByAppendingString:path];
    }
    dispatch_async(_queue, ^{ if([self->_session isEqual:session] && self->_engine) {
        if([command hasPrefix:@"position fen "] && [self->_engineID isEqual:@"stockfish19"]) {
            NSString *path=ChessTablebaseSearchPath();
            if(![self->_syzygyPath isEqual:path]){self->_engine->command([@"setoption name SyzygyPath value " stringByAppendingString:path].UTF8String);self->_syzygyPath=path;}
        }
        self->_engine->command(command.UTF8String);
    } });
}
- (void)close:(NSString *)session {
    dispatch_async(_queue, ^{ if([self->_session isEqual:session]) { self->_engine->stop(); self->_session=nil; self->_receive=nil; } });
}
- (void)suspend {
    dispatch_async(_queue, ^{ if(self->_engine) self->_engine->stop(); self->_session=nil; self->_receive=nil; });
}
- (void)stop:(NSString *)session completion:(void (^)(void))completion {
    dispatch_async(_queue, ^{
        if([self->_session isEqual:session] && self->_engine) self->_engine->stop();
        // Output callbacks (including bestmove) are enqueued before completion.
        dispatch_async(dispatch_get_main_queue(), completion);
    });
}
@end
