#import "BackgroundGame.h"
#import "SFEngine.h"
#import <JavaScriptCore/JavaScriptCore.h>
#import <UIKit/UIKit.h>
#import <BackgroundTasks/BackgroundTasks.h>

@interface ChessBackgroundGame ()
@property(nonatomic,strong) JSContext *context;
@property(nonatomic,strong) JSValue *model;
@property(nonatomic,strong) NSDictionary *job;
@property(nonatomic,copy) NSString *session;
@property(nonatomic) BOOL active;
@property(nonatomic) BOOL hasCheckpoint;
@property(nonatomic) UIBackgroundTaskIdentifier backgroundTask;
@property(nonatomic) NSUInteger generation;
@property(nonatomic) BOOL taskRegistered;
@property(nonatomic) BOOL foregroundMatchRunning;
@property(nonatomic) BOOL continuationCancelled;
@property(nonatomic,copy) NSString *requestedIdentifier;
@property(nonatomic,strong) NSMutableSet<NSString *> *lockPausedRequestIdentifiers;
@property(nonatomic,strong) BGTask *continuedTask;
@property(nonatomic,copy) NSString *activityTitle;
@property(nonatomic) int64_t activityUnits;
@property(nonatomic) int64_t lastSearchNodes;
@property(nonatomic) NSUInteger activityMoves;
@property(nonatomic) NSTimeInterval lastProgressAt;
@property(nonatomic) NSTimeInterval lastDiagnosticProgressAt;
@property(nonatomic,strong) NSError *taskRequestError;
@end
@implementation ChessBackgroundGame
+ (instancetype)shared {static ChessBackgroundGame *value;static dispatch_once_t once;dispatch_once(&once,^{value=[ChessBackgroundGame new];value.backgroundTask=UIBackgroundTaskInvalid;});return value;}
- (void)recordLifecycleEvent:(NSString *)event {
    // Keep enough local evidence to distinguish a missed handoff from an OS
    // cancellation during a real screen lock. Never record positions or PGNs.
    NSMutableArray *events=[[NSUserDefaults.standardUserDefaults arrayForKey:@"ChessBackgroundDiagnostics"] mutableCopy]?:[NSMutableArray new];
    [events addObject:@{@"event":event,@"time":@(NSDate.date.timeIntervalSince1970),@"appState":@(UIApplication.sharedApplication.applicationState),@"nativeActive":@(self.active),@"matchRunning":@(self.foregroundMatchRunning),@"taskGranted":@(self.continuedTask!=nil),@"moves":@(self.activityMoves),@"workUnits":@(self.activityUnits)}];
    while(events.count>64)[events removeObjectAtIndex:0];
    [NSUserDefaults.standardUserDefaults setObject:events forKey:@"ChessBackgroundDiagnostics"];
    NSLog(@"Chess background: %@; native=%d task=%d moves=%lu",event,self.active,self.continuedTask!=nil,(unsigned long)self.activityMoves);
}
// Retain the legacy permitted-task metadata for compatibility. Version 1.3
// no longer submits continued-processing requests for engine matches.
- (void)registerTasks {
    if(@available(iOS 26.0,*)){
        if(self.taskRegistered)return;
        NSString *pattern=[NSBundle.mainBundle.bundleIdentifier stringByAppendingString:@".engine-match.*"];
        self.taskRegistered=[[NSBundle.mainBundle objectForInfoDictionaryKey:@"BGTaskSchedulerPermittedIdentifiers"] containsObject:pattern];
        [self recordLifecycleEvent:self.taskRegistered?@"task-prefix-permitted":@"task-prefix-not-permitted"];
    }
}
- (void)acceptContinuedTask:(BGTask *)task {
    if(@available(iOS 26.0,*)){
        if([self.lockPausedRequestIdentifiers containsObject:task.identifier]){
            [self.lockPausedRequestIdentifiers removeObject:task.identifier];
            [self recordLifecycleEvent:@"locked-task-grant-ignored"];
            [task setTaskCompletedWithSuccess:YES];return;
        }
        if(![task.identifier isEqual:self.requestedIdentifier]||self.continuationCancelled||(!self.foregroundMatchRunning&&!self.active)){
            [self recordLifecycleEvent:@"stale-task-rejected"];
            [task setTaskCompletedWithSuccess:NO];return;
        }
        self.continuedTask=task;
        [self recordLifecycleEvent:@"system-task-granted"];
        __weak ChessBackgroundGame *weak=self;__weak BGTask *weakTask=task;
        task.expirationHandler=^{dispatch_async(dispatch_get_main_queue(),^{
            ChessBackgroundGame *host=weak;
            if(!host||!weakTask||host.continuedTask!=weakTask)return;
            [host recordLifecycleEvent:@"system-task-expired"];
            host.continuationCancelled=YES;
            if(host.active)[host expire];else [host finishContinuedTask:NO];
            if(host.matchCancelled)host.matchCancelled();
        });};
        // Chess has no known final move count. Report real work with
        // indeterminate progress, rather than inventing a completion percent.
        ((BGContinuedProcessingTask *)task).progress.totalUnitCount=-1;
        [self updateActivityMoves:self.activityMoves];
        [self finishTask];
    }
}
- (void)finishContinuedTask:(BOOL)success {
    if(@available(iOS 26.0,*)){
        if(self.continuedTask||self.requestedIdentifier)[self recordLifecycleEvent:success?@"task-completed":@"task-ended-unsuccessfully"];
        NSString *identifier=self.requestedIdentifier;self.requestedIdentifier=nil;
        BGTask *task=self.continuedTask;self.continuedTask=nil;
        if(task){
            task.expirationHandler=nil;
            if(success){NSProgress *progress=((BGContinuedProcessingTask *)task).progress;progress.totalUnitCount=MAX((int64_t)1,self.activityUnits);progress.completedUnitCount=progress.totalUnitCount;}
            [task setTaskCompletedWithSuccess:success];
        }
        else if(identifier)[BGTaskScheduler.sharedScheduler cancelTaskRequestWithIdentifier:identifier];
    }
}
- (void)updateForegroundMatch:(NSDictionary *)data {
    NSDictionary *match=data[@"engineMatch"],*progress=data[@"engineMatchProgress"];
    self.foregroundMatchRunning=[data[@"settings"][@"opponent"] isEqual:@"match"]&&[match isKindOfClass:NSDictionary.class]&&![match[@"paused"] boolValue]&&![progress[@"complete"] boolValue];
    // Matches now pause whenever the app becomes inactive. Do not submit
    // continued-processing requests, which create a system Live Activity.
    self.continuationCancelled=NO;
    [self finishContinuedTask:YES];
}
- (void)updateActivityMoves:(NSUInteger)moves {
    if(moves>self.activityMoves)self.activityUnits+=(int64_t)(moves-self.activityMoves);
    self.activityMoves=moves;
    if(@available(iOS 26.0,*)){
        BGContinuedProcessingTask *task=(BGContinuedProcessingTask *)self.continuedTask;
        if(!task)return;
        task.progress.completedUnitCount=self.activityUnits;
        NSString *subtitle=[NSString stringWithFormat:@"Playing move %lu",(unsigned long)(moves/2+1)];
        if(![task.subtitle isEqual:subtitle])[task updateTitle:self.activityTitle?:@"Engine Match" subtitle:subtitle];
    }
}
- (void)beginSearchProgress {self.lastSearchNodes=0;}
- (void)receiveSearchProgress:(NSString *)line {
    if(!self.continuedTask||![line hasPrefix:@"info "])return;
    NSArray *parts=[line componentsSeparatedByString:@" "];NSUInteger index=[parts indexOfObject:@"nodes"];
    if(index==NSNotFound||index+1>=parts.count)return;
    int64_t nodes=[parts[index+1] longLongValue];
    if(nodes<=self.lastSearchNodes)return;
    self.activityUnits+=nodes-self.lastSearchNodes;self.lastSearchNodes=nodes;
    NSTimeInterval now=NSProcessInfo.processInfo.systemUptime;
    if(now-self.lastProgressAt>=1){self.lastProgressAt=now;[self updateActivityMoves:self.activityMoves];}
    if(UIApplication.sharedApplication.applicationState!=UIApplicationStateActive&&now-self.lastDiagnosticProgressAt>=5){self.lastDiagnosticProgressAt=now;[self recordLifecycleEvent:@"search-progress"];} 
}
- (void)finishTask {
    if(self.backgroundTask!=UIBackgroundTaskInvalid){[UIApplication.sharedApplication endBackgroundTask:self.backgroundTask];self.backgroundTask=UIBackgroundTaskInvalid;}
}
- (BOOL)start:(NSDictionary *)data tournament:(NSDictionary *)tournament {
    if(self.active)return NO;
    if(self.continuationCancelled&&[data[@"settings"][@"opponent"] isEqual:@"match"])return NO;
    self.context=[JSContext new];
    self.context.exceptionHandler=^(JSContext *ctx,JSValue *error){NSLog(@"Background chess model: %@",error);ctx.exception=error;};
    NSURL *url=[NSBundle.mainBundle URLForResource:@"background-model" withExtension:@"js"];
    [self.context evaluateScript:[NSString stringWithContentsOfURL:url encoding:NSUTF8StringEncoding error:nil]];
    self.context[@"initialData"]=data;self.context[@"initialTournament"]=tournament?:NSNull.null;
    self.model=[self.context evaluateScript:@"new BackgroundGame(initialData,initialTournament)"];
    if(self.context.exception||self.model.isUndefined){[self recordLifecycleEvent:@"native-model-start-failed"];self.context=nil;self.model=nil;return NO;}
    __weak ChessBackgroundGame *weak=self;
    if(!self.continuedTask)self.backgroundTask=[UIApplication.sharedApplication beginBackgroundTaskWithName:@"Continue chess game" expirationHandler:^{
        ChessBackgroundGame *host=weak;
        [host expire];
    }];
    self.active=YES;self.hasCheckpoint=YES;self.generation++;
    [self recordLifecycleEvent:@"native-model-started"];
    [self nextMove];return YES;
}
- (void)save:(BOOL)resume {
    NSDictionary *snapshot=[[self.model invokeMethod:@"checkpoint" withArguments:@[@(resume)]] toDictionary];
    if(!snapshot||self.context.exception)return;
    [self updateActivityMoves:[snapshot[@"moves"] unsignedIntegerValue]];
    NSMutableDictionary *storage=[[NSUserDefaults.standardUserDefaults dictionaryForKey:@"ChessStorage"] mutableCopy]?:[NSMutableDictionary new];
    for(NSArray *pair in @[@[@"data",@"chess-preview-v2"],@[@"tournament",@"chess-preview-tournament"]]){
        id value=snapshot[pair[0]];if(!value||value==NSNull.null)continue;
        NSData *json=[NSJSONSerialization dataWithJSONObject:value options:0 error:nil];
        if(json)storage[pair[1]]=[[NSString alloc] initWithData:json encoding:NSUTF8StringEncoding];
    }
    [NSUserDefaults.standardUserDefaults setObject:storage forKey:@"ChessStorage"];

}
- (void)nextMove {
    if(!self.active)return;
    JSValue *result=[self.model invokeMethod:@"next" withArguments:@[]];
    if(self.context.exception){[self expire];return;}
    [self save:NO];
    if(result.isNull||result.isUndefined){[self endRun:NO];return;}
    self.job=result.toDictionary;
    NSString *book=self.job[@"book"];
    if([book isKindOfClass:NSString.class]){
        NSUInteger generation=self.generation;__weak ChessBackgroundGame *weak=self;
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW,350*NSEC_PER_MSEC),dispatch_get_main_queue(),^{if(weak.active&&weak.generation==generation)[weak acceptMove:book];});return;
    }
    self.session=NSUUID.UUID.UUIDString;NSString *session=self.session;__weak ChessBackgroundGame *weak=self;
    [[SFEngine shared] open:session engine:self.job[@"engine"] output:^(NSString *identifier,NSString *line){
        ChessBackgroundGame *host=weak;if(!host.active||![host.session isEqual:identifier])return;
        [host receiveSearchProgress:line];
        if([line isEqual:@"readyok"]){
            [host beginSearchProgress];
            [[SFEngine shared] send:[@"position fen " stringByAppendingString:host.job[@"fen"]] session:identifier];
            NSDictionary *c=host.job[@"clock"];
            NSString *go=[c isKindOfClass:NSDictionary.class]?[NSString stringWithFormat:@"go wtime %@ btime %@ winc %@ binc %@",c[@"wtime"],c[@"btime"],c[@"winc"],c[@"binc"]]:[NSString stringWithFormat:@"go movetime %@",host.job[@"milliseconds"]];
            [[SFEngine shared] send:go session:identifier];
        }else if([line hasPrefix:@"bestmove "]){
            NSString *move=[[line componentsSeparatedByString:@" "] objectAtIndex:1];[host acceptMove:move];
        }
    }];
    for(NSString *cmd in @[@"uci",[NSString stringWithFormat:@"setoption name Threads value %@",self.job[@"threads"]],[NSString stringWithFormat:@"setoption name Hash value %@",self.job[@"hash"]],@"setoption name MultiPV value 1",[NSString stringWithFormat:@"setoption name Skill Level value %@",self.job[@"level"]],@"isready"])[[SFEngine shared] send:cmd session:session];
}
- (void)acceptMove:(NSString *)move {
    if(!self.active)return;
    [self.model invokeMethod:@"advance" withArguments:@[move]];
    if(self.context.exception){[self expire];return;}
    [self save:NO];
    NSUInteger generation=self.generation;__weak ChessBackgroundGame *weak=self;
    dispatch_async(dispatch_get_main_queue(),^{if(weak.active&&weak.generation==generation)[weak nextMove];});
}
- (void)endRun:(BOOL)resume { [self endRun:resume intentionalPause:NO]; }
- (void)endRun:(BOOL)resume intentionalPause:(BOOL)intentionalPause {
    [self recordLifecycleEvent:resume?@"native-returning-to-foreground":@"native-model-stopped"];
    self.active=NO;self.generation++;NSUInteger endingGeneration=self.generation;
    BOOL completed=NO;
    if(self.model){JSValue *snapshot=[self.model invokeMethod:@"stop" withArguments:@[@(resume)]];completed=[snapshot[@"completed"] toBool];[self save:resume];}
    self.model=nil;self.context=nil;self.job=nil;
    NSString *session=self.session;self.session=nil;
    UIBackgroundTaskIdentifier assertion=self.backgroundTask;self.backgroundTask=UIBackgroundTaskInvalid;
    __weak ChessBackgroundGame *weak=self;
    [[SFEngine shared] stop:session?:@"" completion:^{
        if(session)[[SFEngine shared] close:session];
        if(assertion!=UIBackgroundTaskInvalid)[UIApplication.sharedApplication endBackgroundTask:assertion];
        if(!resume&&!intentionalPause&&weak.generation==endingGeneration){weak.foregroundMatchRunning=NO;[weak finishContinuedTask:completed];}
    }];
}
- (void)pauseForScreenLock {
    [self recordLifecycleEvent:@"screen-lock-pause"];
    self.continuationCancelled=YES;
    // Submission runs off the main queue; cancellation can precede the OS
    // grant. Remember only pending requests so a late grant cannot restart
    // the locked match or report an intentional pause as a failed task.
    if(self.requestedIdentifier&&!self.continuedTask){
        if(!self.lockPausedRequestIdentifiers)self.lockPausedRequestIdentifiers=[NSMutableSet new];
        [self.lockPausedRequestIdentifiers addObject:self.requestedIdentifier];
    }
    if(self.active){
        JSValue *data=self.model[@"data"],*match=data[@"engineMatch"];
        if([data[@"settings"][@"opponent"].toString isEqual:@"match"]&&!match.isNull&&!match.isUndefined)match[@"paused"]=@YES;
        [self endRun:NO intentionalPause:YES];
    }else [self finishTask];
    self.foregroundMatchRunning=NO;
    // Complete immediately after checkpointing, before asynchronous engine
    // shutdown. An already queued expiration callback then sees no task.
    [self finishContinuedTask:YES];
}
- (void)stopForForeground {
    if(self.active)[self endRun:YES];else [self finishTask];
}
- (void)expire {
    [self recordLifecycleEvent:@"native-background-expired"];
    BOOL hadWork=self.active;
    if(hadWork)[self endRun:NO];else [self finishTask];
    if(self.expired)self.expired();
}
@end
