#import <Foundation/Foundation.h>
@interface ChessBackgroundGame : NSObject
+ (instancetype)shared;
- (void)registerTasks;
- (void)updateForegroundMatch:(NSDictionary *)data;
- (void)beginSearchProgress;
- (void)receiveSearchProgress:(NSString *)line;
- (void)recordLifecycleEvent:(NSString *)event;
- (BOOL)start:(NSDictionary *)data tournament:(NSDictionary *)tournament;
- (void)stopForForeground;
- (void)pauseForScreenLock;
@property(nonatomic,readonly) BOOL active;
@property(nonatomic,readonly) BOOL hasCheckpoint;
@property(nonatomic,copy) void (^expired)(void);
@property(nonatomic,copy) void (^matchCancelled)(void);
@end
