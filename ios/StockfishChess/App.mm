#import <UIKit/UIKit.h>
#import <AVFAudio/AVFAudio.h>
#import <WebKit/WebKit.h>
#import <UniformTypeIdentifiers/UniformTypeIdentifiers.h>
#import "SFEngine.h"
#import "CPUCoreInfo.h"
#import "BackgroundGame.h"
#import "TablebaseDownload.h"

@interface ChessViewController : UIViewController <WKScriptMessageHandlerWithReply, WKURLSchemeHandler, WKNavigationDelegate, WKUIDelegate, UIDocumentPickerDelegate>
@property(nonatomic,strong) WKWebView *webView;
@property(nonatomic,strong) UIView *startupCover;
@property(nonatomic) NSTimeInterval startupStartedAt;
@property(atomic) BOOL moveSoundEnabled;
@property(atomic) NSUInteger moveSoundRevision;
@property(atomic,strong) AVAudioPlayer *moveSoundPlayer;
@property(atomic,strong) AVAudioPlayer *moveCaptureSoundPlayer;
@property(nonatomic,strong) dispatch_queue_t moveSoundQueue;
@property(nonatomic) BOOL moveHapticsEnabled;
@property(nonatomic,strong) UIImpactFeedbackGenerator *moveHapticsFeedback;
@property(nonatomic,strong) NSLayoutConstraint *webBottomConstraint;
@property(nonatomic,strong) NSMutableDictionary<NSString *,NSURLSessionDataTask *> *requests;
@property(nonatomic,copy) void (^pickerReply)(id,NSString *);
@property(nonatomic,copy) NSString *activeSession;
@property(nonatomic) BOOL suspended;
@property(nonatomic) BOOL offlineForTesting;
@property(nonatomic) UIBackgroundTaskIdentifier searchBackgroundTask;
@property(nonatomic) BOOL backgrounded;
@property(nonatomic) BOOL backgroundHandoff;
@property(nonatomic) BOOL restoringBackground;
@property(nonatomic) BOOL searchRunning;
@property(nonatomic) BOOL reloadOnForeground;
@property(nonatomic) BOOL screenAwakeRequested;
@property(nonatomic) BOOL inactivityPaused;
@property(nonatomic,strong) NSMutableArray<NSString *> *backgroundLines;
@property(nonatomic,copy) NSString *backgroundProgress;
@property(nonatomic,copy) NSString *backgroundBestMove;
@property(nonatomic) NSTimeInterval backgroundBestMoveAt;
@end
static NSUInteger ChessMaxThreads(void) { return MAX((NSUInteger)1, NSProcessInfo.processInfo.processorCount); }

static NSUInteger ChessMaxHashMB(void) {
    // Device-based budget: keep at least three quarters of RAM outside hash.
    uint64_t budget=NSProcessInfo.processInfo.physicalMemory/(1024ULL*1024ULL*4ULL);
    NSUInteger size=16;
    while(size<=budget/2 && size<16384)size*=2;
    return size;
}

@implementation ChessViewController
- (void)viewDidLoad {
    [super viewDidLoad];
    self.startupStartedAt=NSProcessInfo.processInfo.systemUptime;
    self.view.backgroundColor=[UIColor colorWithRed:239.0/255.0 green:239.0/255.0 blue:245.0/255.0 alpha:1];
    self.requests=[NSMutableDictionary new];
    self.searchBackgroundTask=UIBackgroundTaskInvalid;
    self.backgroundLines=[NSMutableArray new];
    __weak ChessViewController *weakSelf=self;
    [ChessBackgroundGame shared].matchCancelled=^{
        [weakSelf.webView evaluateJavaScript:@"window.dispatchEvent(new CustomEvent('chess-native-lifecycle',{detail:'match-background-expired'}))" completionHandler:nil];
    };
    WKWebViewConfiguration *config=[WKWebViewConfiguration new];
    config.websiteDataStore=WKWebsiteDataStore.defaultDataStore;
    [config setURLSchemeHandler:self forURLScheme:@"chess"];
    [config.userContentController addScriptMessageHandlerWithReply:self contentWorld:WKContentWorld.pageWorld name:@"chess"];
    self.webView=[[WKWebView alloc] initWithFrame:CGRectZero configuration:config];
    self.webView.navigationDelegate=self; self.webView.UIDelegate=self;
    self.webView.inspectable=YES;
    self.webView.opaque=NO; self.webView.backgroundColor=self.view.backgroundColor;
    self.webView.scrollView.contentInsetAdjustmentBehavior=UIScrollViewContentInsetAdjustmentNever;
    self.webView.scrollView.bounces=NO;
    self.webView.scrollView.alwaysBounceVertical=NO;
    self.webView.scrollView.alwaysBounceHorizontal=NO;
    self.webView.scrollView.scrollEnabled=NO;
    self.webView.translatesAutoresizingMaskIntoConstraints=NO;
    [self.view addSubview:self.webView];
    UILayoutGuide *safe=self.view.safeAreaLayoutGuide;
    self.webBottomConstraint=[self.webView.bottomAnchor constraintEqualToAnchor:self.view.keyboardLayoutGuide.topAnchor];
    [NSLayoutConstraint activateConstraints:@[[self.webView.topAnchor constraintEqualToAnchor:safe.topAnchor],self.webBottomConstraint,[self.webView.leadingAnchor constraintEqualToAnchor:safe.leadingAnchor],[self.webView.trailingAnchor constraintEqualToAnchor:safe.trailingAnchor]]];
    // Match the app background while the restored board paints, with no logo,
    // animation or timed splash. Do not reveal the temporary empty HTML board.
    self.startupCover=[[UIView alloc] initWithFrame:self.view.bounds];
    self.startupCover.backgroundColor=self.view.backgroundColor;
    self.startupCover.autoresizingMask=UIViewAutoresizingFlexibleWidth|UIViewAutoresizingFlexibleHeight;
    [self.view addSubview:self.startupCover];
    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"chess://app/index.html"]]];
    [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(enterBackground) name:UIApplicationWillResignActiveNotification object:nil];
    [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(enterForeground) name:UIApplicationDidBecomeActiveNotification object:nil];
    [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(pauseForScreenLock) name:UIApplicationProtectedDataWillBecomeUnavailable object:nil];
    [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(checkScreenLock) name:UIApplicationDidEnterBackgroundNotification object:nil];
}
- (void)viewDidLayoutSubviews {
    [super viewDidLayoutSubviews];
    CGFloat safeBottom=self.view.safeAreaInsets.bottom;
    BOOL keyboardVisible=self.view.keyboardLayoutGuide.layoutFrame.size.height>safeBottom+1;
    // Use a little of the bottom inset while preserving home-gesture clearance.
    CGFloat offset=keyboardVisible?0:MIN(12,MAX(0,safeBottom-20));
    if(self.webBottomConstraint.constant!=offset)self.webBottomConstraint.constant=offset;
}
- (void)refreshBootstrap {
    NSDictionary *saved=[NSUserDefaults.standardUserDefaults dictionaryForKey:@"ChessStorage"] ?: @{};
    NSData *json=[NSJSONSerialization dataWithJSONObject:saved options:0 error:nil];
    NSString *bootstrap=[NSString stringWithContentsOfURL:[NSBundle.mainBundle URLForResource:@"native-bootstrap" withExtension:@"js"] encoding:NSUTF8StringEncoding error:nil];
    NSData *coreJSON=[NSJSONSerialization dataWithJSONObject:ChessCPUCoreInfo() options:0 error:nil];
    NSData *appJSON=[NSJSONSerialization dataWithJSONObject:@{@"version":[NSBundle.mainBundle objectForInfoDictionaryKey:@"CFBundleShortVersionString"]?:@""} options:0 error:nil];
    NSString *source=[NSString stringWithFormat:@"window.__chessSaved=%@;window.__chessMaxThreads=%lu;window.__chessMaxHashMB=%lu;window.__chessMemoryMB=%llu;window.__chessCoreInfo=%@;window.__chessDeviceInfo=%@;window.__chessAppInfo=%@;\n%@",[[NSString alloc] initWithData:json encoding:NSUTF8StringEncoding],(unsigned long)ChessMaxThreads(),(unsigned long)ChessMaxHashMB(),NSProcessInfo.processInfo.physicalMemory/(1024ULL*1024ULL),[[NSString alloc] initWithData:coreJSON encoding:NSUTF8StringEncoding],[[NSString alloc] initWithData:[NSJSONSerialization dataWithJSONObject:ChessDeviceInfo() options:0 error:nil] encoding:NSUTF8StringEncoding],[[NSString alloc] initWithData:appJSON encoding:NSUTF8StringEncoding],bootstrap];
    WKUserContentController *scripts=self.webView.configuration.userContentController;
    [scripts removeAllUserScripts];
    [scripts addUserScript:[[WKUserScript alloc] initWithSource:source injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:YES]];
}
- (void)suspend {
    if(self.suspended)return;
    self.screenAwakeRequested=NO;UIApplication.sharedApplication.idleTimerDisabled=NO;
    [self stopMoveSound];
    [self stopMoveHaptics];
    self.suspended=YES;self.activeSession=nil;
    [[SFEngine shared] suspend];
    self.searchRunning=NO;[self endSearchBackgroundTask];
    [self clearBackgroundLines];
    [self.webView evaluateJavaScript:@"window.dispatchEvent(new CustomEvent('chess-native-lifecycle',{detail:'suspend'}))" completionHandler:nil];
}
- (void)clearBackgroundLines {
    [self.backgroundLines removeAllObjects];self.backgroundProgress=nil;self.backgroundBestMove=nil;self.backgroundBestMoveAt=0;
}
- (void)endSearchBackgroundTask {
    if(self.searchBackgroundTask==UIBackgroundTaskInvalid)return;
    UIBackgroundTaskIdentifier task=self.searchBackgroundTask;
    self.searchBackgroundTask=UIBackgroundTaskInvalid;
    [UIApplication.sharedApplication endBackgroundTask:task];
}
- (void)beginSearchBackgroundTask {
    if(self.searchBackgroundTask!=UIBackgroundTaskInvalid)return;
    __weak ChessViewController *weakSelf=self;
    self.searchBackgroundTask=[UIApplication.sharedApplication beginBackgroundTaskWithName:@"Finish chess search" expirationHandler:^{[weakSelf expireBackgroundSearch];}];
}
- (void)expireBackgroundSearch {
    NSString *session=self.activeSession;
    UIBackgroundTaskIdentifier task=self.searchBackgroundTask;
    // Capture this assertion: a subsequent foreground search may own a new one.
    self.searchBackgroundTask=UIBackgroundTaskInvalid;
    [[SFEngine shared] stop:session?:@"" completion:^{
        if(task!=UIBackgroundTaskInvalid)[UIApplication.sharedApplication endBackgroundTask:task];
    }];
}
- (BOOL)handOffBackgroundGame:(NSDictionary *)data tournament:(NSDictionary *)tournament {
    if(!self.backgrounded||self.backgroundHandoff||[data[@"settings"][@"opponent"] isEqual:@"match"])return NO;
    if(![[ChessBackgroundGame shared] start:data tournament:tournament])return NO;
    self.backgroundHandoff=YES;self.activeSession=nil;self.searchRunning=NO;
    [self endSearchBackgroundTask];[self clearBackgroundLines];return YES;
}
- (BOOL)pausePersistedEngineMatch {
    NSDictionary *storage=[NSUserDefaults.standardUserDefaults dictionaryForKey:@"ChessStorage"];
    NSString *json=storage[@"chess-preview-v2"];
    if(![json isKindOfClass:NSString.class])return NO;
    NSDictionary *data=[NSJSONSerialization JSONObjectWithData:[json dataUsingEncoding:NSUTF8StringEncoding] options:0 error:nil];
    if(![data isKindOfClass:NSDictionary.class]||![data[@"settings"][@"opponent"] isEqual:@"match"]||![data[@"engineMatch"] isKindOfClass:NSDictionary.class])return NO;
    [self pauseForInactivity:@"match-inactive"];
    return YES;
}
- (void)pauseForScreenLock { [self pauseForInactivity:@"screen-lock"]; }
- (void)pauseForInactivity:(NSString *)reason {
    if(self.inactivityPaused)return;
    self.inactivityPaused=YES;self.backgrounded=YES;
    self.screenAwakeRequested=NO;UIApplication.sharedApplication.idleTimerDisabled=NO;
    [self stopMoveSound];[self stopMoveHaptics];
    [[ChessTablebaseDownload shared] pause];
    [[ChessBackgroundGame shared] pauseForScreenLock];
    self.activeSession=nil;self.searchRunning=NO;
    [[SFEngine shared] suspend];[self endSearchBackgroundTask];[self clearBackgroundLines];
    // The native checkpoint wins even if WebKit has already stopped handling
    // events. Match pauses survive unlock; a human game reconnects on return.
    NSMutableDictionary *storage=[[NSUserDefaults.standardUserDefaults dictionaryForKey:@"ChessStorage"] mutableCopy]?:[NSMutableDictionary new];
    NSString *json=storage[@"chess-preview-v2"];
    NSMutableDictionary *data=[json isKindOfClass:NSString.class]?[NSJSONSerialization JSONObjectWithData:[json dataUsingEncoding:NSUTF8StringEncoding] options:NSJSONReadingMutableContainers error:nil]:nil;
    if([data isKindOfClass:NSMutableDictionary.class]){
        NSMutableDictionary *match=data[@"engineMatch"];
        if([match isKindOfClass:NSMutableDictionary.class])match[@"paused"]=@YES;
        NSDictionary *waiting=[data[@"backgroundWaiting"] isKindOfClass:NSDictionary.class]?data[@"backgroundWaiting"]:nil;
        data[@"backgroundResume"]=@NO;[data removeObjectForKey:@"backgroundWaiting"];
        NSMutableDictionary *clock=data[@"clock"];
        if([clock isKindOfClass:NSMutableDictionary.class]){
            NSString *side=clock[@"runningSide"];
            NSTimeInterval savedAt=[clock[@"savedAt"] doubleValue],now=NSDate.date.timeIntervalSince1970*1000;
            BOOL countUp=clock[@"countUp"]?[clock[@"countUp"] boolValue]:![data[@"settings"][@"fixedTime"] isEqual:@NO];
            if(![@[@"w",@"b"] containsObject:side]&&waiting){side=waiting[@"side"];savedAt=[waiting[@"since"] doubleValue];}
            if(savedAt>0&&[@[@"w",@"b"] containsObject:side]){
                NSTimeInterval elapsed=MAX(0,now-savedAt);
                if(countUp){
                    NSMutableDictionary *move=clock[@"moveClock"];
                    NSMutableDictionary *spent=[move isKindOfClass:NSDictionary.class]?move[@"elapsed"]:nil;
                    if([spent isKindOfClass:NSMutableDictionary.class])spent[side]=@([spent[side] doubleValue]+elapsed);
                }else{
                    NSMutableDictionary *current=clock[@"current"],*remaining=current[@"remaining"];
                    if([remaining isKindOfClass:NSMutableDictionary.class]){
                        remaining[side]=@(MAX(0,[remaining[side] doubleValue]-elapsed));
                        if([remaining[side] doubleValue]==0)current[@"expired"]=side;
                    }
                }
            }
            [clock removeObjectForKey:@"runningSide"];clock[@"savedAt"]=@(now);
        }
        NSData *saved=[NSJSONSerialization dataWithJSONObject:data options:0 error:nil];
        if(saved){storage[@"chess-preview-v2"]=[[NSString alloc] initWithData:saved encoding:NSUTF8StringEncoding];[NSUserDefaults.standardUserDefaults setObject:storage forKey:@"ChessStorage"];}
    }
    self.backgroundHandoff=YES;self.reloadOnForeground=YES;
    [[ChessBackgroundGame shared] recordLifecycleEvent:[reason stringByAppendingString:@"-paused"]];
    NSString *event=[NSString stringWithFormat:@"window.dispatchEvent(new CustomEvent('chess-native-lifecycle',{detail:'%@'}))",reason];
    [self.webView evaluateJavaScript:event completionHandler:nil];
}
- (void)checkScreenLock {
    if(!UIApplication.sharedApplication.protectedDataAvailable)[self pauseForScreenLock];
}
- (void)enterBackground {
    [[ChessBackgroundGame shared] recordLifecycleEvent:@"application-inactive"];
    self.screenAwakeRequested=NO;UIApplication.sharedApplication.idleTimerDisabled=NO;
    if(self.inactivityPaused||!UIApplication.sharedApplication.protectedDataAvailable){[self pauseForScreenLock];return;}
    [self stopMoveSound];
    [self stopMoveHaptics];
    [[ChessTablebaseDownload shared] pause];
    if(self.backgrounded||self.suspended)return;
    // Checkpoint and pause matches natively even if WebKit cannot deliver
    // its background event. Normal computer games keep their existing handoff.
    if([self pausePersistedEngineMatch])return;
    self.backgrounded=YES;
    [self.webView evaluateJavaScript:@"window.dispatchEvent(new CustomEvent('chess-native-lifecycle',{detail:'background'}))" completionHandler:nil];
    if(self.searchRunning && self.searchBackgroundTask==UIBackgroundTaskInvalid)[self expireBackgroundSearch];
}
- (void)enterForeground {
    [[ChessBackgroundGame shared] recordLifecycleEvent:@"application-active"];
    self.inactivityPaused=NO;
    if(self.backgroundHandoff){
        [[ChessBackgroundGame shared] recordLifecycleEvent:@"foreground-restoration"];
        [[ChessBackgroundGame shared] stopForForeground];self.backgroundHandoff=NO;self.restoringBackground=YES;self.reloadOnForeground=YES;
    }else [[ChessBackgroundGame shared] stopForForeground];
    if(self.reloadOnForeground){self.reloadOnForeground=NO;self.backgrounded=NO;self.suspended=NO;[self.webView reload];return;}
    if(self.suspended){self.backgrounded=NO;[self resume];return;}
    if(!self.backgrounded)return;
    self.backgrounded=NO;
    [self prepareMoveSound];
    NSMutableArray *lines=[self.backgroundLines mutableCopy];
    if(self.backgroundProgress)[lines addObject:self.backgroundProgress];
    if(self.backgroundBestMove)[lines addObject:self.backgroundBestMove];
    NSData *data=[NSJSONSerialization dataWithJSONObject:@[self.activeSession?:@"",[lines componentsJoinedByString:@"\n"],@{@"type":@"foreground",@"searchFinishedAt":@(self.backgroundBestMoveAt)}] options:0 error:nil];
    [self clearBackgroundLines];
    NSString *js=[NSString stringWithFormat:@"(()=>{const data=%@;window.dispatchEvent(new CustomEvent('chess-native-lifecycle',{detail:data[2]}));window.__chessEngineLine(data[0],data[1]);window.dispatchEvent(new CustomEvent('chess-native-lifecycle',{detail:'foreground-ready'}));})()",[[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]];
    [self.webView evaluateJavaScript:js completionHandler:nil];
}
- (void)receiveEngineLine:(NSString *)line session:(NSString *)identifier {
    if(self.suspended||![self.activeSession isEqual:identifier])return;
    [[ChessBackgroundGame shared] receiveSearchProgress:line];
    if([line hasPrefix:@"bestmove "]){self.searchRunning=NO;[self endSearchBackgroundTask];}
    if(self.backgrounded){
        if([line hasPrefix:@"bestmove "]){self.backgroundBestMove=line;self.backgroundBestMoveAt=NSDate.date.timeIntervalSince1970*1000;}
        else if([line hasPrefix:@"info "] && [line containsString:@" pv "]){
            // Keep a bounded tail of full PVs, separately from node heartbeats.
            [self.backgroundLines addObject:line];
            if(self.backgroundLines.count>48)[self.backgroundLines removeObjectAtIndex:0];
        }else if([line hasPrefix:@"info "])self.backgroundProgress=line;
        else if([line isEqual:@"uciok"]||[line isEqual:@"readyok"]||[line hasPrefix:@"id name "])[self.backgroundLines addObject:line];
        return;
    }
    NSData *data=[NSJSONSerialization dataWithJSONObject:@[identifier,line] options:0 error:nil];
    NSString *js=[NSString stringWithFormat:@"window.__chessEngineLine(...%@)",[[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]];
    [self.webView evaluateJavaScript:js completionHandler:nil];
}
- (void)resume {
    if(!self.suspended)return;
    self.suspended=NO;
    [self prepareMoveSound];
    // Ensure suspension is applied even if WebKit deferred it while inactive.
    [self.webView evaluateJavaScript:@"window.dispatchEvent(new CustomEvent('chess-native-lifecycle',{detail:'suspend'}));window.dispatchEvent(new CustomEvent('chess-native-lifecycle',{detail:'resume'}));" completionHandler:nil];
}
- (void)webViewWebContentProcessDidTerminate:(WKWebView *)webView {
    if(self.backgroundHandoff){self.reloadOnForeground=YES;return;}
    self.activeSession=nil;self.searchRunning=NO;[self endSearchBackgroundTask];[self clearBackgroundLines];[[SFEngine shared] suspend];
    // Do not let a background WebKit recovery start a fresh game/search.
    if(self.backgrounded){self.reloadOnForeground=YES;return;}
    [webView reload];
}
- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation withError:(NSError *)error { NSLog(@"Chess page load failed: %@",error); }
- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
    self.restoringBackground=NO;
    [webView evaluateJavaScript:@"JSON.stringify({url:location.href,squares:document.querySelectorAll('.square').length,toolbar:!!document.querySelector('#toolbarGame')})" completionHandler:^(id result,NSError *error){ NSLog(@"Chess page loaded: %@ %@",result,error?:@""); }];
}
- (void)webView:(WKWebView *)webView startURLSchemeTask:(id<WKURLSchemeTask>)task {
    NSURL *url=task.request.URL;
    NSString *path=url.path.length>1?[url.path substringFromIndex:1]:@"index.html";
    // Normalize both sides: physical iOS devices alias /private/var and /var.
    NSURL *root=[[NSBundle.mainBundle.bundleURL URLByAppendingPathComponent:@"Web"] URLByStandardizingPath];
    NSURL *file=[[root URLByAppendingPathComponent:path] URLByStandardizingPath];
    if(![url.host isEqual:@"app"] || ![file.path hasPrefix:[root.path stringByAppendingString:@"/"]]) { NSLog(@"Chess resource rejected: root=%@ file=%@",root.path,file.path); [task didFailWithError:[NSError errorWithDomain:NSURLErrorDomain code:NSURLErrorNoPermissionsToReadFile userInfo:nil]];return; }
    NSData *data=[NSData dataWithContentsOfURL:file];
    if(!data){[task didFailWithError:[NSError errorWithDomain:NSURLErrorDomain code:NSURLErrorFileDoesNotExist userInfo:nil]];return;}
    NSDictionary *types=@{@"html":@"text/html",@"js":@"text/javascript",@"css":@"text/css",@"json":@"application/json",@"svg":@"image/svg+xml",@"png":@"image/png",@"jpg":@"image/jpeg",@"woff2":@"font/woff2"};
    NSURLResponse *response=[[NSURLResponse alloc] initWithURL:url MIMEType:types[file.pathExtension]?:@"application/octet-stream" expectedContentLength:data.length textEncodingName:@"utf-8"];
    [task didReceiveResponse:response];[task didReceiveData:data];[task didFinish];
}
- (void)webView:(WKWebView *)webView stopURLSchemeTask:(id<WKURLSchemeTask>)task {}
- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigation decisionHandler:(void (^)(WKNavigationActionPolicy))decision {
    NSURL *url=navigation.request.URL;
    if([url.scheme isEqual:@"chess"] && [url.host isEqual:@"app"]) {if(navigation.targetFrame.mainFrame)[self refreshBootstrap];decision(WKNavigationActionPolicyAllow);return;}
    decision(WKNavigationActionPolicyCancel);
    if([@[@"https",@"mailto"] containsObject:url.scheme] && navigation.navigationType==WKNavigationTypeLinkActivated) [UIApplication.sharedApplication openURL:url options:@{} completionHandler:nil];
}
- (WKWebView *)webView:(WKWebView *)webView createWebViewWithConfiguration:(WKWebViewConfiguration *)configuration forNavigationAction:(WKNavigationAction *)navigation windowFeatures:(WKWindowFeatures *)features {
    NSURL *url=navigation.request.URL;
    if([@[@"https",@"mailto"] containsObject:url.scheme]) [UIApplication.sharedApplication openURL:url options:@{} completionHandler:nil];
    return nil;
}
- (BOOL)validCommand:(NSString *)command {
    if(![command isKindOfClass:NSString.class] || command.length>512)return NO;
    NSString *threadPrefix=@"setoption name Threads value ";
    if([command hasPrefix:threadPrefix]) {
        NSString *value=[command substringFromIndex:threadPrefix.length];
        NSInteger count=value.integerValue;
        return count>=1 && count<=(NSInteger)ChessMaxThreads() && [value isEqualToString:[NSString stringWithFormat:@"%ld",(long)count]];
    }
    NSString *hashPrefix=@"setoption name Hash value ";
    if([command hasPrefix:hashPrefix]) {
        NSString *value=[command substringFromIndex:hashPrefix.length];
        NSInteger count=value.integerValue;
        return count>=16 && count<=(NSInteger)ChessMaxHashMB() && [value isEqualToString:[NSString stringWithFormat:@"%ld",(long)count]];
    }
    // Guard native engine material arrays even if a caller bypasses the UI.
    if([command hasPrefix:@"position fen "]) {
        NSString *placement=[[[command substringFromIndex:13] componentsSeparatedByString:@" "] firstObject];
        int counts[2][6]={},total[2]={};
        NSString *types=@"pnbrqk";
        for(NSUInteger i=0;i<placement.length;i++) {
            NSString *piece=[placement substringWithRange:NSMakeRange(i,1)];
            NSRange index=[types rangeOfString:piece.lowercaseString];
            if(index.location==NSNotFound)continue;
            int side=[piece isEqualToString:piece.uppercaseString]?0:1;
            counts[side][index.location]++;total[side]++;
        }
        for(int side=0;side<2;side++) {
            int *c=counts[side];
            if(total[side]>16 || c[0]>8 || c[5]!=1)return NO;
            int promoted=MAX(0,c[1]-2)+MAX(0,c[2]-2)+MAX(0,c[3]-2)+MAX(0,c[4]-1);
            if(promoted>8-c[0])return NO;
        }
    }
    NSArray *patterns=@[@"^(uci|isready|stop|quit|ucinewgame)$",@"^setoption name (MultiPV value [1-3]|Skill Level value ([0-9]|1[0-9]|20)|UCI_ShowWDL value (true|false)|SyzygyPath value <empty>)$",@"^position fen [prnbqkPRNBQK1-8/]+ [wb] (-|K?Q?k?q?) (-|[a-h][36]) [0-9]{1,6} [1-9][0-9]{0,5}$",@"^go (infinite|movetime [1-9][0-9]{0,5}|wtime [1-9][0-9]{0,9} btime [1-9][0-9]{0,9} winc [0-9]{1,5} binc [0-9]{1,5})$"];
    for(NSString *pattern in patterns)if([command rangeOfString:pattern options:NSRegularExpressionSearch].location!=NSNotFound)return YES;
    return NO;
}
- (BOOL)queueMoveSound:(BOOL)play capture:(BOOL)capture {
    if(!self.moveSoundEnabled || self.backgrounded || self.suspended || UIApplication.sharedApplication.applicationState!=UIApplicationStateActive)return NO;
    if(!self.moveSoundQueue)self.moveSoundQueue=dispatch_queue_create("chess.move-sound",DISPATCH_QUEUE_SERIAL);
    NSUInteger revision=self.moveSoundRevision;
    dispatch_async(self.moveSoundQueue,^{
        if(revision!=self.moveSoundRevision || !self.moveSoundEnabled)return;
        AVAudioPlayer *player=capture?self.moveCaptureSoundPlayer:self.moveSoundPlayer;
        if(!player){
            // Session activation and file decoding stay off the UI thread.
            // Ambient audio respects Silent mode and coexists with music.
            if(![AVAudioSession.sharedInstance setCategory:AVAudioSessionCategoryAmbient error:nil])return;
            // Use the unmodified Standard move/capture sounds and default volume from Lichess Mobile.
            NSURL *url=[NSBundle.mainBundle URLForResource:(capture?@"capture-lichess":@"move-lichess") withExtension:@"aifc" subdirectory:@"Web/assets/audio"];
            if(!url)return;
            player=[[AVAudioPlayer alloc] initWithContentsOfURL:url error:nil];
            player.volume=0.8;
            [player prepareToPlay];
            if(capture)self.moveCaptureSoundPlayer=player;
            else self.moveSoundPlayer=player;
        }
        // A disable/background event may have arrived while audio was preparing.
        if(revision!=self.moveSoundRevision || !self.moveSoundEnabled){[player stop];if(capture)self.moveCaptureSoundPlayer=nil;else self.moveSoundPlayer=nil;return;}
        if(play){
            player.currentTime=0;
            [player play];
        }
    });
    return YES;
}
- (void)prepareMoveSound {
    [self queueMoveSound:NO capture:NO];
    [self queueMoveSound:NO capture:YES];
}
- (BOOL)playMoveSound:(BOOL)capture {
    return [self queueMoveSound:YES capture:capture];
}
- (void)stopMoveSound {
    self.moveSoundRevision++;
    if(self.moveSoundQueue)dispatch_async(self.moveSoundQueue,^{[self.moveSoundPlayer stop];self.moveSoundPlayer=nil;[self.moveCaptureSoundPlayer stop];self.moveCaptureSoundPlayer=nil;});
}
- (BOOL)playMoveHaptics {
    if(!self.moveHapticsEnabled || self.backgrounded || self.suspended || UIApplication.sharedApplication.applicationState!=UIApplicationStateActive)return NO;
    if(!self.moveHapticsFeedback){
        if(@available(iOS 17.5,*))self.moveHapticsFeedback=[UIImpactFeedbackGenerator feedbackGeneratorWithStyle:UIImpactFeedbackStyleMedium forView:self.view];
        else self.moveHapticsFeedback=[[UIImpactFeedbackGenerator alloc] initWithStyle:UIImpactFeedbackStyleMedium];
    }
    [self.moveHapticsFeedback impactOccurredWithIntensity:0.85];
    [self.moveHapticsFeedback prepare];
    return YES;
}
- (void)stopMoveHaptics {
    if(!self.moveHapticsFeedback)return;
    if(@available(iOS 17.5,*))[self.view removeInteraction:self.moveHapticsFeedback];
    self.moveHapticsFeedback=nil;
}
- (void)userContentController:(WKUserContentController *)controller didReceiveScriptMessage:(WKScriptMessage *)message replyHandler:(void (^)(id, NSString *))reply {
    if(!message.frameInfo.mainFrame || ![message.frameInfo.request.URL.host isEqual:@"app"] || ![message.frameInfo.request.URL.scheme isEqual:@"chess"] || ![message.body isKindOfClass:NSDictionary.class]){reply(nil,@"Untrusted frame");return;}
    NSDictionary *body=message.body; NSString *action=body[@"action"];
    if([action isEqual:@"interfaceReady"]){
        if(self.startupCover){
            [self.startupCover removeFromSuperview];self.startupCover=nil;
            NSLog(@"Chess first complete board: %.0f ms",(NSProcessInfo.processInfo.systemUptime-self.startupStartedAt)*1000);
        }
        reply(@YES,nil);
    }else if([action isEqual:@"moveSoundEnabled"]){
        self.moveSoundEnabled=[body[@"enabled"] isEqual:@YES];
        if(self.moveSoundEnabled)[self prepareMoveSound];
        else [self stopMoveSound];
        reply(@YES,nil);
    }else if([action isEqual:@"screenAwake"]){
        // A late WebKit message must not override a lock or app switch.
        if(!self.backgrounded&&!self.suspended){
            self.screenAwakeRequested=[body[@"enabled"] isEqual:@YES];
            UIApplication.sharedApplication.idleTimerDisabled=self.screenAwakeRequested&&UIApplication.sharedApplication.applicationState==UIApplicationStateActive;
        }
        reply(@YES,nil);
    }else if([action isEqual:@"playMoveSound"]){
        reply(@([self playMoveSound:[body[@"capture"] isEqual:@YES]]),nil);
    }else if([action isEqual:@"moveHapticsEnabled"]){
        self.moveHapticsEnabled=[body[@"enabled"] isEqual:@YES];
        if(!self.moveHapticsEnabled)[self stopMoveHaptics];
        reply(@YES,nil);
    }else if([action isEqual:@"playMoveHaptics"]){
        reply(@([self playMoveHaptics]),nil);
    }else if([action isEqual:@"backgroundGame"]){
        if(!self.backgrounded||self.backgroundHandoff){reply(@NO,nil);return;}
        NSDictionary *data=body[@"data"],*t=body[@"tournament"];
        if(![data isKindOfClass:NSDictionary.class]){reply(nil,@"Invalid game state");return;}
        reply(@([self handOffBackgroundGame:data tournament:[t isKindOfClass:NSDictionary.class]?t:nil]),nil);
    }else if([action isEqual:@"open"]){
        if(self.backgroundHandoff){reply(nil,@"Game is running in the background");return;}
        if(self.suspended){reply(nil,@"App suspended");return;}
        NSString *session=body[@"session"];if(![session isKindOfClass:NSString.class]||session.length>64){reply(nil,@"Invalid session");return;}
        NSString *engineID=body[@"engine"]?:@"stockfish19";
        if(![@[@"stockfish19",@"reckless090",@"plenty800",@"pawn201",@"obsidian160",@"cinder061",@"viridithas200",@"halogen160",@"clover91",@"starzix61"] containsObject:engineID]){reply(nil,@"Unsupported engine");return;}
        self.activeSession=session;self.searchRunning=NO;[self endSearchBackgroundTask];[self clearBackgroundLines]; __weak ChessViewController *weakSelf=self;
        [[SFEngine shared] open:session engine:engineID output:^(NSString *identifier,NSString *line){
            [weakSelf receiveEngineLine:line session:identifier];
        }];reply(@YES,nil);
    }else if([action isEqual:@"command"]){
        if(![self.activeSession isEqual:body[@"session"]]||self.suspended){reply(nil,@"Engine session closed");return;}
        if(![self validCommand:body[@"command"]]){reply(nil,@"Unsupported engine command");return;}
        NSString *command=body[@"command"];
        if([command hasPrefix:@"go "]){
            [self clearBackgroundLines];self.searchRunning=YES;
            [[ChessBackgroundGame shared] beginSearchProgress];
            [self beginSearchBackgroundTask];
        }
        [[SFEngine shared] send:command session:body[@"session"]];
        if(self.backgrounded&&self.searchRunning&&self.searchBackgroundTask==UIBackgroundTaskInvalid)[self expireBackgroundSearch];
        reply(@YES,nil);
    }else if([action isEqual:@"close"]){[[SFEngine shared] close:body[@"session"]];if([self.activeSession isEqual:body[@"session"]]){self.activeSession=nil;self.searchRunning=NO;[self endSearchBackgroundTask];[self clearBackgroundLines];}reply(@YES,nil);
    }else if([action isEqual:@"tablebaseStatus"]){reply([[ChessTablebaseDownload shared] status],nil);
    }else if([action isEqual:@"tablebaseDownload"]){[[ChessTablebaseDownload shared] start];reply([[ChessTablebaseDownload shared] status],nil);
    }else if([action isEqual:@"tablebasePause"]){[[ChessTablebaseDownload shared] pause];reply([[ChessTablebaseDownload shared] status],nil);
    }else if([action isEqual:@"store"]){
        if((self.backgroundHandoff||self.restoringBackground)&&[@[@"chess-preview-v2",@"chess-preview-tournament"] containsObject:body[@"key"]]){reply(@YES,nil);return;}
        NSString *key=body[@"key"];if(![key isKindOfClass:NSString.class]||(![key hasPrefix:@"chess-preview-"]&&![@[@"chesscom-import-v1",@"lichess-import-v1"] containsObject:key])){reply(nil,@"Invalid storage key");return;}
        NSMutableDictionary *saved=[[NSUserDefaults.standardUserDefaults dictionaryForKey:@"ChessStorage"] mutableCopy]?:[NSMutableDictionary new];
        if(body[@"value"]==NSNull.null)[saved removeObjectForKey:key];else saved[key]=body[@"value"];
        [NSUserDefaults.standardUserDefaults setObject:saved forKey:@"ChessStorage"];
        if(!self.backgrounded&&[key isEqual:@"chess-preview-v2"]&&[body[@"value"] isKindOfClass:NSString.class]){
            NSDictionary *data=[NSJSONSerialization JSONObjectWithData:[body[@"value"] dataUsingEncoding:NSUTF8StringEncoding] options:0 error:nil];
            if([data isKindOfClass:NSDictionary.class])[[ChessBackgroundGame shared] updateForegroundMatch:data];
        }
        reply(@YES,nil);
    }else if([action isEqual:@"readClipboard"]){reply(UIPasteboard.generalPasteboard.string?:@"",nil);
    }else if([action isEqual:@"writeClipboard"]){UIPasteboard.generalPasteboard.string=body[@"text"];reply(@YES,nil);
    }else if([action isEqual:@"share"]){
        NSString *name=[body[@"name"] lastPathComponent];if(!name.length)name=@"chess-game.pgn";
        NSURL *folder=[NSURL fileURLWithPath:[NSTemporaryDirectory() stringByAppendingPathComponent:NSUUID.UUID.UUIDString] isDirectory:YES];
        [NSFileManager.defaultManager createDirectoryAtURL:folder withIntermediateDirectories:YES attributes:nil error:nil];
        NSURL *file=[folder URLByAppendingPathComponent:name];NSError *error;
        if(![body[@"text"] writeToURL:file atomically:YES encoding:NSUTF8StringEncoding error:&error]){reply(nil,error.localizedDescription);return;}
        UIActivityViewController *share=[[UIActivityViewController alloc] initWithActivityItems:@[file] applicationActivities:nil];
        share.popoverPresentationController.sourceView=self.view;share.popoverPresentationController.sourceRect=CGRectMake(self.view.bounds.size.width/2,self.view.bounds.size.height-30,1,1);
        share.completionWithItemsHandler=^(UIActivityType type,BOOL completed,NSArray *items,NSError *error){[NSFileManager.defaultManager removeItemAtURL:folder error:nil];};
        [self presentViewController:share animated:YES completion:nil];reply(@YES,nil);
    }else if([action isEqual:@"pickGame"]){
        if(self.pickerReply){reply(nil,@"File picker already open");return;}self.pickerReply=reply;
        UIDocumentPickerViewController *picker=[[UIDocumentPickerViewController alloc] initForOpeningContentTypes:@[UTTypeData] asCopy:YES];picker.delegate=self;
        [self presentViewController:picker animated:YES completion:nil];
    }else if([action isEqual:@"fetch"]){[self fetch:body reply:reply];
    }else if([action isEqual:@"cancelFetch"]){[self.requests[body[@"identifier"]] cancel];reply(@YES,nil);
    }else reply(nil,@"Unknown native action");
}
- (void)documentPickerWasCancelled:(UIDocumentPickerViewController *)controller { if(self.pickerReply)self.pickerReply(NSNull.null,nil);self.pickerReply=nil; }
- (void)documentPicker:(UIDocumentPickerViewController *)controller didPickDocumentsAtURLs:(NSArray<NSURL *> *)urls {
    NSURL *url=urls.firstObject;NSNumber *size;[url getResourceValue:&size forKey:NSURLFileSizeKey error:nil];
    NSString *text=size.unsignedLongLongValue<=250000?[NSString stringWithContentsOfURL:url encoding:NSUTF8StringEncoding error:nil]:nil;
    if(self.pickerReply)self.pickerReply(text,text?nil:@"Choose a PGN or FEN text file under 250 KB.");self.pickerReply=nil;
}
- (void)fetch:(NSDictionary *)body reply:(void (^)(id,NSString *))reply {
    NSURL *url=[NSURL URLWithString:body[@"url"]];
    BOOL allowed=([url.host isEqual:@"api.chess.com"]&&[url.path hasPrefix:@"/pub/player/"])||([url.host isEqual:@"lichess.org"]&&([url.path hasPrefix:@"/api/games/user/"]||[url.path hasPrefix:@"/api/user/"]));
    if(!allowed||![url.scheme isEqual:@"https"]||url.user||url.password||url.port){reply(nil,@"Unsupported import URL");return;}
    if((self.offlineForTesting || [NSProcessInfo.processInfo.arguments containsObject:@"--offline-test"])){reply(nil,@"Offline: internet imports are unavailable.");return;}
    NSMutableURLRequest *request=[NSMutableURLRequest requestWithURL:url cachePolicy:NSURLRequestReloadIgnoringLocalCacheData timeoutInterval:30];
    [request setValue:[url.path hasPrefix:@"/api/games/"]?@"application/x-ndjson":@"application/json" forHTTPHeaderField:@"Accept"];
    NSString *identifier=body[@"identifier"];
    NSURLSessionDataTask *task=[NSURLSession.sharedSession dataTaskWithRequest:request completionHandler:^(NSData *data,NSURLResponse *response,NSError *error){
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.requests removeObjectForKey:identifier];
            if(error){reply(nil,error.localizedDescription);return;}
            if(data.length>10*1024*1024){reply(nil,@"Import response is too large.");return;}
            reply(@{@"text":[[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]?:@"",@"status":@([(NSHTTPURLResponse *)response statusCode]),@"type":response.MIMEType?:@"application/json"},nil);
        });
    }];self.requests[identifier]=task;[task resume];
}
@end
@interface SceneDelegate : UIResponder <UIWindowSceneDelegate>
@property(nonatomic,strong) UIWindow *window;
@end
@implementation SceneDelegate
- (void)scene:(UIScene *)scene willConnectToSession:(UISceneSession *)session options:(UISceneConnectionOptions *)options {
    self.window=[[UIWindow alloc] initWithWindowScene:(UIWindowScene *)scene];
    self.window.rootViewController=[ChessViewController new];[self.window makeKeyAndVisible];
}
@end
@interface AppDelegate : UIResponder <UIApplicationDelegate>
@end
@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)options { [[ChessBackgroundGame shared] registerTasks];return YES; }
@end
int main(int argc,char *argv[]){@autoreleasepool{return UIApplicationMain(argc,argv,nil,NSStringFromClass(AppDelegate.class));}}
