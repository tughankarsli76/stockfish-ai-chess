#import <XCTest/XCTest.h>
#import <WebKit/WebKit.h>
#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>
#import <JavaScriptCore/JavaScriptCore.h>
#import "../StockfishChess/BackgroundGame.h"
#import "../StockfishChess/SFEngine.h"
#import "../StockfishChess/CPUCoreInfo.h"
#include <sys/resource.h>
@interface ChessTablebaseDownload : NSObject
- (instancetype)initWithFiles:(NSArray *)files root:(NSURL *)root;
- (NSDictionary *)status;
- (void)start;
- (void)pause;
@end
@interface IntegrationTests : XCTestCase
@end
// Exercise lifecycle cancellation and real native chess without depending on
// the simulator granting an OS background assertion.
@interface RecordingContinuedTask : NSObject
@property(nonatomic,copy) NSString *identifier;
@property(nonatomic,strong) NSProgress *progress;
@property(nonatomic,copy) NSString *subtitle;
@property(nonatomic,copy) void (^expirationHandler)(void);
@property(nonatomic,strong) NSNumber *success;
@property(nonatomic) NSUInteger completions;
- (void)setTaskCompletedWithSuccess:(BOOL)success;
- (void)updateTitle:(NSString *)title subtitle:(NSString *)subtitle;
@end
@implementation RecordingContinuedTask
- (instancetype)init {if((self=[super init])){self.progress=[NSProgress progressWithTotalUnitCount:0];self.subtitle=@"";}return self;}
- (void)setTaskCompletedWithSuccess:(BOOL)success {self.success=@(success);self.completions++;}
- (void)updateTitle:(NSString *)title subtitle:(NSString *)subtitle {self.subtitle=subtitle;}
@end
@interface DroppingBackgroundLifecycleWebView : WKWebView
@property(nonatomic) NSUInteger droppedBackgroundEvents;
@end
@implementation DroppingBackgroundLifecycleWebView
- (void)evaluateJavaScript:(NSString *)source completionHandler:(void (^)(id,NSError *))completionHandler {
    if([source containsString:@"chess-native-lifecycle"]&&([source containsString:@"detail:'background'"]||[source containsString:@"detail:'match-inactive'"])){
        self.droppedBackgroundEvents++;
        if(completionHandler)completionHandler(nil,nil);
        return;
    }
    [super evaluateJavaScript:source completionHandler:completionHandler];
}
@end
@interface ChessBackgroundGame (ContinuedTaskTesting)
- (void)acceptContinuedTask:(id)task;
@end
@interface RecordingImpactFeedbackGenerator : UIImpactFeedbackGenerator
@property(nonatomic) NSUInteger impacts;
@property(nonatomic) CGFloat lastIntensity;
@end
@implementation RecordingImpactFeedbackGenerator
- (void)impactOccurredWithIntensity:(CGFloat)intensity {self.impacts++;self.lastIntensity=intensity;}
@end
@interface RecordingMoveAudioPlayer : AVAudioPlayer
@property(atomic) NSUInteger plays;
@end
@implementation RecordingMoveAudioPlayer
- (BOOL)play {self.plays++;return [super play];}
@end
@interface UIViewController (ChessLifecycleTesting)
- (void)suspend;
- (void)resume;
- (void)enterBackground;
- (void)enterForeground;
- (void)pauseForScreenLock;
- (void)expireBackgroundSearch;
- (BOOL)validCommand:(NSString *)command;
- (BOOL)playMoveSound:(BOOL)capture;
- (BOOL)playMoveHaptics;
- (void)stopMoveHaptics;
@end
@implementation IntegrationTests
- (void)testRemovedStockfish18PreservesSavedGame {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use isolated app storage for migration tests");
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Migration board"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    NSDictionary *before=[self javascript:@"const {nativeIntegration:a}=await import('./app.js');a.stopEngineMatch();a.patch({engine:'stockfish19',opponent:'local',showAnalysis:false,openingBook:false,yourName:'Migration Check',threads:2,hash:150});a.load('1. e4 e5 2. Nf3 Nc6');a.persist();await new Promise(r=>setTimeout(r,150));return {fen:a.state().fen,pgn:a.state().pgn};" web:web];
    NSMutableDictionary *storage=[[NSUserDefaults.standardUserDefaults dictionaryForKey:@"ChessStorage"] mutableCopy];
    NSMutableDictionary *legacy=[[NSJSONSerialization JSONObjectWithData:[storage[@"chess-preview-v2"] dataUsingEncoding:NSUTF8StringEncoding] options:NSJSONReadingMutableContainers error:nil] mutableCopy];
    legacy[@"settings"][@"engine"]=@"stockfish18";legacy[@"settings"][@"opponent"]=@"match";
    legacy[@"engineMatch"]=@{@"white":@"stockfish18",@"black":@"stockfish19",@"seconds":@1,@"paused":@YES};
    storage[@"chess-preview-v2"]=[[NSString alloc] initWithData:[NSJSONSerialization dataWithJSONObject:legacy options:0 error:nil] encoding:NSUTF8StringEncoding];
    [NSUserDefaults.standardUserDefaults setObject:storage forKey:@"ChessStorage"];
    // Use the same storage protection as native checkpoint recovery on reload.
    [host setValue:@YES forKey:@"restoringBackground"];[web reload];
    XCTestExpectation *restored=[self expectationWithDescription:@"Legacy game restored"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,500*NSEC_PER_MSEC),dispatch_get_main_queue(),^{[self waitForBoard:web expectation:restored attempts:200];});
    [self waitForExpectations:@[restored] timeout:25];
    NSDictionary *after=[self javascript:@"const {nativeIntegration:a}=await import('./app.js');const s=a.state();document.getElementById('menuNew').click();document.getElementById('newEngineMatch').click();const defaults={white:document.getElementById('matchWhiteEngine').value,black:document.getElementById('matchBlackEngine').value};document.querySelectorAll('dialog[open]').forEach(d=>d.close());return {fen:s.fen,pgn:s.pgn,engine:s.settings.engine,opponent:s.settings.opponent,yourName:s.settings.yourName,threads:s.settings.threads,hash:s.settings.hash,engineMatch:s.engineMatch,defaults};" web:web];
    XCTAssertEqualObjects(after[@"fen"],before[@"fen"]);XCTAssertEqualObjects(after[@"pgn"],before[@"pgn"]);
    XCTAssertEqualObjects(after[@"engine"],@"stockfish19");XCTAssertEqualObjects(after[@"opponent"],@"local");
    XCTAssertEqualObjects(after[@"yourName"],@"Migration Check");XCTAssertEqualObjects(after[@"threads"],@2);XCTAssertEqualObjects(after[@"hash"],@150);
    XCTAssertEqualObjects(after[@"engineMatch"],NSNull.null);XCTAssertEqualObjects(after[@"defaults"][@"white"],@"stockfish19");XCTAssertEqualObjects(after[@"defaults"][@"black"],@"reckless090");
    NSLog(@"REMOVED_ENGINE_MIGRATION: saved position, PGN, username and resource settings preserved");
}
- (void)testOptionsDetailNavigationAndModalHandoff {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use isolated app storage for menu tests");
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Options board"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    NSDictionary *result=[self javascript:@"const tests=await import('./ios-integration-tests.js');return await tests.optionsDetailNavigation();" web:web];
    XCTAssertEqual([result[@"pages"] count],8u);XCTAssertEqualObjects(result[@"modalGaps"],@0);
    NSLog(@"OPTIONS_DETAIL_NAVIGATION: %@",result);

}
- (void)testNativeEnginesOfflineAnalysisMatchesAndStop {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use isolated app storage for engine tests");
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    [host setValue:@YES forKey:@"offlineForTesting"];
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Ten-engine board"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    XCTestExpectation *done=[self expectationWithDescription:@"Ten native engine checks"];
    [web callAsyncJavaScript:@"const tests=await import('./ios-integration-tests.js');return await tests.nativeEngines();" arguments:@{} inFrame:nil inContentWorld:WKContentWorld.pageWorld completionHandler:^(id result,NSError *error){
        XCTAssertNil(error,@"%@",error);XCTAssertEqual([result count],22u);NSLog(@"TEN_NATIVE_ENGINES: %@",result);[done fulfill];
    }];
    [self waitForExpectations:@[done] timeout:240];
}
- (void)testLichessAnalysisMoveAndCaptureSounds {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use isolated app storage for preference tests");
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Lichess analysis sound board"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    [self javascript:@"const {nativeIntegration:api}=await import('./app.js');api.stopEngineMatch();api.patch({opponent:'local',showAnalysis:false,openingBook:false,moveSound:false,moveHaptics:false,threads:1,hash:16});api.setTab('analysis');api.load('1. e4 d5');return true;" web:web];
    [self waitUntil:^BOOL{return [host valueForKey:@"moveSoundPlayer"]==nil&&[host valueForKey:@"moveCaptureSoundPlayer"]==nil;}];
    XCTAssertFalse([host playMoveSound:YES]);
    [self javascript:@"const {nativeIntegration:api}=await import('./app.js');api.patch({moveSound:true,moveHaptics:true});api.setTab('analysis');return true;" web:web];
    [self waitUntil:^BOOL{return [host valueForKey:@"moveSoundPlayer"]!=nil&&[host valueForKey:@"moveCaptureSoundPlayer"]!=nil;}];
    AVAudioPlayer *prepared=[host valueForKey:@"moveCaptureSoundPlayer"];
    XCTAssertEqualObjects(prepared.url.lastPathComponent,@"capture-lichess.aifc");XCTAssertGreaterThan(prepared.duration,0);
    XCTAssertEqualWithAccuracy(prepared.volume,0.8,0.0001);XCTAssertFalse(prepared.playing);
    RecordingMoveAudioPlayer *move=[[RecordingMoveAudioPlayer alloc] initWithContentsOfURL:[[host valueForKey:@"moveSoundPlayer"] valueForKey:@"url"] error:nil];
    RecordingMoveAudioPlayer *capture=[[RecordingMoveAudioPlayer alloc] initWithContentsOfURL:prepared.url error:nil];
    move.volume=0.8;capture.volume=0.8;[move prepareToPlay];[capture prepareToPlay];
    [host setValue:move forKey:@"moveSoundPlayer"];[host setValue:capture forKey:@"moveCaptureSoundPlayer"];
    RecordingImpactFeedbackGenerator *feedback=[[RecordingImpactFeedbackGenerator alloc] initWithStyle:UIImpactFeedbackStyleMedium];
    [host setValue:feedback forKey:@"moveHapticsFeedback"];
    [self javascript:@"const tests=await import('./ios-integration-tests.js');tests.trackMoveFeedback();document.querySelector('[data-square=e4]').click();document.querySelector('[data-square=d5]').click();return true;" web:web];
    [self waitUntil:^BOOL{return capture.plays==1&&feedback.impacts==1;}];
    NSDictionary *result=[self javascript:@"const {nativeIntegration:api}=await import('./app.js');await new Promise(r=>setTimeout(r,100));const played=window.__moveFeedback.find(event=>event.kind==='sound');const captureSynced=played.capture&&played.duringMove&&played.elapsedMs<150&&played.accepted===true;api.navigate(1);api.navigate(2);api.navigate(3);api.navigate(3);api.navigate(0);api.navigate(1);document.querySelector('[data-square=g8]').click();document.querySelector('[data-square=g6]').click();await new Promise(r=>setTimeout(r,150));const sounds=window.__moveFeedback.filter(event=>event.kind==='sound');return {captureSynced,pattern:sounds.map(event=>event.capture),accepted:sounds.every(event=>event.accepted===true),unchanged:api.state().length===3&&api.state().cursor===1,analysisVisible:api.state().tab==='analysis'};" web:web];
    XCTAssertEqualObjects(result[@"captureSynced"],@YES);XCTAssertEqualObjects(result[@"accepted"],@YES);XCTAssertEqualObjects(result[@"unchanged"],@YES);XCTAssertEqualObjects(result[@"analysisVisible"],@YES);
    XCTAssertEqualObjects(result[@"pattern"],(@[@YES,@NO,@NO,@YES,@NO]));
    XCTAssertEqual(move.plays,3u);XCTAssertEqual(capture.plays,2u);XCTAssertEqual(feedback.impacts,1u);
    [host enterBackground];XCTAssertFalse([host playMoveSound:NO]);XCTAssertFalse([host playMoveSound:YES]);
    [self waitUntil:^BOOL{return [host valueForKey:@"moveSoundPlayer"]==nil&&[host valueForKey:@"moveCaptureSoundPlayer"]==nil;}];
    [host enterForeground];
    [self javascript:@"const {nativeIntegration:api}=await import('./app.js');api.patch({moveSound:false,moveHaptics:false});api.navigate(2);window.__restoreMoveFeedback();api.setTab('game');return true;" web:web];
    XCTAssertEqual(move.plays,3u);XCTAssertEqual(capture.plays,2u);XCTAssertEqual(feedback.impacts,1u);
    NSLog(@"LICHESS_ANALYSIS_SOUND: exact capture file/volume, capture at animation start, correct forward/back sounds, no navigation haptics or illegal/root/repeated/off/background sound");
}
- (void)testOptionalMoveHaptics {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use isolated app storage for preference tests");
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Haptics settings board"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    NSDictionary *initial=[self javascript:@"const {nativeIntegration:api}=await import('./app.js');const {DEFAULT_SETTINGS}=await import('./features.js');api.stopEngineMatch();api.patch({opponent:'local',showAnalysis:false,openingBook:true,moveSound:false,moveHaptics:false,threads:1,hash:16,fixedTime:true,moveTime:1});api.setTab('game');api.reset();const toggle=document.getElementById('haptics');return {defaultOff:DEFAULT_SETTINGS.moveHaptics===false,unchecked:!toggle.checked,underSound:toggle.closest('label').previousElementSibling.contains(document.getElementById('sound'))};" web:web];
    for(NSString *key in @[@"defaultOff",@"unchecked",@"underSound"])XCTAssertEqualObjects(initial[key],@YES);
    [self waitUntil:^BOOL{return ![[host valueForKey:@"moveHapticsEnabled"] boolValue];}];
    XCTAssertNil([host valueForKey:@"moveHapticsFeedback"]);XCTAssertFalse([host playMoveHaptics]);

    [self javascript:@"document.getElementById('haptics').click();return true;" web:web];
    [self waitUntil:^BOOL{return [[host valueForKey:@"moveHapticsEnabled"] boolValue];}];
    RecordingImpactFeedbackGenerator *feedback=[[RecordingImpactFeedbackGenerator alloc] initWithStyle:UIImpactFeedbackStyleMedium];
    [host setValue:feedback forKey:@"moveHapticsFeedback"];
    [self javascript:@"const tests=await import('./ios-integration-tests.js');tests.trackMoveFeedback();document.querySelector('[data-square=e2]').click();document.querySelector('[data-square=e4]').click();return true;" web:web];
    [self waitUntil:^BOOL{return feedback.impacts==1;}];
    XCTAssertEqual(feedback.impacts,1u);XCTAssertEqualWithAccuracy(feedback.lastIntensity,0.85,0.001);
    XCTAssertFalse([[host valueForKey:@"moveSoundEnabled"] boolValue]);XCTAssertNil([host valueForKey:@"moveSoundPlayer"]);

    // Reviewing existing moves and an illegal destination must not play feedback.
    [self javascript:@"const {nativeIntegration:api}=await import('./app.js');api.navigate(0);api.navigate(1);document.querySelector('[data-square=b8]').click();document.querySelector('[data-square=b6]').click();await new Promise(r=>setTimeout(r,500));return api.state().length;" web:web];
    XCTAssertEqual(feedback.impacts,1u);
    [self javascript:@"const {nativeIntegration:api}=await import('./app.js');api.patch({opponent:'computer',side:'w'});return true;" web:web];
    [self waitUntil:^BOOL{return feedback.impacts>=2;}];
    XCTAssertEqual(feedback.impacts,2u);XCTAssertNil([host valueForKey:@"moveSoundPlayer"]);
    NSDictionary *timing=[self javascript:@"const {nativeIntegration:api}=await import('./app.js');await new Promise(r=>setTimeout(r,750));api.patch({opponent:'local'});api.setTab('analysis');document.querySelector('[data-square=g1]').click();document.querySelector('[data-square=f3]').click();await new Promise(r=>setTimeout(r,100));const events=window.__moveFeedback.filter(event=>event.kind==='haptic');return {count:events.length,synced:events.every(event=>event.duringMove&&event.elapsedMs<150&&event.accepted===true)};" web:web];
    XCTAssertEqualObjects(timing[@"count"],@3);XCTAssertEqualObjects(timing[@"synced"],@YES);XCTAssertEqual(feedback.impacts,3u);

    [self javascript:@"document.getElementById('haptics').click();return true;" web:web];
    [self waitUntil:^BOOL{return ![[host valueForKey:@"moveHapticsEnabled"] boolValue];}];
    XCTAssertNil([host valueForKey:@"moveHapticsFeedback"]);XCTAssertFalse([host playMoveHaptics]);XCTAssertEqual(feedback.impacts,3u);
    [self javascript:@"document.getElementById('haptics').click();window.__reloadPending=true;return true;" web:web];
    [self waitUntil:^BOOL{return [[host valueForKey:@"moveHapticsEnabled"] boolValue];}];
    [web reload];XCTestExpectation *reloaded=[self expectationWithDescription:@"Haptic preference restored"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,500*NSEC_PER_MSEC),dispatch_get_main_queue(),^{[self waitForBoard:web expectation:reloaded attempts:200];});
    [self waitForExpectations:@[reloaded] timeout:25];
    XCTAssertEqualObjects([self javascript:@"return document.getElementById('haptics').checked&&!document.getElementById('sound').checked&&JSON.parse(localStorage.getItem('chess-preview-v2')).settings.moveHaptics===true;" web:web],@YES);
    [self waitUntil:^BOOL{return [[host valueForKey:@"moveHapticsEnabled"] boolValue];}];
    XCTAssertNil([host valueForKey:@"moveHapticsFeedback"]);
    XCTAssertTrue([host playMoveHaptics]);XCTAssertTrue([[host valueForKey:@"moveHapticsFeedback"] isKindOfClass:UIImpactFeedbackGenerator.class]);
    [host enterBackground];XCTAssertFalse([host playMoveHaptics]);XCTAssertNil([host valueForKey:@"moveHapticsFeedback"]);
    [host enterForeground];
    [self javascript:@"const {nativeIntegration:api}=await import('./app.js');api.patch({moveHaptics:false,opponent:'local'});return true;" web:web];
    [self waitUntil:^BOOL{return ![[host valueForKey:@"moveHapticsEnabled"] boolValue];}];XCTAssertFalse([host playMoveHaptics]);
    NSLog(@"OPTIONAL_HAPTICS: stronger 0.85 impacts at animation start for human/computer/analysis moves; default off, independent audio, no review/illegal/background feedback, and persistence checked");
}
- (void)testOptionalMoveSound {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use isolated app storage for preference tests");
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Sound settings board"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    NSDictionary *initial=[self javascript:@"const {nativeIntegration:api}=await import('./app.js');const {DEFAULT_SETTINGS}=await import('./features.js');api.stopEngineMatch();api.patch({opponent:'local',showAnalysis:false,openingBook:true,moveSound:false,moveHaptics:false,threads:1,hash:16});api.setTab('game');api.reset();const toggle=document.getElementById('sound');const group=toggle.closest('.option-group');return {defaultOff:DEFAULT_SETTINGS.moveSound===false,unchecked:!toggle.checked,order:group.children[0].id==='boardButton'&&group.children[1].id==='piecesButton'&&group.children[2].contains(toggle)};" web:web];
    for(NSString *key in @[@"defaultOff",@"unchecked",@"order"])XCTAssertEqualObjects(initial[key],@YES);
    XCTAssertNil([host valueForKey:@"moveSoundPlayer"]);XCTAssertFalse([host playMoveSound:NO]);

    // Enabling prepares the native player without playing until the move starts.
    [self javascript:@"const tests=await import('./ios-integration-tests.js');tests.trackMoveFeedback();document.getElementById('sound').click();return true;" web:web];
    [self waitUntil:^BOOL{return [host valueForKey:@"moveSoundPlayer"]!=nil;}];
    XCTAssertGreaterThan([[[host valueForKey:@"moveSoundPlayer"] valueForKey:@"duration"] doubleValue],0);
    XCTAssertEqualObjects([[[host valueForKey:@"moveSoundPlayer"] valueForKey:@"url"] lastPathComponent],@"move-lichess.aifc");
    XCTAssertEqualWithAccuracy([[[host valueForKey:@"moveSoundPlayer"] valueForKey:@"volume"] doubleValue],0.8,0.0001);
    XCTAssertFalse([[[host valueForKey:@"moveSoundPlayer"] valueForKey:@"playing"] boolValue]);
    RecordingMoveAudioPlayer *audio=[[RecordingMoveAudioPlayer alloc] initWithContentsOfURL:[[host valueForKey:@"moveSoundPlayer"] valueForKey:@"url"] error:nil];
    audio.volume=0.8;[audio prepareToPlay];[host setValue:audio forKey:@"moveSoundPlayer"];
    [self javascript:@"document.querySelector('[data-square=e2]').click();document.querySelector('[data-square=e4]').click();return true;" web:web];
    [self waitUntil:^BOOL{return audio.plays==1;}];
    // Review and illegal moves must stay silent with the option enabled.
    [self javascript:@"const {nativeIntegration:api}=await import('./app.js');api.navigate(0);api.navigate(1);document.querySelector('[data-square=b8]').click();document.querySelector('[data-square=b6]').click();await new Promise(r=>setTimeout(r,500));return true;" web:web];
    XCTAssertEqual(audio.plays,1u);

    // A computer reply must also stay silent when the user turns the option off.
    NSDictionary *quiet=[self javascript:@"const {nativeIntegration:api}=await import('./app.js');document.getElementById('sound').click();api.patch({opponent:'computer',side:'w'});for(let i=0;i<100&&api.state().length<2;i++)await new Promise(r=>setTimeout(r,50));await new Promise(r=>setTimeout(r,850));return {replyPlayed:api.state().length===2,disabled:api.state().settings.moveSound===false};" web:web];
    XCTAssertEqualObjects(quiet[@"replyPlayed"],@YES);XCTAssertEqualObjects(quiet[@"disabled"],@YES);
    [self waitUntil:^BOOL{return [host valueForKey:@"moveSoundPlayer"]==nil;}];

    // Enable through the actual menu, then let Black reply automatically.
    [self javascript:@"const {nativeIntegration:api}=await import('./app.js');api.patch({opponent:'local'});api.load('1. e4');document.getElementById('sound').click();return true;" web:web];
    [self waitUntil:^BOOL{return [host valueForKey:@"moveSoundPlayer"]!=nil;}];
    audio=[[RecordingMoveAudioPlayer alloc] initWithContentsOfURL:[[host valueForKey:@"moveSoundPlayer"] valueForKey:@"url"] error:nil];audio.volume=0.8;[audio prepareToPlay];[host setValue:audio forKey:@"moveSoundPlayer"];
    [self javascript:@"const {nativeIntegration:api}=await import('./app.js');api.patch({opponent:'computer',side:'w'});return true;" web:web];
    [self waitUntil:^BOOL{return audio.plays==1;}];
    XCTAssertEqualObjects([self javascript:@"const {nativeIntegration:api}=await import('./app.js');return api.state().length===2&&JSON.parse(localStorage.getItem('chess-preview-v2')).settings.moveSound===true;" web:web],@YES);
    NSDictionary *timing=[self javascript:@"const {nativeIntegration:api}=await import('./app.js');await new Promise(r=>setTimeout(r,750));api.patch({opponent:'local'});api.setTab('analysis');document.querySelector('[data-square=g1]').click();document.querySelector('[data-square=f3]').click();await new Promise(r=>setTimeout(r,100));const events=window.__moveFeedback.filter(event=>event.kind==='sound');return {count:events.length,synced:events.every(event=>event.duringMove&&event.elapsedMs<150&&event.accepted===true)};" web:web];
    XCTAssertEqualObjects(timing[@"count"],@3);XCTAssertEqualObjects(timing[@"synced"],@YES);XCTAssertEqual(audio.plays,2u);

    [self javascript:@"window.__reloadPending=true;return true;" web:web];[web reload];
    XCTestExpectation *reloaded=[self expectationWithDescription:@"Sound preference restored"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,500*NSEC_PER_MSEC),dispatch_get_main_queue(),^{[self waitForBoard:web expectation:reloaded attempts:200];});
    [self waitForExpectations:@[reloaded] timeout:25];
    XCTAssertEqualObjects([self javascript:@"return document.getElementById('sound').checked;" web:web],@YES);
    [host enterBackground];XCTAssertFalse([host playMoveSound:NO]);
    [self waitUntil:^BOOL{return [host valueForKey:@"moveSoundPlayer"]==nil;}];
    [host enterForeground];
    [self javascript:@"const {nativeIntegration:api}=await import('./app.js');api.patch({moveSound:false,opponent:'local'});return true;" web:web];
    XCTAssertFalse([host playMoveSound:NO]);
    NSLog(@"OPTIONAL_SOUND: preloaded without playback, sound at animation start for human/computer/analysis moves; default off, no review/illegal/background audio, and persisted choice checked");
}
- (void)testStartupReadyAndBookParsing {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Isolated startup benchmark only");
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    [self waitUntil:^BOOL{return [host valueForKey:@"startupCover"]==nil;}];
    NSDictionary *state=[self javascript:@"return {squares:document.querySelectorAll('#board .square').length,pieces:document.querySelectorAll('#board img').length,decoded:[...document.querySelectorAll('#board img')].every(img=>img.complete&&img.naturalWidth>0),native:document.documentElement.classList.contains('native-ios')};" web:web];
    XCTAssertEqualObjects(state[@"squares"],@64);XCTAssertEqualObjects(state[@"pieces"],@32);
    XCTAssertEqualObjects(state[@"decoded"],@YES);XCTAssertEqualObjects(state[@"native"],@YES);
    NSLog(@"STARTUP_READY %@",state);
    [self javascript:@"const {nativeIntegration:a}=await import('./app.js');a.patch({opponent:'local',showAnalysis:false});return true;" web:web];[host suspend];
    NSString *before=[NSString stringWithContentsOfURL:[NSBundle.mainBundle URLForResource:@"startup-book-baseline" withExtension:@"js"] encoding:NSUTF8StringEncoding error:nil];
    NSString *after=[NSString stringWithContentsOfURL:[NSBundle.mainBundle.bundleURL URLByAppendingPathComponent:@"Web/elite-book-data.js"] encoding:NSUTF8StringEncoding error:nil];
    XCTAssertNotNil(before);XCTAssertNotNil(after);if(!before||!after)return;
    NSArray *sources=@[[before stringByReplacingOccurrencesOfString:@"export const " withString:@"const "],[after stringByReplacingOccurrencesOfString:@"export const " withString:@"const "]];
    for(int trial=0;trial<3;trial++)for(NSNumber *version in (trial%2?@[@1,@0]:@[@0,@1])){
        @autoreleasepool {
            JSContext *context=[NSClassFromString(@"JSContext") new];
            NSTimeInterval start=NSProcessInfo.processInfo.systemUptime;
            [context evaluateScript:sources[version.intValue]];
            double milliseconds=(NSProcessInfo.processInfo.systemUptime-start)*1000;
            XCTAssertNil(context.exception);
            int count=[[context evaluateScript:@"ELITE_BOOK['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -'].length"] toInt32];
            XCTAssertEqual(count,3);
            NSLog(@"STARTUP_BOOK version=%@ trial=%d parseMs=%.2f initialMoves=%d",version.intValue?@"json":@"literal",trial,milliseconds,count);
        }
    }
    XCTestExpectation *shot=[self expectationWithDescription:@"Complete initial board"];
    [web takeSnapshotWithConfiguration:nil completionHandler:^(UIImage *image,NSError *error){
        XCTAssertNil(error);XCTAssertNotNil(image);
        if(image){XCTAttachment *attachment=[XCTAttachment attachmentWithImage:image];attachment.name=@"Complete initial board";attachment.lifetime=XCTAttachmentLifetimeKeepAlways;[self addAttachment:attachment];}
        [shot fulfill];
    }];[self waitForExpectations:@[shot] timeout:15];
}
- (void)testPhysicalDeviceCoreScaling {
    // Opt-in: use the separately signed corebench bundle, never the owner's app data.
    XCTSkipIf(TARGET_OS_SIMULATOR || ![NSBundle.mainBundle.bundleIdentifier containsString:@"corebench"], @"Physical, isolated core benchmark only");
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Benchmark board"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    [self javascript:@"const {nativeIntegration:a}=await import('chess://app/app.js');a.stopEngineMatch();a.patch({opponent:'local',showAnalysis:false,openingBook:false});window.dispatchEvent(new CustomEvent('chess-native-lifecycle',{detail:'suspend'}));document.body.innerHTML='<main style=\"font:22px system-ui;padding:36px\"><h1>CPU test</h1><p>Stockfish 19 · 1–6 threads</p><p id=\"coreProgress\">Preparing…</p><p>Please keep this test open.</p></main>';return true;" web:web];
    SFEngine *benchmarkEngine=[(id)NSClassFromString(@"SFEngine") shared];
    [benchmarkEngine suspend];
    BOOL oldIdle=UIApplication.sharedApplication.idleTimerDisabled;
    UIApplication.sharedApplication.idleTimerDisabled=YES;
    UIDevice.currentDevice.batteryMonitoringEnabled=YES;
    NSArray *positions=@[
        @{@"name":@"opening",@"fen":@"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"},
        @{@"name":@"middlegame",@"fen":@"r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 10"},
        @{@"name":@"endgame",@"fen":@"8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 11"}
    ];
    NSArray *orders=@[@[@1,@4,@2,@5,@3,@6],@[@6,@3,@5,@2,@4,@1]];
    NSMutableArray *rows=[NSMutableArray new];
    NSMutableDictionary *report=[@{@"device":ChessDeviceInfo(),@"cores":@(NSProcessInfo.processInfo.processorCount),@"coreInfo":ChessCPUCoreInfo(),@"os":UIDevice.currentDevice.systemVersion,@"bundle":NSBundle.mainBundle.bundleIdentifier,@"engine":@"Stockfish 19",@"hashMB":@150,@"multiPV":@2,@"searchMilliseconds":@10000,@"repetitions":@2,@"positions":positions,@"orders":orders,@"rows":rows,@"started":NSDate.date.description,@"lowPowerMode":@(NSProcessInfo.processInfo.lowPowerModeEnabled),@"batteryStart":@(UIDevice.currentDevice.batteryLevel),@"batteryState":@(UIDevice.currentDevice.batteryState)} mutableCopy];
    NSURL *file=[[NSFileManager.defaultManager URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask].firstObject URLByAppendingPathComponent:@"core-scaling.json"];
    void (^save)(void)=^{[[NSJSONSerialization dataWithJSONObject:report options:NSJSONWritingPrettyPrinted error:nil] writeToURL:file atomically:YES];};
    double (^cpuTime)(void)=^double{struct rusage u;getrusage(RUSAGE_SELF,&u);return u.ru_utime.tv_sec+u.ru_utime.tv_usec/1e6+u.ru_stime.tv_sec+u.ru_stime.tv_usec/1e6;};
    NSLog(@"CORE_BENCH_METADATA %@",[[NSString alloc] initWithData:[NSJSONSerialization dataWithJSONObject:report options:0 error:nil] encoding:NSUTF8StringEncoding]);
    @try {
        for(NSUInteger repetition=0;repetition<orders.count;repetition++){
            for(NSDictionary *position in positions){
                for(NSNumber *threads in orders[repetition]){
                    // Give the scheduler a short rest; reverse trial order to balance heat/order effects.
                    XCTestExpectation *rest=[self expectationWithDescription:@"Between searches"];
                    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,3*NSEC_PER_SEC),dispatch_get_main_queue(),^{[rest fulfill];});
                    [self waitForExpectations:@[rest] timeout:5];
                    NSString *progress=[NSString stringWithFormat:@"Run %lu / 36 · %@ threads · %@",(unsigned long)rows.count+1,threads,position[@"name"]];
                    [web callAsyncJavaScript:@"document.getElementById('coreProgress').textContent=text;" arguments:@{@"text":progress} inFrame:nil inContentWorld:WKContentWorld.pageWorld completionHandler:nil];
                    NSString *session=NSUUID.UUID.UUIDString;
                    XCTestExpectation *ready=[self expectationWithDescription:@"Native engine ready"];
                    XCTestExpectation *done=[self expectationWithDescription:@"Ten-second native search"];
                    __block BOOL waitingReady=YES,finished=NO;
                    NSMutableDictionary *row=[@{@"repetition":@(repetition+1),@"position":position[@"name"],@"threads":threads,@"thermalBefore":@(NSProcessInfo.processInfo.thermalState)} mutableCopy];
                    [benchmarkEngine open:session engine:@"stockfish19" output:^(NSString *identifier,NSString *line){
                        if(![identifier isEqual:session])return;
                        if([line isEqual:@"readyok"]&&waitingReady){waitingReady=NO;[ready fulfill];}
                        if([line hasPrefix:@"id name "])row[@"identity"]=[line substringFromIndex:8];
                        if([line hasPrefix:@"info string Using "])row[@"threadConfirmation"]=line;
                        if([line hasPrefix:@"info "]&&![line hasPrefix:@"info string "]){
                            NSArray *tokens=[line componentsSeparatedByString:@" "];
                            for(NSString *key in @[@"nodes",@"nps",@"time",@"hashfull",@"tbhits"]){NSUInteger i=[tokens indexOfObject:key];if(i!=NSNotFound&&i+1<tokens.count)row[key]=@([tokens[i+1] longLongValue]);}
                            NSUInteger pv=[tokens indexOfObject:@"multipv"],depth=[tokens indexOfObject:@"depth"];
                            if(depth!=NSNotFound&&depth+1<tokens.count&&(pv==NSNotFound||[tokens[pv+1] intValue]==1))row[@"depth"]=@([tokens[depth+1] intValue]);
                        }
                        if([line hasPrefix:@"bestmove "]&&!finished){finished=YES;row[@"bestmove"]=line;[done fulfill];}
                    }];
                    for(NSString *command in @[@"uci",[NSString stringWithFormat:@"setoption name Threads value %@",threads],@"setoption name Hash value 150",@"setoption name MultiPV value 2",@"setoption name UCI_LimitStrength value false",@"setoption name Skill Level value 20",@"setoption name UCI_ShowWDL value true",@"ucinewgame",@"isready"])[benchmarkEngine send:command session:session];
                    [self waitForExpectations:@[ready] timeout:30];
                    double started=NSProcessInfo.processInfo.systemUptime,cpuStarted=cpuTime();
                    [benchmarkEngine send:[@"position fen " stringByAppendingString:position[@"fen"]] session:session];
                    [benchmarkEngine send:@"go movetime 10000" session:session];
                    [self waitForExpectations:@[done] timeout:25];
                    double elapsed=NSProcessInfo.processInfo.systemUptime-started;
                    row[@"wallSeconds"]=@(elapsed);row[@"cpuSeconds"]=@(cpuTime()-cpuStarted);row[@"averageCPUCores"]=@([row[@"cpuSeconds"] doubleValue]/elapsed);
                    row[@"thermalAfter"]=@(NSProcessInfo.processInfo.thermalState);row[@"battery"]=@(UIDevice.currentDevice.batteryLevel);row[@"lowPowerMode"]=@(NSProcessInfo.processInfo.lowPowerModeEnabled);
                    [benchmarkEngine close:session];
                    XCTAssertGreaterThan([row[@"nodes"] longLongValue],0);XCTAssertGreaterThanOrEqual([row[@"time"] longLongValue],9500);
                    XCTAssertTrue(([row[@"threadConfirmation"] containsString:[NSString stringWithFormat:@"Using %@ thread",threads]]),@"Thread setting was not confirmed: %@",row);
                    [rows addObject:row];save();
                    NSLog(@"CORE_BENCH_ROW %@",[[NSString alloc] initWithData:[NSJSONSerialization dataWithJSONObject:row options:0 error:nil] encoding:NSUTF8StringEncoding]);
                }
            }
        }
        report[@"finished"]=NSDate.date.description;save();
        XCTAttachment *attachment=[XCTAttachment attachmentWithContentsOfFileAtURL:file];attachment.name=@"core-scaling.json";attachment.lifetime=XCTAttachmentLifetimeKeepAlways;[self addAttachment:attachment];
        [web evaluateJavaScript:@"document.getElementById('coreProgress').textContent='Complete — 36 searches measured.'" completionHandler:nil];
    } @finally {
        [benchmarkEngine suspend];UIApplication.sharedApplication.idleTimerDisabled=oldIdle;
    }
}
- (void)testForegroundMoveDoesNotStartBackgroundActivity {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    id background=[(id)NSClassFromString(@"ChessBackgroundGame") shared];
    [background stopForForeground];
    [self javascript:@"const {nativeIntegration:a}=await import('chess://app/app.js');a.stopEngineMatch();a.patch({engine:'stockfish19',opponent:'computer',side:'w',openingBook:false,threads:1,hash:16,fixedTime:true,moveTime:3});a.reset();a.load('1. e4');a.setTab('game');return true;" web:web];
    id moves=[self javascript:@"const {nativeIntegration:a}=await import('chess://app/app.js');for(let i=0;i<200&&a.state().length<2;i++)await new Promise(r=>setTimeout(r,100));return a.state().length;" web:web];
    XCTAssertEqualObjects(moves,@2);
    XCTAssertFalse([background active]);
    XCTAssertEqual([[background valueForKey:@"backgroundTask"] unsignedIntegerValue],UIBackgroundTaskInvalid);
    XCTAssertNil([background valueForKey:@"continuedTask"]);
    XCTAssertNil([background valueForKey:@"requestedIdentifier"]);
    XCTAssertEqualObjects([NSBundle.mainBundle objectForInfoDictionaryKey:@"BGTaskSchedulerPermittedIdentifiers"],@[[NSBundle.mainBundle.bundleIdentifier stringByAppendingString:@".engine-match.*"]]);
}
- (void)checkMatchPausesForScreenLock:(BOOL)screenLock analysis:(BOOL)analysis dropWebEvent:(BOOL)drop {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."],@"Use isolated app storage for inactivity tests");
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Match inactivity board"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    ChessBackgroundGame *background=[(id)NSClassFromString(@"ChessBackgroundGame") shared];
    DroppingBackgroundLifecycleWebView *sleepingWeb=drop?[[DroppingBackgroundLifecycleWebView alloc] initWithFrame:CGRectZero configuration:[WKWebViewConfiguration new]]:nil;
    @try {
        [self javascript:@"const {nativeIntegration:a}=await import('./app.js');a.stopEngineMatch();a.patch({opponent:'local',openingBook:false,threads:1,hash:16});a.startEngineMatch({white:'stockfish19',black:'reckless090',seconds:5});return true;" web:web];
        if(analysis)[self javascript:@"const {nativeIntegration:a}=await import('./app.js');a.setTab('analysis');return true;" web:web];
        [self waitUntil:^BOOL{return [[background valueForKey:@"foregroundMatchRunning"] boolValue];}];
        XCTAssertNil([background valueForKey:@"requestedIdentifier"]);XCTAssertNil([background valueForKey:@"continuedTask"]);
        NSString *before=[self backgroundSavedGame][@"pgn"];
        if(drop)[host setValue:sleepingWeb forKey:@"webView"];
        if(screenLock)[host pauseForScreenLock];else [host enterBackground];
        XCTAssertFalse(background.active);XCTAssertNil([host valueForKey:@"activeSession"]);
        XCTAssertFalse([[host valueForKey:@"searchRunning"] boolValue]);XCTAssertFalse(UIApplication.sharedApplication.idleTimerDisabled);
        if(drop)XCTAssertEqual(sleepingWeb.droppedBackgroundEvents,1u);
        NSDictionary *paused=[self backgroundSavedGame];
        XCTAssertEqualObjects(paused[@"pgn"],before);XCTAssertEqualObjects(paused[@"engineMatch"][@"paused"],@YES);XCTAssertEqualObjects(paused[@"backgroundResume"],@NO);
        // The native lock/background transition is simulated while XCTest is
        // physically foregrounded. Keep the driver awake after checking release.
        UIApplication.sharedApplication.idleTimerDisabled=YES;
        XCTestExpectation *delay=[self expectationWithDescription:@"Paused match stays frozen"];
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW,2*NSEC_PER_SEC),dispatch_get_main_queue(),^{[delay fulfill];});[self waitForExpectations:@[delay] timeout:4];
        NSDictionary *after=[self backgroundSavedGame];
        XCTAssertEqualObjects(after[@"pgn"],paused[@"pgn"]);XCTAssertEqualObjects(after[@"clock"][@"current"],paused[@"clock"][@"current"]);XCTAssertEqualObjects(after[@"clock"][@"moveClock"][@"elapsed"],paused[@"clock"][@"moveClock"][@"elapsed"]);
        XCTAssertNil([background valueForKey:@"requestedIdentifier"]);XCTAssertNil([background valueForKey:@"continuedTask"]);
        [host setValue:web forKey:@"webView"];[self javascript:@"window.__reloadPending=true;return true;" web:web];[host enterForeground];
        XCTestExpectation *restored=[self expectationWithDescription:@"Paused match restored"];
        [self waitForBoard:web expectation:restored attempts:200];[self waitForExpectations:@[restored] timeout:25];
        NSDictionary *state=[self javascript:@"const {nativeIntegration:a}=await import('./app.js');const s=a.state(),button=document.getElementById('resumeMatch'),box=document.getElementById('matchResume');return {pgn:s.pgn,paused:s.engineMatch.paused,active:s.active,visible:!box.hidden&&button.getBoundingClientRect().height>=44,label:button.textContent,white:s.engineMatch.white,black:s.engineMatch.black};" web:web];
        XCTAssertEqualObjects(state[@"pgn"],before);XCTAssertEqualObjects(state[@"paused"],@YES);XCTAssertEqualObjects(state[@"active"],@NO);
        XCTAssertEqualObjects(state[@"white"],@"stockfish19");XCTAssertEqualObjects(state[@"black"],@"reckless090");XCTAssertEqualObjects(state[@"visible"],@YES);XCTAssertEqualObjects(state[@"label"],@"Resume Match");
        NSDictionary *resumed=[self javascript:@"const {nativeIntegration:a}=await import('./app.js');document.getElementById('resumeMatch').click();const s=a.state();return {pgn:s.pgn,paused:s.engineMatch.paused,buttonHidden:document.getElementById('matchResume').hidden};" web:web];
        XCTAssertEqualObjects(resumed[@"pgn"],before);XCTAssertEqualObjects(resumed[@"paused"],@NO);XCTAssertEqualObjects(resumed[@"buttonHidden"],@YES);
        [self waitUntil:^BOOL{return [[background valueForKey:@"foregroundMatchRunning"] boolValue];}];
        XCTAssertTrue(UIApplication.sharedApplication.idleTimerDisabled);XCTAssertNil([background valueForKey:@"requestedIdentifier"]);XCTAssertNil([background valueForKey:@"continuedTask"]);
        NSLog(@"MATCH_INACTIVITY_PAUSE: lock=%d analysis=%d droppedEvent=%d; frozen PGN/clocks, no system activity, visible smaller Resume Match, same-game resume",screenLock,analysis,drop);
    } @finally {
        [host setValue:web forKey:@"webView"];[host enterForeground];[self javascript:@"const {nativeIntegration:a}=await import('./app.js');a.stopEngineMatch();return true;" web:web];
    }
}
- (void)testEngineMatchInactivityFromAnalysisPausesWithoutSystemActivity { [self checkMatchPausesForScreenLock:NO analysis:YES dropWebEvent:NO]; }
- (void)testPersistedMatchPausesWhenWebKitDropsBackgroundEvent { [self checkMatchPausesForScreenLock:NO analysis:NO dropWebEvent:YES]; }
- (void)testScreenLockPausesNativeMatchSuccessfully { [self checkMatchPausesForScreenLock:YES analysis:NO dropWebEvent:NO]; }
- (void)testForegroundGameKeepsScreenAwake {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."],@"Use isolated app storage for screen wake tests");
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Screen wake board"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    ChessBackgroundGame *background=[(id)NSClassFromString(@"ChessBackgroundGame") shared];NSNumber *registered=[background valueForKey:@"taskRegistered"];
    BOOL oldIdle=UIApplication.sharedApplication.idleTimerDisabled;[background setValue:@NO forKey:@"taskRegistered"];
    @try {
        [self javascript:@"const {nativeIntegration:a}=await import('./app.js');a.stopEngineMatch();a.patch({opponent:'computer',side:'w',openingBook:true,showAnalysis:false,fixedTime:true,threads:1,hash:16});a.reset();a.setTab('game');return true;" web:web];
        [self waitUntil:^BOOL{return UIApplication.sharedApplication.idleTimerDisabled;}];
        XCTAssertEqualObjects([self javascript:@"const {nativeIntegration:a}=await import('./app.js');return a.state().length;" web:web],@0);
        [self javascript:@"const {nativeIntegration:a}=await import('./app.js');a.startEngineMatch({white:'stockfish19',black:'reckless090',seconds:5});a.pauseEngineMatch();return true;" web:web];
        [self waitUntil:^BOOL{return !UIApplication.sharedApplication.idleTimerDisabled;}];
        [self javascript:@"const {nativeIntegration:a}=await import('./app.js');a.resumeEngineMatch();return true;" web:web];
        [self waitUntil:^BOOL{return UIApplication.sharedApplication.idleTimerDisabled;}];
        [self javascript:@"const {nativeIntegration:a}=await import('./app.js');a.load('1. f3 e5 2. g4 Qh4#');return true;" web:web];
        [self waitUntil:^BOOL{return !UIApplication.sharedApplication.idleTimerDisabled;}];
        [self javascript:@"const {nativeIntegration:a}=await import('./app.js');a.stopEngineMatch();a.patch({opponent:'computer',side:'w',openingBook:true,showAnalysis:false});a.reset();a.setTab('analysis');return true;" web:web];
        [self waitUntil:^BOOL{return !UIApplication.sharedApplication.idleTimerDisabled;}];
        [self javascript:@"const {nativeIntegration:a}=await import('./app.js');a.setTab('game');return true;" web:web];
        [self waitUntil:^BOOL{return UIApplication.sharedApplication.idleTimerDisabled;}];
        [host enterBackground];XCTAssertFalse(UIApplication.sharedApplication.idleTimerDisabled);
        if([[host valueForKey:@"backgroundHandoff"] boolValue])[self javascript:@"window.__reloadPending=true;return true;" web:web];
        [host enterForeground];[self waitUntil:^BOOL{return UIApplication.sharedApplication.idleTimerDisabled;}];
        XCTAssertEqualObjects([self javascript:@"const {nativeIntegration:a}=await import('./app.js');return a.state().length;" web:web],@0);
        NSLog(@"SCREEN_AWAKE: waiting human and resumed match stay awake; paused/mated/solo-analysis/background release idle timer; foreground game reapplies it");
    } @finally {
        [host enterForeground];[self javascript:@"const {nativeIntegration:a}=await import('./app.js');a.stopEngineMatch();a.patch({opponent:'local'});a.setTab('analysis');return true;" web:web];
        [background setValue:registered forKey:@"taskRegistered"];UIApplication.sharedApplication.idleTimerDisabled=oldIdle;
    }
}
- (void)testForegroundMatchDoesNotCreateSystemActivity {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."],@"Use isolated device storage");
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Foreground match activity board"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    ChessBackgroundGame *background=[(id)NSClassFromString(@"ChessBackgroundGame") shared];
    @try {
        [self javascript:@"const {nativeIntegration:a}=await import('./app.js');a.stopEngineMatch();a.patch({opponent:'local',openingBook:true,threads:1,hash:16});a.startEngineMatch({white:'stockfish19',black:'clover91',seconds:1});return true;" web:web];
        [self waitUntil:^BOOL{return [[background valueForKey:@"foregroundMatchRunning"] boolValue];}];
        id moves=[self javascript:@"const {nativeIntegration:a}=await import('./app.js');for(let i=0;i<100&&a.state().length<2;i++)await new Promise(r=>setTimeout(r,100));return a.state().length;" web:web];
        XCTAssertGreaterThanOrEqual([moves integerValue],2);
        XCTAssertNil([background valueForKey:@"requestedIdentifier"]);XCTAssertNil([background valueForKey:@"continuedTask"]);XCTAssertFalse(background.active);
        NSLog(@"MATCH_NO_SYSTEM_ACTIVITY: foreground match advances with no submitted or granted continued-processing task");
    } @finally { [host enterForeground];[self javascript:@"const {nativeIntegration:a}=await import('./app.js');a.stopEngineMatch();return true;" web:web]; }
}
- (void)testBackgroundNormalGameAllEngines {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board"];[self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    for(NSString *engine in @[@"stockfish19",@"reckless090",@"plenty800",@"pawn201",@"obsidian160",@"cinder061",@"viridithas200",@"halogen160",@"clover91",@"starzix61"]){
        NSString *script=[NSString stringWithFormat:@"const {nativeIntegration:a}=await import('chess://app/app.js');a.stopEngineMatch();a.patch({engine:'%@',opponent:'computer',side:'b',openingBook:false,threads:1,hash:16,fixedTime:true,moveTime:1});a.reset();a.setTab('game');return true;",engine];
        [self javascript:script web:web];[host enterBackground];
        [self waitUntil:^BOOL{return [[host valueForKey:@"backgroundHandoff"] boolValue]||[host valueForKey:@"backgroundBestMove"]!=nil;}];
        if([[host valueForKey:@"backgroundHandoff"] boolValue]){
            [self waitUntil:^BOOL{return [self backgroundSavedGame][@"backgroundWaiting"]!=nil;}];
            XCTAssertFalse(((ChessBackgroundGame *)[(id)NSClassFromString(@"ChessBackgroundGame") shared]).active);
            [self javascript:@"window.__reloadPending=true;return true;" web:web];
        }
        [host enterForeground];
        XCTestExpectation *restored=[self expectationWithDescription:@"Restored board"];[self waitForBoard:web expectation:restored attempts:200];[self waitForExpectations:@[restored] timeout:25];
        id state=[self javascript:@"const {nativeIntegration:a}=await import('chess://app/app.js');await new Promise(r=>setTimeout(r,500));return {moves:a.state().length,engine:a.state().settings.engine};" web:web];
        XCTAssertEqualObjects(state[@"moves"],@1);XCTAssertEqualObjects(state[@"engine"],engine);
    }
}

- (NSDictionary *)backgroundSavedGame {
    NSString *json=[NSUserDefaults.standardUserDefaults dictionaryForKey:@"ChessStorage"][@"chess-preview-v2"];
    return json?[NSJSONSerialization JSONObjectWithData:[json dataUsingEncoding:NSUTF8StringEncoding] options:0 error:nil]:@{};
}
- (void)testBackgroundMatchPausesAndRestores { [self checkMatchPausesForScreenLock:NO analysis:NO dropWebEvent:NO]; }
- (void)testBackgroundTournamentPausesBeforeNextGame {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board"];[self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    [self javascript:@"const {nativeIntegration:a}=await import('chess://app/app.js');a.patch({openingBook:false,threads:1,hash:16});const p={white:'stockfish19',black:'clover91'};localStorage.setItem('chess-preview-tournament',JSON.stringify({id:'native-test',engines:['stockfish19','clover91'],schedule:[p,p],results:[],control:{seconds:1,fixedTime:true,gameMinutes:1,increment:0}}));a.startEngineMatch({...p,seconds:1,tournamentId:'native-test',round:1});a.load('7k/5K2/6Q1/8/8/8/8/8 w - - 0 1');return true;" web:web];
    NSString *before=[self backgroundSavedGame][@"pgn"];
    [host enterBackground];UIApplication.sharedApplication.idleTimerDisabled=YES;
    XCTestExpectation *delay=[self expectationWithDescription:@"Tournament remains paused"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,2*NSEC_PER_SEC),dispatch_get_main_queue(),^{[delay fulfill];});[self waitForExpectations:@[delay] timeout:4];
    NSDictionary *paused=[self backgroundSavedGame];
    XCTAssertEqualObjects(paused[@"pgn"],before);XCTAssertEqualObjects(paused[@"engineMatch"][@"paused"],@YES);XCTAssertEqualObjects(paused[@"engineMatch"][@"round"],@1);
    [self javascript:@"window.__reloadPending=true;return true;" web:web];[host enterForeground];
    XCTestExpectation *resumeBoard=[self expectationWithDescription:@"Paused tournament restored"];
    [self waitForBoard:web expectation:resumeBoard attempts:200];[self waitForExpectations:@[resumeBoard] timeout:25];
    [self javascript:@"document.getElementById('resumeMatch').click();return true;" web:web];
    [self waitUntil:^BOOL{return [[self backgroundSavedGame][@"engineMatch"][@"round"] integerValue]==2;}];
    [self waitUntil:^BOOL{return [[self backgroundSavedGame][@"pgn"] containsString:@"2."];}];
    NSString *json=[NSUserDefaults.standardUserDefaults dictionaryForKey:@"ChessStorage"][@"chess-preview-tournament"];
    NSDictionary *t=[NSJSONSerialization JSONObjectWithData:[json dataUsingEncoding:NSUTF8StringEncoding] options:0 error:nil];
    XCTAssertEqual([t[@"results"] count],1u);XCTAssertEqualObjects(t[@"results"][0][@"result"],@"1-0");
    [self javascript:@"const {nativeIntegration:a}=await import('chess://app/app.js');a.stopEngineMatch();return true;" web:web];
}
- (void)testPausedBackgroundMatchHasNoLateMoves {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board"];[self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    [self javascript:@"const {nativeIntegration:a}=await import('chess://app/app.js');a.patch({openingBook:false,threads:1,hash:16});a.startEngineMatch({white:'stockfish19',black:'stockfish19',seconds:5});return true;" web:web];
    [host enterBackground];UIApplication.sharedApplication.idleTimerDisabled=YES;
    XCTAssertFalse(((ChessBackgroundGame *)[(id)NSClassFromString(@"ChessBackgroundGame") shared]).active);
    XCTAssertEqualObjects([self backgroundSavedGame][@"engineMatch"][@"paused"],@YES);
    NSString *before=[self backgroundSavedGame][@"pgn"];
    XCTestExpectation *delay=[self expectationWithDescription:@"No late move"];dispatch_after(dispatch_time(DISPATCH_TIME_NOW,6*NSEC_PER_SEC),dispatch_get_main_queue(),^{[delay fulfill];});[self waitForExpectations:@[delay] timeout:8];
    XCTAssertEqualObjects(before,[self backgroundSavedGame][@"pgn"]);XCTAssertFalse(((ChessBackgroundGame *)[(id)NSClassFromString(@"ChessBackgroundGame") shared]).active);
    [self javascript:@"window.__reloadPending=true;return true;" web:web];[host enterForeground];
    XCTestExpectation *restored=[self expectationWithDescription:@"Restored board"];[self waitForBoard:web expectation:restored attempts:200];[self waitForExpectations:@[restored] timeout:25];
    id paused=[self javascript:@"const {nativeIntegration:a}=await import('chess://app/app.js');const p=a.state().engineMatch.paused;a.stopEngineMatch();return p;" web:web];XCTAssertEqualObjects(paused,@YES);
    XCTAssertTrue([host validCommand:@"go movetime 120000"]);
}





- (void)testTournamentResultsAfterForegroundAndPausedResume {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Tournament board"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    // Completed games release the app's wake lock. Keep the physical test
    // driver awake while checking the results UI after those completions.
    BOOL oldIdle=UIApplication.sharedApplication.idleTimerDisabled;
    NSTimer *driverWake=[NSTimer scheduledTimerWithTimeInterval:.1 repeats:YES block:^(NSTimer *timer){UIApplication.sharedApplication.idleTimerDisabled=YES;}];
    @try {
    for(NSNumber *inBackground in @[@NO,@YES]){
        [self javascript:@"const {nativeIntegration:a}=await import('chess://app/app.js');a.stopEngineMatch();a.patch({openingBook:false,threads:1,hash:16});document.getElementById('newEngineTournament').click();for(const box of document.querySelectorAll('#tournamentEngines input'))box.checked=['stockfish19','clover91'].includes(box.value);document.getElementById('tournamentGames').value='1';document.getElementById('tournamentSeconds').value='1';const random=Math.random;Math.random=()=>1;try{document.getElementById('startTournament').click();}finally{Math.random=random;}a.load('7k/5K2/6Q1/8/8/8/8/8 w - - 0 1');return true;" web:web];
        if(!inBackground.boolValue){
            id during=[self javascript:@"for(let i=0;i<200&&!document.querySelector('.win-confetti');i++)await new Promise(r=>setTimeout(r,50));await new Promise(r=>setTimeout(r,700));return {confetti:!!document.querySelector('.win-confetti'),results:document.getElementById('tournamentResultsDialog').open};" web:web];
            XCTAssertEqualObjects(during[@"confetti"],@YES);XCTAssertEqualObjects(during[@"results"],@NO);
        }
        if(inBackground.boolValue){
            [host enterBackground];UIApplication.sharedApplication.idleTimerDisabled=YES;
            XCTAssertEqualObjects([self backgroundSavedGame][@"engineMatch"][@"paused"],@YES);
            [self javascript:@"window.__reloadPending=true;return true;" web:web];[host enterForeground];
            XCTestExpectation *restored=[self expectationWithDescription:@"Paused tournament restored"];
            [self waitForBoard:web expectation:restored attempts:200];[self waitForExpectations:@[restored] timeout:25];
            [self javascript:@"document.getElementById('resumeMatch').click();return true;" web:web];
        }
        id result=[self javascript:@"for(let i=0;i<200&&!document.getElementById('tournamentResultsDialog').open;i++)await new Promise(r=>setTimeout(r,100));const t=JSON.parse(localStorage.getItem('chess-preview-tournament'));return {confetti:!!document.querySelector('.win-confetti'),open:document.getElementById('tournamentResultsDialog').open,winner:document.getElementById('tournamentWinner').textContent,rows:[...document.querySelectorAll('#tournamentFinalStandings tbody tr')].map(row=>[...row.cells].map(cell=>cell.textContent)),count:t.results.length,shown:t.resultsShown};" web:web];
        XCTAssertEqualObjects(result[@"confetti"],@NO);XCTAssertEqualObjects(result[@"open"],@YES);XCTAssertEqualObjects(result[@"winner"],@"Winner: Stockfish 19");
        XCTAssertEqualObjects(result[@"rows"],(@[@[@"Stockfish 19",@"1",@"0",@"0",@"1"],@[@"Clover 9.1",@"0",@"0",@"1",@"0"]]));
        XCTAssertEqualObjects(result[@"count"],@1);XCTAssertEqualObjects(result[@"shown"],@YES);
        id visible=[self javascript:@"const d=document.getElementById('tournamentResultsDialog'),r=d.getBoundingClientRect();return {visible:getComputedStyle(d).display!=='none'&&r.width>200&&r.height>200,rows:document.querySelectorAll('#tournamentFinalStandings tbody tr').length};" web:web];
        XCTAssertEqualObjects(visible[@"visible"],@YES);XCTAssertEqualObjects(visible[@"rows"],@2);
        if(!inBackground.boolValue){
            XCTestExpectation *snapshot=[self expectationWithDescription:@"Tournament results screenshot"];
            [web takeSnapshotWithConfiguration:nil completionHandler:^(UIImage *image,NSError *error){
                XCTAssertNil(error);XCTAssertNotNil(image);
                if(image){
                    NSURL *folder=[[NSFileManager.defaultManager URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask].firstObject URLByAppendingPathComponent:@"ReleaseScreenshots"];
                    [NSFileManager.defaultManager createDirectoryAtURL:folder withIntermediateDirectories:YES attributes:nil error:nil];
                    [UIImagePNGRepresentation(image) writeToURL:[folder URLByAppendingPathComponent:@"Tournament-Results.png"] atomically:YES];
                    XCTAttachment *attachment=[XCTAttachment attachmentWithImage:image];attachment.name=@"Tournament-Results";attachment.lifetime=XCTAttachmentLifetimeKeepAlways;[self addAttachment:attachment];
                }
                [snapshot fulfill];
            }];
            [self waitForExpectations:@[snapshot] timeout:10];
        }
        id dismissed=[self javascript:@"document.getElementById('tournamentResultsDone').click();await new Promise(r=>setTimeout(r,1200));const dismissed=!document.getElementById('tournamentResultsDialog').open;document.getElementById('newEngineTournament').click();document.getElementById('viewTournamentResults').click();const reopened=document.getElementById('tournamentResultsDialog').open;document.getElementById('tournamentResultsDone').click();const {nativeIntegration:a}=await import('chess://app/app.js');a.stopEngineMatch();return {dismissed,reopened};" web:web];
        XCTAssertEqualObjects(dismissed[@"dismissed"],@YES);XCTAssertEqualObjects(dismissed[@"reopened"],@YES);
    }
    } @finally { [driverWake invalidate];UIApplication.sharedApplication.idleTimerDisabled=oldIdle; }
}

- (void)testCPUCoreBreakdown {
    NSDictionary *known=ChessCoreBreakdown(6,0,0,@"iPhone18,2",NO);
    XCTAssertEqualObjects(known[@"performance"],@2);XCTAssertEqualObjects(known[@"efficiency"],@4);
    XCTAssertEqual(ChessCoreBreakdown(6,0,0,@"unknown",NO).count,0u);
    XCTAssertEqual(ChessCoreBreakdown(6,2,2,@"unknown",NO).count,0u);
    XCTAssertEqual(ChessCoreBreakdown(6,0,0,@"iPhone18,2",YES).count,0u);
    NSDictionary *detected=ChessCoreBreakdown(8,4,4,@"unknown",NO);XCTAssertEqualObjects(detected[@"performance"],@4);
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Core breakdown ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    id result=[self javascript:@"for(let i=0;i<100&&document.getElementById('threads').disabled;i++)await new Promise(r=>setTimeout(r,50));const info=await fetch('/api/engine/info').then(r=>r.json());return {info,help:document.getElementById('threadsHelp').textContent};" web:web];
    NSLog(@"CPU_CORE_BREAKDOWN: %@",result);
    XCTAssertEqualObjects(result[@"info"][@"coreInfo"],ChessCPUCoreInfo());
    NSString *total=[NSString stringWithFormat:@"%lu cores total",(unsigned long)NSProcessInfo.processInfo.processorCount];XCTAssertTrue([result[@"help"] containsString:total]);
    NSDictionary *cores=ChessCPUCoreInfo();
    if(cores.count){NSString *split=[NSString stringWithFormat:@"%@ performance + %@ efficiency cores",cores[@"performance"],cores[@"efficiency"]];XCTAssertTrue([result[@"help"] containsString:split]);}
    else XCTAssertTrue([result[@"help"] containsString:@"Core-type breakdown unavailable"]);
}

- (void)testDetectedHashLimit {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Hash limits ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    uint64_t memory=NSProcessInfo.processInfo.physicalMemory/(1024ULL*1024ULL);
    NSUInteger maximum=16;while(maximum<=memory/8 && maximum<16384)maximum*=2;
    NSString *upper=[NSString stringWithFormat:@"setoption name Hash value %lu",(unsigned long)maximum];XCTAssertTrue([host validCommand:upper]);
    for(NSString *value in @[@"0",@"15",@"-1",@"32.5",@"032",@"32\nstop"])XCTAssertFalse([host validCommand:[@"setoption name Hash value " stringByAppendingString:value]]);
    NSString *excess=[NSString stringWithFormat:@"setoption name Hash value %lu",(unsigned long)maximum+1];XCTAssertFalse([host validCommand:excess]);
    id result=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');for(let i=0;i<100&&document.getElementById('hash').disabled;i++)await new Promise(r=>setTimeout(r,50));const info=await fetch('/api/engine/info').then(r=>r.json());const slider=document.getElementById('hash');slider.value=slider.max;slider.dispatchEvent(new Event('input'));const label=document.getElementById('hashSize').textContent;const help=document.getElementById('hashHelp').textContent;api.stopEngineMatch();api.patch({engine:'stockfish19',opponent:'local',openingBook:false,time:0,showAnalysis:true,threads:1,hash:Math.min(256,info.maxHashMB)});api.load('1. e4 e5');api.setTab('analysis');for(let i=0;i<200&&!api.state().lines.length;i++)await new Promise(r=>setTimeout(r,50));const result={native:chessNative.maxHashMB,api:info.maxHashMB,memory:info.memoryMB,label,help,selected:api.state().settings.hash,searchWorks:api.state().lines.length>0};api.patch({hash:32});return result;" web:web];
    NSLog(@"DETECTED_HASH: %@",result);
    XCTAssertEqualObjects(result[@"native"],@(maximum));XCTAssertEqualObjects(result[@"api"],@(maximum));XCTAssertEqualObjects(result[@"memory"],@(memory));
    NSString *label=[NSString stringWithFormat:@"%lu MB",(unsigned long)maximum];XCTAssertEqualObjects(result[@"label"],label);
    XCTAssertEqualObjects(result[@"selected"],@(MIN(256,maximum)));XCTAssertEqualObjects(result[@"searchWorks"],@YES);
}

- (void)testMainTablebaseIndicator {
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"TB indicator ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    id result=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.stopEngineMatch();api.patch({engine:'stockfish19',opponent:'local',openingBook:false,showAnalysis:true,time:0,threads:1,hash:32});api.load('[SetUp \"1\"]\\n[FEN \"7k/8/8/8/8/8/8/KBN5 w - - 0 1\"]\\n\\n*');api.setTab('game');for(let i=0;i<200&&!document.querySelector('#positionCount .tablebase-indicator');i++)await new Promise(r=>setTimeout(r,50));const badge=document.querySelector('#positionCount .tablebase-indicator');const visible=badge?.textContent==='TB'&&!document.getElementById('positionCount').hidden;api.reset();await new Promise(r=>setTimeout(r,500));return {visible,cleared:!document.querySelector('#positionCount .tablebase-indicator')};" web:web];
    NSLog(@"MAIN_TB_INDICATOR: %@",result);
    XCTAssertEqualObjects(result[@"visible"],@YES);XCTAssertEqualObjects(result[@"cleared"],@YES);
}

- (void)testBundledTablebases {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Tablebase test ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    [host suspend];
    NSString *folder=[NSBundle.mainBundle.resourcePath stringByAppendingPathComponent:@"Tablebases"];
    NSArray *files=[NSFileManager.defaultManager contentsOfDirectoryAtPath:folder error:nil];
    NSUInteger count=0;for(NSString *file in files)if([@[@"rtbw",@"rtbz"] containsObject:file.pathExtension])count++;
    XCTAssertEqual(count,70u);
    for(NSString *engine in @[@"stockfish19",@"clover91"]) {
        for(NSString *fen in @[@"7k/8/8/8/8/8/8/KQ6 w - - 0 1",@"7k/8/8/8/8/8/8/KBN5 w - - 0 1"]) {
            NSString *session=NSUUID.UUID.UUIDString;
            XCTestExpectation *done=[self expectationWithDescription:@"Tablebase endgame searched"];
            __block BOOL hit=NO;__block BOOL found=NO;
            [[(id)NSClassFromString(@"SFEngine") shared] open:session engine:engine output:^(NSString *identifier,NSString *line){
                if([line containsString:@"Found 35 WDL and 35 DTZ"])found=YES;
                if([line rangeOfString:@"tbhits [1-9][0-9]*" options:NSRegularExpressionSearch].location!=NSNotFound)hit=YES;
                if([line hasPrefix:@"bestmove "])[done fulfill];
            }];
            for(NSString *command in @[@"setoption name Threads value 1",@"setoption name Hash value 16",@"setoption name SyzygyPath value <empty>",[@"position fen " stringByAppendingString:fen],@"go movetime 300"]) [[(id)NSClassFromString(@"SFEngine") shared] send:command session:session];
            [self waitForExpectations:@[done] timeout:30];
            NSLog(@"TABLEBASE: %@ %@ found=%d hit=%d",engine,fen,found,hit);
            XCTAssertTrue(found);XCTAssertTrue(hit);
            [[(id)NSClassFromString(@"SFEngine") shared] close:session];
        }
    }
}

- (void)checkBackgroundSearchForEngine:(NSString *)engine {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Background search test ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    NSString *script=[NSString stringWithFormat:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.stopEngineMatch();api.patch({engine:'%@',opponent:'computer',side:'w',openingBook:false,time:0,showAnalysis:true,threads:1,hash:32});api.load('1. e4 e5 2. Nf3 Nc6 3. Bb5 a6');api.setTab('game');for(let i=0;i<160&&(api.state().nodes===0||!api.state().lines.length);i++)await new Promise(r=>setTimeout(r,50));return {active:api.state().active,lines:api.state().lines.length,id:api.state().searchId,nodes:api.state().nodes,depth:api.state().depth};",engine];
    id state=[self javascript:script web:web];XCTAssertEqualObjects(state[@"active"],@YES);XCTAssertGreaterThan([state[@"lines"] intValue],0);
    NSDictionary *before=state;
    NSString *session=[host valueForKey:@"activeSession"];
    [host enterBackground];
    state=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');await new Promise(r=>setTimeout(r,1200));return {active:api.state().active,suspended:api.state().suspended};" web:web];
    XCTAssertEqualObjects(state[@"active"],@YES);XCTAssertEqualObjects(state[@"suspended"],@YES);
    XCTAssertTrue([[host valueForKey:@"searchRunning"] boolValue]);
    XCTAssertTrue([[host valueForKey:@"backgroundLines"] count]>0 || [host valueForKey:@"backgroundProgress"]!=nil);
    [host enterForeground];
    XCTAssertEqualObjects([host valueForKey:@"activeSession"],session);
    state=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');await new Promise(r=>setTimeout(r,200));const before=document.getElementById('positionCount').textContent;for(let i=0;i<80&&before===document.getElementById('positionCount').textContent;i++)await new Promise(r=>setTimeout(r,100));return {active:api.state().active,suspended:api.state().suspended,changed:before!==document.getElementById('positionCount').textContent,id:api.state().searchId,nodes:api.state().nodes,depth:api.state().depth};" web:web];
    XCTAssertEqualObjects(state[@"active"],@YES);XCTAssertEqualObjects(state[@"suspended"],@NO);XCTAssertEqualObjects(state[@"changed"],@YES);
    XCTAssertEqualObjects(state[@"id"],before[@"id"]);
    XCTAssertGreaterThan([state[@"nodes"] longLongValue],[before[@"nodes"] longLongValue]);
    XCTAssertGreaterThanOrEqual([state[@"depth"] integerValue],[before[@"depth"] integerValue]);
    NSLog(@"RETAINED_SEARCH %@ before=%@ after=%@",engine,before,state);
    [host enterBackground];[host expireBackgroundSearch];
    [self waitUntil:^BOOL{return ![[host valueForKey:@"searchRunning"] boolValue];}];
    XCTAssertNotNil([host valueForKey:@"backgroundBestMove"]);
    [host enterForeground];
    state=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');await new Promise(r=>setTimeout(r,1200));const before=document.getElementById('positionCount').textContent;for(let i=0;i<80&&before===document.getElementById('positionCount').textContent;i++)await new Promise(r=>setTimeout(r,100));return {active:api.state().active,suspended:api.state().suspended,lines:api.state().lines.length,changed:before!==document.getElementById('positionCount').textContent};" web:web];
    XCTAssertEqualObjects(state[@"active"],@YES);XCTAssertEqualObjects(state[@"suspended"],@NO);XCTAssertGreaterThan([state[@"lines"] intValue],0);XCTAssertEqualObjects(state[@"changed"],@YES);
    NSLog(@"BACKGROUND_SEARCH_PASS: %@",engine);
}
- (void)testStockfish19BackgroundSearch {[self checkBackgroundSearchForEngine:@"stockfish19"];}
- (void)testBackgroundWebViewRecoveryWaitsForForeground {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Recovery test ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    [self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.patch({opponent:'local',time:0});api.setTab('analysis');return true;" web:web];
    [host enterBackground];
    [(id<WKNavigationDelegate>)host webViewWebContentProcessDidTerminate:web];
    XCTAssertTrue([[host valueForKey:@"reloadOnForeground"] boolValue]);
    XCTAssertNil([host valueForKey:@"activeSession"]);
    [host enterForeground];
    XCTAssertFalse([[host valueForKey:@"reloadOnForeground"] boolValue]);
    XCTestExpectation *reloaded=[self expectationWithDescription:@"Recovered WebView"];
    [self waitForBoard:web expectation:reloaded attempts:200];[self waitForExpectations:@[reloaded] timeout:25];
}
- (void)testCloverBackgroundSearch {[self checkBackgroundSearchForEngine:@"clover91"];}
- (void)testRecklessBackgroundSearch {[self checkBackgroundSearchForEngine:@"reckless090"];}
- (void)testPlentyBackgroundSearch {[self checkBackgroundSearchForEngine:@"plenty800"];}
- (void)testPawnocchioBackgroundSearch {[self checkBackgroundSearchForEngine:@"pawn201"];}
- (void)testObsidianBackgroundSearch {[self checkBackgroundSearchForEngine:@"obsidian160"];}

- (void)testComputerThinkingKeepsSearchAcrossMinimize {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Computer search ready"];[self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    id before=[self javascript:@"const {nativeIntegration:a}=await import('chess://app/app.js');a.stopEngineMatch();a.patch({engine:'stockfish19',opponent:'computer',side:'w',fixedTime:true,moveTime:30,openingBook:false,threads:1,hash:16});a.load('1. e4');a.setTab('game');for(let i=0;i<160&&!a.state().nodes;i++)await new Promise(r=>setTimeout(r,50));return {id:a.state().searchId,nodes:a.state().nodes,depth:a.state().depth,fen:a.state().fen};" web:web];
    NSString *session=[host valueForKey:@"activeSession"];
    [host enterBackground];
    [self javascript:@"await new Promise(r=>setTimeout(r,1800));return true;" web:web];
    XCTAssertFalse([[host valueForKey:@"backgroundHandoff"] boolValue]);
    [host enterForeground];
    id after=[self javascript:@"const {nativeIntegration:a}=await import('chess://app/app.js');await new Promise(r=>setTimeout(r,400));return {id:a.state().searchId,nodes:a.state().nodes,depth:a.state().depth,fen:a.state().fen};" web:web];
    XCTAssertEqualObjects([host valueForKey:@"activeSession"],session);XCTAssertEqualObjects(after[@"id"],before[@"id"]);XCTAssertEqualObjects(after[@"fen"],before[@"fen"]);
    XCTAssertGreaterThan([after[@"nodes"] longLongValue],[before[@"nodes"] longLongValue]);XCTAssertGreaterThanOrEqual([after[@"depth"] integerValue],[before[@"depth"] integerValue]);
    [self javascript:@"const {nativeIntegration:a}=await import('chess://app/app.js');a.patch({opponent:'local'});return true;" web:web];
}

- (void)testBackgroundComputerMoveDeliveredOnce {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Background move ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    [self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.patch({engine:'stockfish19',opponent:'local',openingBook:false,fixedTime:true,moveTime:3,side:'b'});api.reset();api.setTab('game');api.patch({opponent:'computer'});for(let i=0;i<100&&api.state().nodes===0;i++)await new Promise(r=>setTimeout(r,20));return true;" web:web];
    [host enterBackground];
    // This handoff is simulated while UIKit is still foregrounded. Keep the
    // physical test phone awake so Auto-Lock does not interrupt the driver.
    UIApplication.sharedApplication.idleTimerDisabled=YES;
    id state=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');await new Promise(r=>setTimeout(r,4000));return api.state().length;" web:web];
    XCTAssertEqualObjects(state,@0);XCTAssertNotNil([host valueForKey:@"backgroundBestMove"]);
    [host enterForeground];
    state=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');await new Promise(r=>setTimeout(r,500));return api.state().length;" web:web];
    XCTAssertEqualObjects(state,@1);
    [host enterForeground];
    state=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');await new Promise(r=>setTimeout(r,200));api.patch({opponent:'local'});return api.state().length;" web:web];
    XCTAssertEqualObjects(state,@1);
}

- (void)testComputerTakeBackAfterMateResumesNativeEngine {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."],@"Use isolated app storage for computer take-back tests");
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    [host setValue:@YES forKey:@"offlineForTesting"];
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Computer take-back board loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    NSArray *cases=@[
        @{@"pgn":@"[Event \"Native Take Back\"]\n[Result \"0-1\"]\n\n1. f3 e5 2. g4 Qh4# 0-1",@"human":@"w",@"computer":@"b",@"plies":@4,@"winner":@"Black"},
        @{@"pgn":@"[Event \"Native Take Back\"]\n[Result \"1-0\"]\n\n1. e4 e5 2. Bc4 Nc6 3. Qh5 Nf6 4. Qxf7# 1-0",@"human":@"b",@"computer":@"w",@"plies":@7,@"winner":@"White"}
    ];
    for(NSDictionary *mate in cases){
        NSData *json=[NSJSONSerialization dataWithJSONObject:mate options:0 error:nil];
        NSString *caseJSON=[[NSString alloc] initWithData:json encoding:NSUTF8StringEncoding];
        NSString *setup=[[NSString stringWithFormat:@"const c=%@;",caseJSON] stringByAppendingString:
            @"const {nativeIntegration:a}=await import('./app.js');const {Chess}=await import('./vendor/chess.js');"
             "document.querySelectorAll('dialog[open]').forEach(d=>d.close());a.stopEngineMatch();"
             "a.patch({engine:'stockfish19',opponent:'local',level:'20',openingBook:false,showAnalysis:false,permanentBrain:false,moveSound:false,moveHaptics:false,fixedTime:true,moveTime:3,threads:1,hash:16,language:'en'});"
             "a.setTab('game');a.load(c.pgn);a.patch({opponent:'computer',side:c.human});"
             "for(let i=0;i<150&&!a.state().ready;i++)await new Promise(r=>setTimeout(r,50));"
             "const original=a.state(),mated=new Chess(original.fen);window.__nativeTakeBackCase={...c,pgn:original.pgn};"
             "document.getElementById('toolbarMove').click();const opened=document.getElementById('moveMenu').open;document.getElementById('takeBack').click();"
             "const s=a.state(),game=new Chess();game.loadPgn(s.pgn);"
             "return {originalMate:mated.isCheckmate()&&original.length===c.plies,opened,live:s.cursor===s.length&&s.length===c.plies-1,computerTurn:game.turn()===c.computer,ongoing:!game.isGameOver(),resultCleared:game.getHeaders().Result==='*',headersRetained:game.getHeaders().Event==='Native Take Back',dialogClosed:!document.querySelector('dialog[open]'),noReview:!document.getElementById('status').textContent.includes('Reviewing'),nativeBridge:!!globalThis.chessNative,engineIdentity:s.engineIdentity||'',searchQueued:s.searchId!==null};"];
        NSDictionary *undone=[self javascript:setup web:web];
        NSLog(@"NATIVE_COMPUTER_TAKE_BACK_%@: %@",mate[@"winner"],undone);
        for(NSString *key in @[@"originalMate",@"opened",@"live",@"computerTurn",@"ongoing",@"resultCleared",@"headersRetained",@"dialogClosed",@"noReview",@"nativeBridge",@"searchQueued"])XCTAssertEqualObjects(undone[key],@YES,@"%@ %@",mate[@"winner"],key);
        XCTAssertTrue([undone[@"engineIdentity"] hasPrefix:@"Stockfish"],@"%@",undone);
        NSDictionary *remated=[self javascript:
            @"const {nativeIntegration:a}=await import('./app.js');const {Chess}=await import('./vendor/chess.js');const c=window.__nativeTakeBackCase;"
             "for(let i=0;i<200&&a.state().length<c.plies;i++)await new Promise(r=>setTimeout(r,50));"
             "for(let i=0;i<30&&document.querySelector('.moving-piece');i++)await new Promise(r=>setTimeout(r,50));"
             "const s=a.state(),game=new Chess();game.loadPgn(s.pgn);const last=game.history({verbose:true}).at(-1);"
             "return {remated:game.isCheckmate()&&s.length===c.plies,live:s.cursor===s.length,legalFullPGN:game.history().length===c.plies&&game.fen()===s.fen,correctWinner:game.turn()===c.human&&last.color===c.computer,retainedHistory:game.history().slice(0,-1).join(' ')===(()=>{const old=new Chess();old.loadPgn(c.pgn);return old.history().slice(0,-1).join(' ');})(),winnerText:document.getElementById('gameInsights').textContent.includes('Checkmate — '+c.winner+' wins'),pgn:s.pgn};" web:web];
        NSLog(@"NATIVE_COMPUTER_REMATE_%@: %@",mate[@"winner"],remated);
        for(NSString *key in @[@"remated",@"live",@"legalFullPGN",@"correctWinner",@"retainedHistory",@"winnerText"])XCTAssertEqualObjects(remated[key],@YES,@"%@ %@",mate[@"winner"],key);
        [self captureRelease:[NSString stringWithFormat:@"Computer-Take-Back-%@-Remates",mate[@"winner"]]];

        // The same visible menu action remains a non-destructive review in Analysis.
        NSDictionary *review=[self javascript:
            @"const {nativeIntegration:a}=await import('./app.js');const c=window.__nativeTakeBackCase;a.setTab('analysis');a.load(c.pgn);const original=a.state().pgn;"
             "document.getElementById('toolbarMove').click();document.getElementById('takeBack').click();const immediate=a.state();"
             "await new Promise(r=>setTimeout(r,3600));const s=a.state();"
             "return {reviewed:immediate.tab==='analysis'&&immediate.cursor===c.plies-1&&immediate.length===c.plies,fullPGNPreserved:immediate.pgn===original&&s.pgn===original,noAutoplay:s.cursor===c.plies-1&&s.length===c.plies,dialogClosed:!document.querySelector('dialog[open]')};" web:web];
        for(NSString *key in @[@"reviewed",@"fullPGNPreserved",@"noAutoplay",@"dialogClosed"])XCTAssertEqualObjects(review[key],@YES,@"%@ Analysis %@",mate[@"winner"],key);
    }
    // Two immediate menu take-backs cancel the queued computer response and leave the human's turn live.
    NSDictionary *rapid=[self javascript:
        @"const {nativeIntegration:a}=await import('./app.js');const {Chess}=await import('./vendor/chess.js');a.patch({opponent:'local'});a.setTab('game');a.load('[Result \"0-1\"]\\n\\n1. f3 e5 2. g4 Qh4# 0-1');a.patch({opponent:'computer',side:'w'});"
         "document.getElementById('toolbarMove').click();document.getElementById('takeBack').click();const first=a.state();"
         "document.getElementById('toolbarMove').click();document.getElementById('takeBack').click();const second=a.state();await new Promise(r=>setTimeout(r,4100));"
         "const s=a.state(),game=new Chess();game.loadPgn(s.pgn);const outcome={firstQueued:first.length===3&&first.cursor===3&&first.searchId!==null,humanTurnLive:second.length===2&&second.cursor===2&&game.turn()==='w',noStaleReply:s.length===2&&s.cursor===2&&s.pgn===second.pgn,noReview:!document.getElementById('status').textContent.includes('Reviewing')};a.patch({opponent:'local'});return outcome;" web:web];
    NSLog(@"NATIVE_COMPUTER_TAKE_BACK_RAPID: %@",rapid);
    for(NSString *key in @[@"firstQueued",@"humanTurnLive",@"noStaleReply",@"noReview"])XCTAssertEqualObjects(rapid[key],@YES,@"%@",key);
}

- (void)testMainDisplayContinuityAndRoundedAnalysisBar {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use isolated app storage for display tests");
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Main game ready"];
    [self waitForBoard:web expectation:loaded attempts:200];
    [self waitForExpectations:@[loaded] timeout:25];
    XCTestExpectation *done=[self expectationWithDescription:@"Main display remains visible after moves"];
    __block id result;
    [web callAsyncJavaScript:@"const tests=await import('chess://app/ios-integration-tests.js');try{return await tests.mainDisplayContinuity();}catch(error){return {error:error.message};}" arguments:@{} inFrame:nil inContentWorld:WKContentWorld.pageWorld completionHandler:^(id value,NSError *error){XCTAssertNil(error,@"%@",error);result=value;[done fulfill];}];
    [self waitForExpectations:@[done] timeout:90];
    NSLog(@"MAIN_DISPLAY_CONTINUITY: %@",result);
    XCTAssertNil(result[@"error"],@"%@",result);
    XCTAssertEqualObjects(result[@"mainDisplayContinuous"],@YES);
    XCTAssertEqualObjects(result[@"matchingRoundness"],@YES);
    XCTAssertEqualObjects(result[@"movesChecked"],@3);
    XCTAssertGreaterThan([result[@"samples"] intValue],60);
}

- (void)testGameEndAnimationAssets {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use isolated app storage for animation tests");
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Animation assets ready"];
    [self waitForBoard:web expectation:loaded attempts:200];
    [self waitForExpectations:@[loaded] timeout:25];
    XCTestExpectation *done=[self expectationWithDescription:@"Ten bundled scenes and complete archer playback"];
    __block NSDictionary *result;
    [web callAsyncJavaScript:@"const tests=await import('chess://app/ios-integration-tests.js');try{return await tests.gameEndAnimationAssets();}catch(error){return {error:error.message};}" arguments:@{} inFrame:nil inContentWorld:WKContentWorld.pageWorld completionHandler:^(id value,NSError *error){XCTAssertNil(error,@"%@",error);result=value;[done fulfill];}];
    [self waitForExpectations:@[done] timeout:120];
    NSLog(@"GAME_END_ANIMATION_ASSETS: %@",result);
    XCTAssertNotNil(result);if(!result)return;
    XCTAssertNil(result[@"error"],@"%@",result);
    XCTAssertEqualObjects(result[@"scenesChecked"],@10);
    XCTAssertEqualObjects(result[@"viewsChecked"],@20);
    XCTAssertEqualObjects(result[@"animationOffCases"],@4);
    for(NSString *key in @[@"noAnimatedKing",@"offWinnerColors",@"confettiBothModes",@"confettiCleaned",@"archerCrystallized",@"archerTargetCleared",@"archerFinalHasCharacter",@"archerCompleted",@"temporaryContainersRemoved"])XCTAssertEqualObjects(result[key],@YES,@"%@",key);
    XCTAssertGreaterThan([result[@"emeraldPixels"] intValue],20);
    XCTAssertGreaterThan([result[@"animationSamples"] intValue],50);
}

- (void)testMainGameMateArrowsStayResponsive {
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Main game ready"];
    [self waitForBoard:web expectation:loaded attempts:200];
    [self waitForExpectations:@[loaded] timeout:25];
    XCTestExpectation *done=[self expectationWithDescription:@"Compact mate displays for both colors"];
    __block id result;
    [web callAsyncJavaScript:@"const tests=await import('chess://app/ios-integration-tests.js');try{return await tests.mainGameMateResponsiveness();}catch(error){const {nativeIntegration:api}=await import('./app.js');const state=api.state();return {error:error.message,fen:state.fen,tab:state.tab,ready:state.ready,lines:state.lines,score:document.querySelector('#positionCount .engine-stat-score .stat-score-value')?.textContent};}" arguments:@{} inFrame:nil inContentWorld:WKContentWorld.pageWorld completionHandler:^(id value,NSError *error){XCTAssertNil(error,@"%@",error);result=value;[done fulfill];}];
    [self waitForExpectations:@[done] timeout:60];
    NSLog(@"MAIN_GAME_MATE_RESPONSIVENESS: %@",result);
    XCTAssertNil(result[@"error"],@"%@",result);
    XCTAssertEqualObjects(result[@"mateSeen"],@YES);
    XCTAssertEqualObjects(result[@"arrowsSeen"],@YES);
    XCTAssertEqualObjects(result[@"gameVisible"],@YES);
    for(NSString *key in @[@"mainMateCompact",@"analysisMateCompact",@"blackMainMateCompact",@"blackAnalysisMateCompact",@"noLongMateLabels"])XCTAssertEqualObjects(result[key],@YES,@"%@",key);
    XCTAssertGreaterThan([result[@"samples"] intValue],40);
    XCTAssertLessThan([result[@"maxGapMs"] doubleValue],500.0);
}

- (void)testTabletLayoutFits {
    XCTSkipUnless(UIDevice.currentDevice.userInterfaceIdiom==UIUserInterfaceIdiomPad,@"Tablet-specific layout check");
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Tablet layout loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    id result=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.stopEngineMatch();api.patch({opponent:'local',side:'w',useToolbar:true});api.load('1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 *');const frames=[];const rect=s=>document.querySelector(s).getBoundingClientRect();for(const coordinates of [true,false])for(const tab of ['game','analysis']){api.patch({coordinates});api.setTab(tab);await new Promise(r=>setTimeout(r,150));const b=rect('#board'),p=rect('.players'),panel=rect('#'+tab+'Panel'),bar=rect('.history-nav');const touch=new Event('touchmove',{bubbles:true,cancelable:true});document.getElementById(tab+'Panel').dispatchEvent(touch);frames.push({scrollAllowed:!touch.defaultPrevented,noPager:!document.querySelector('.tab-panel:not([hidden]) .fixed-page-nav:not([hidden])'),square:Math.abs(b.width-b.height)<1,large:b.width>480,boardFits:b.bottom<=p.top+1,clearance:bar.top-panel.bottom,noOverflow:document.documentElement.scrollWidth<=innerWidth});}api.patch({coordinates:true});return {frames,pass:frames.every(f=>f.scrollAllowed&&f.noPager&&f.square&&f.large&&f.boardFits&&f.clearance>=12&&f.noOverflow)};" web:web];
    NSLog(@"TABLET_LAYOUT: %@",result);
    XCTAssertEqualObjects(result[@"pass"],@YES);
}

- (void)testBundledPieceImagesLoad {
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Piece assets loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    id result=[self javascript:@"const {PIECE_SETS,pieceImage}=await import('chess://app/pieces.js');const failures=[];let count=0;for(const set of Object.keys(PIECE_SETS))for(const color of ['w','b'])for(const type of ['k','q','r','b','n','p']){const url=pieceImage(set,color,type);const img=new Image();img.src=url;try{await img.decode();if(!img.naturalWidth)failures.push(url);}catch{failures.push(url);}count++;}return {count,failures};" web:web];
    NSLog(@"PIECE_ASSET_RESULTS: %@",result);
    XCTAssertEqual([result[@"count"] intValue],216);
    XCTAssertEqual([result[@"failures"] count],0);
}

- (void)testExpandedOpeningBookAndEngineFallback {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    [host setValue:@YES forKey:@"offlineForTesting"];
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Expanded offline book loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    id result=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');const {Chess}=await import('chess://app/vendor/chess.js');const {bookMoves,ELITE_BOOK_INFO}=await import('chess://app/features.js');api.patch({opponent:'local'});api.reset();api.setTab('game');const allowed=bookMoves(new Chess()).map(m=>m.san);api.patch({engine:'stockfish19',opponent:'computer',side:'b',openingBook:true,permanentBrain:false,fixedTime:true,moveTime:1});for(let i=0;i<100&&api.state().length<1;i++)await new Promise(r=>setTimeout(r,50));const first=new Chess();first.loadPgn(api.state().pgn);const bookPlayed=first.history().length===1&&allowed.includes(first.history()[0]);api.patch({opponent:'local'});api.load('[SetUp \"1\"]\\n[FEN \"7k/8/6K1/8/8/8/8/R7 w - - 0 1\"]\\n\\n*');const outside=bookMoves(new Chess(api.state().fen)).length===0;api.patch({opponent:'computer',side:'b'});for(let i=0;i<200&&api.state().length<1;i++)await new Promise(r=>setTimeout(r,50));const fallback=api.state().length===1;api.patch({opponent:'local'});return {positions:ELITE_BOOK_INFO.positions,bookPlayed,outside,fallback};" web:web];
    NSLog(@"EXPANDED_BOOK_RESULTS: %@",result);
    XCTAssertGreaterThan([result[@"positions"] intValue],100000);
    XCTAssertEqualObjects(result[@"bookPlayed"],@YES);
    XCTAssertEqualObjects(result[@"outside"],@YES);
    XCTAssertEqualObjects(result[@"fallback"],@YES);
}

- (void)testMoveNavigationStaysAnchored {
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Navigation board loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    id result=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.reset();api.patch({opponent:'local',useToolbar:true,openingBook:true});api.setTab('game');const bar=document.querySelector('.history-nav'),menu=document.getElementById('mainToolbar');const measure=()=>({bar:bar.getBoundingClientRect().top,bottom:bar.getBoundingClientRect().bottom,menu:menu.getBoundingClientRect().top});const frames=[measure()];for(const pgn of ['1. e4','1. e4 e5','1. e4 e5 2. Nf3','1. e4 e5 2. Nf3 Nc6']){api.load(pgn);await new Promise(r=>setTimeout(r,150));frames.push(measure());}for(const showAnalysis of [false,true]){api.patch({showAnalysis});frames.push(measure());}document.getElementById('positionCount').textContent='Depth: 22 / Score: (+0.35) Positions: 123,456,789';frames.push(measure());return {stable:frames.every(f=>Math.abs(f.bar-frames[0].bar)<1&&Math.abs(f.menu-frames[0].menu)<1),gap:frames.every(f=>f.menu-f.bottom>=24),visible:frames.every(f=>f.bar>0&&f.menu<innerHeight),frames};" web:web];
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    CGFloat safeBottom=host.view.safeAreaInsets.bottom;
    CGFloat expectedBottom=CGRectGetHeight(host.view.bounds)-safeBottom+MIN(12,MAX(0,safeBottom-20));
    XCTAssertEqualWithAccuracy(CGRectGetMaxY(web.frame),expectedBottom,1);
    NSLog(@"NAVIGATION_LAYOUT: %@",result);
    XCTAssertEqualObjects(result[@"stable"],@YES);XCTAssertEqualObjects(result[@"gap"],@YES);XCTAssertEqualObjects(result[@"visible"],@YES);
}

- (void)testLegendaryGameDetailsOpenFullAnalysis {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use isolated app storage for historical game loading");
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Legendary game page loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    NSDictionary *detail=[self javascript:@"const {nativeIntegration:a}=await import('./app.js');a.stopEngineMatch();a.patch({engine:'stockfish19',opponent:'local',openingBook:false,showAnalysis:false,language:'en',threads:1,hash:32,time:1});a.load('1. d4 d5 2. c4');const previousPgn=a.state().pgn;document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.getElementById('toolbarOptions').click();document.getElementById('historicalGamesButton').click();const search=document.getElementById('historicalSearch');search.value='The Opera Game';search.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#historicalGamesList button').click();const dialog=document.getElementById('historicalGameDialog'),button=document.getElementById('historicalAnalyze'),r=button.getBoundingClientRect();return {previousPgn,title:document.getElementById('historicalGameTitle').textContent,label:button.textContent,open:dialog.open,removed:!dialog.querySelector('#historicalBoard,#historicalPosition,#historicalTimeline,#historicalSources,#historicalSourcesTitle,.historical-replay-controls'),visible:r.top>=0&&r.bottom<=innerHeight,summary:document.getElementById('historicalSummary').textContent.length>0};" web:web];
    NSLog(@"LEGENDARY_GAME_DETAILS: %@",detail);
    XCTAssertEqualObjects(detail[@"title"],@"The Opera Game");XCTAssertEqualObjects(detail[@"label"],@"Analyze this game");
    for(NSString *key in @[@"open",@"removed",@"visible",@"summary"])XCTAssertEqualObjects(detail[key],@YES,@"%@",key);
    [self captureRelease:@"Legendary-Game-Details"];
    NSDictionary *analysis=[self javascript:@"const {nativeIntegration:a}=await import('./app.js');const {HISTORICAL_GAMES}=await import('./historical-games-data.js');const entry=HISTORICAL_GAMES.find(g=>g.title==='The Opera Game');document.getElementById('historicalAnalyze').click();for(let i=0;i<200&&!a.state().lines.length;i++)await new Promise(r=>setTimeout(r,50));const start=a.state(),saved=JSON.parse(localStorage.getItem('chess-preview-v2')).saved;a.navigate(entry.expectedPlies);const end=a.state();a.navigate(0);return {tab:start.tab,cursor:start.cursor,length:start.length,expectedLength:entry.expectedPlies,engineWorking:start.lines.length>0,previousPgn:saved[0].pgn,white:start.pgn.includes('[White \"Paul Morphy\"]'),finalFen:end.fen,expectedFinalFen:entry.finalFen,detailClosed:!document.getElementById('historicalGameDialog').open};" web:web];
    NSLog(@"LEGENDARY_FULL_GAME_ANALYSIS: %@",analysis);
    XCTAssertEqualObjects(analysis[@"tab"],@"analysis");XCTAssertEqualObjects(analysis[@"cursor"],@0);
    XCTAssertEqualObjects(analysis[@"length"],analysis[@"expectedLength"]);XCTAssertEqualObjects(analysis[@"finalFen"],analysis[@"expectedFinalFen"]);
    XCTAssertEqualObjects(analysis[@"previousPgn"],detail[@"previousPgn"]);
    for(NSString *key in @[@"engineWorking",@"white",@"detailClosed"])XCTAssertEqualObjects(analysis[key],@YES,@"%@",key);
    [self captureRelease:@"Legendary-Game-Analysis"];
}
- (void)testHundredLegendaryGamesOlderAndRecentOfflineAnalysis {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use isolated app storage for historical game loading");
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Hundred-game collection ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    NSDictionary *collection=[self javascript:@"const {nativeIntegration:a}=await import('./app.js');const {HISTORICAL_GAMES:g}=await import('./historical-games-data.js');a.stopEngineMatch();a.patch({engine:'stockfish19',opponent:'local',openingBook:false,showAnalysis:false,language:'en',threads:1,hash:32,time:1});document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.getElementById('toolbarOptions').click();document.getElementById('historicalGamesButton').click();return {count:g.length,rows:document.querySelectorAll('#historicalGamesList button').length,label:document.getElementById('historicalCount').textContent,open:document.getElementById('historicalGamesDialog').open};" web:web];
    NSLog(@"HUNDRED_LEGENDARY_GAMES_COLLECTION: %@",collection);
    XCTAssertEqualObjects(collection[@"count"],@100);XCTAssertEqualObjects(collection[@"rows"],@100);
    XCTAssertTrue([collection[@"label"] containsString:@"100 games"]);XCTAssertEqualObjects(collection[@"open"],@YES);
    [self captureRelease:@"Hundred-Legendary-Games"];
    for(NSString *gameID in @[@"paulsen-morphy-1857-6",@"erigaisi-erdogmus-2026-7-7"]){
        NSString *script=[NSString stringWithFormat:@"const {nativeIntegration:a}=await import('./app.js');const {HISTORICAL_GAMES:g}=await import('./historical-games-data.js');const entry=g.find(e=>e.id==='%@');document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.getElementById('toolbarOptions').click();document.getElementById('historicalGamesButton').click();const search=document.getElementById('historicalSearch');search.value=String(entry.year);search.dispatchEvent(new Event('input',{bubbles:true}));const rows=[...document.querySelectorAll('#historicalGamesList button')];rows.find(b=>b.textContent.includes(entry.title)).click();const title=document.getElementById('historicalGameTitle').textContent;document.getElementById('historicalAnalyze').click();for(let i=0;i<200&&!a.state().lines.length;i++)await new Promise(r=>setTimeout(r,50));const start=a.state();a.navigate(entry.expectedPlies);const end=a.state();a.navigate(7);const review=a.state();return {title,expectedTitle:entry.title,tab:start.tab,cursor:start.cursor,length:start.length,expectedLength:entry.expectedPlies,engineWorking:start.lines.length>0,finalFen:end.fen,expectedFinalFen:entry.finalFen,reviewCursor:review.cursor,fullScorePreserved:review.pgn===start.pgn};",gameID];
        NSDictionary *result=[self javascript:script web:web];NSLog(@"HUNDRED_LEGENDARY_GAMES_ANALYSIS %@: %@",gameID,result);
        XCTAssertEqualObjects(result[@"title"],result[@"expectedTitle"]);XCTAssertEqualObjects(result[@"tab"],@"analysis");
        XCTAssertEqualObjects(result[@"cursor"],@0);XCTAssertEqualObjects(result[@"length"],result[@"expectedLength"]);
        XCTAssertEqualObjects(result[@"finalFen"],result[@"expectedFinalFen"]);XCTAssertEqualObjects(result[@"reviewCursor"],@7);
        XCTAssertEqualObjects(result[@"engineWorking"],@YES);XCTAssertEqualObjects(result[@"fullScorePreserved"],@YES);
    }
    [self captureRelease:@"Recent-Legendary-Game-Analysis"];
}
- (void)testLegendaryAnalysisPositionSurvivesScreenLock {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use isolated app storage for historical review recovery");
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Legendary review ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    NSNumber *length=[self javascript:@"const {nativeIntegration:a}=await import('./app.js');a.stopEngineMatch();a.patch({engine:'stockfish19',opponent:'local',openingBook:false,showAnalysis:false,language:'en',moveSound:false,moveHaptics:false,threads:1,hash:32,time:1});document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.getElementById('toolbarOptions').click();document.getElementById('historicalGamesButton').click();const search=document.getElementById('historicalSearch');search.value='The Opera Game';search.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#historicalGamesList button').click();document.getElementById('historicalAnalyze').click();return a.state().length;" web:web];
    XCTAssertEqualObjects(length,@33);
    for(NSNumber *cursor in @[@7,@6,@0,length]){
        NSString *script=[NSString stringWithFormat:@"const {nativeIntegration:a}=await import('./app.js');const cursor=%@;while(a.state().cursor<cursor)document.getElementById('analysisForward').click();while(a.state().cursor>cursor)document.getElementById('analysisBack').click();const s=a.state();return {cursor:s.cursor,length:s.length,fen:s.fen,pgn:s.pgn,tab:s.tab,clockHistory:s.clock.history};",cursor];
        NSDictionary *before=[self javascript:script web:web];
        // Navigation must be durable before any lifecycle callback is delivered.
        [self waitUntil:^BOOL{return [[self backgroundSavedGame][@"cursor"] isEqual:cursor]&&[[self backgroundSavedGame][@"tab"] isEqual:@"analysis"];}];
        [self javascript:@"window.__reloadPending=true;return true;" web:web];
        [host pauseForScreenLock];
        XCTAssertEqualObjects([self backgroundSavedGame][@"cursor"],cursor);
        XCTAssertEqualObjects([self backgroundSavedGame][@"pgn"],before[@"pgn"]);
        // Simulate the lock handler while keeping the physical test driver awake.
        UIApplication.sharedApplication.idleTimerDisabled=YES;
        [host enterForeground];
        UIApplication.sharedApplication.idleTimerDisabled=YES;
        XCTestExpectation *restored=[self expectationWithDescription:[NSString stringWithFormat:@"Legendary review restored at %@",cursor]];
        [self waitForBoard:web expectation:restored attempts:200];[self waitForExpectations:@[restored] timeout:25];
        NSDictionary *after=[self javascript:@"const {nativeIntegration:a}=await import('./app.js');for(let i=0;i<100&&a.state().cursor<a.state().length&&!a.state().lines.length;i++)await new Promise(r=>setTimeout(r,50));const s=a.state();return {cursor:s.cursor,length:s.length,fen:s.fen,pgn:s.pgn,tab:s.tab,clockHistory:s.clock.history,analysisVisible:!document.getElementById('analysisPanel').hidden,analysisSelected:document.getElementById('toolbarAnalysis').getAttribute('aria-pressed')==='true',engineWorking:s.cursor===s.length||s.lines.length>0};" web:web];
        for(NSString *key in @[@"cursor",@"length",@"fen",@"pgn",@"tab",@"clockHistory"])XCTAssertEqualObjects(after[key],before[key],@"%@ after lock at %@",key,cursor);
        XCTAssertEqualObjects(after[@"analysisVisible"],@YES);
        XCTAssertEqualObjects(after[@"analysisSelected"],@YES);
        XCTAssertEqualObjects(after[@"engineWorking"],@YES);
        NSLog(@"LEGENDARY_REVIEW_LOCK_RESTORE: cursor=%@ length=%@ fen=%@ tab=%@",after[@"cursor"],after[@"length"],after[@"fen"],after[@"tab"]);
        if([cursor isEqual:@7])[self captureRelease:@"Legendary-Review-Lock-Restored"];
    }
}
- (void)testSetupAnalysisToggleReturnsToPlayableGame {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use isolated app storage for setup and toolbar tests");
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Setup Analysis toggle ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    NSDictionary *setup=[self javascript:@"const {nativeIntegration:a}=await import('./app.js');a.stopEngineMatch();a.patch({engine:'stockfish19',opponent:'local',openingBook:false,showAnalysis:false,fixedTime:true,language:'en',moveSound:false,moveHaptics:false,threads:1,hash:32,time:1});a.setTab('game');a.reset();document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.getElementById('toolbarGame').click();document.getElementById('setupButton').click();const coordinates=document.getElementById('coordSetup').getAttribute('aria-pressed')==='true';document.querySelector('[data-setup-square=e2]').click();document.querySelector('[data-setup-square=e4]').click();document.getElementById('applySetup').click();const s=a.state();return {fen:s.fen,pgn:s.pgn,cursor:s.cursor,length:s.length,tab:s.tab,coordinates,closed:!document.getElementById('setupDialog').open};" web:web];
    XCTAssertEqualObjects(setup[@"fen"],@"rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1");
    XCTAssertEqualObjects(setup[@"tab"],@"game");XCTAssertEqualObjects(setup[@"cursor"],@0);XCTAssertEqualObjects(setup[@"length"],@0);
    XCTAssertEqualObjects(setup[@"coordinates"],@YES);XCTAssertEqualObjects(setup[@"closed"],@YES);
    NSDictionary *analysis=[self javascript:@"const {nativeIntegration:a}=await import('./app.js');document.getElementById('toolbarAnalysis').click();for(let i=0;i<160&&!a.state().lines.length;i++)await new Promise(r=>setTimeout(r,50));const s=a.state();return {fen:s.fen,pgn:s.pgn,tab:s.tab,engineWorking:s.lines.length>0,visible:!document.getElementById('analysisPanel').hidden,selected:document.getElementById('toolbarAnalysis').getAttribute('aria-pressed')==='true'};" web:web];
    XCTAssertEqualObjects(analysis[@"tab"],@"analysis");
    for(NSString *key in @[@"fen",@"pgn"])XCTAssertEqualObjects(analysis[key],setup[key]);
    for(NSString *key in @[@"engineWorking",@"visible",@"selected"])XCTAssertEqualObjects(analysis[key],@YES);
    NSDictionary *game=[self javascript:@"const {nativeIntegration:a}=await import('./app.js');document.getElementById('toolbarAnalysis').click();const s=a.state();return {fen:s.fen,pgn:s.pgn,cursor:s.cursor,length:s.length,tab:s.tab,gameVisible:!document.getElementById('gamePanel').hidden,analysisHidden:document.getElementById('analysisPanel').hidden,unselected:document.getElementById('toolbarAnalysis').getAttribute('aria-pressed')==='false',noStoppedMessage:document.getElementById('engineBadge').textContent!=='Analysis stopped',savedTab:JSON.parse(localStorage.getItem('chess-preview-v2')).tab};" web:web];
    for(NSString *key in @[@"fen",@"pgn",@"cursor",@"length",@"tab"])XCTAssertEqualObjects(game[key],setup[key]);
    for(NSString *key in @[@"gameVisible",@"analysisHidden",@"unselected",@"noStoppedMessage"])XCTAssertEqualObjects(game[key],@YES);
    XCTAssertEqualObjects(game[@"savedTab"],@"game");
    [self captureRelease:@"Setup-Analysis-Return-To-Game"];
    NSDictionary *continued=[self javascript:@"const {nativeIntegration:a}=await import('./app.js');let repeat=true;for(let i=0;i<2;i++){document.getElementById('toolbarAnalysis').click();repeat&&=a.state().tab==='analysis';document.getElementById('toolbarAnalysis').click();repeat&&=a.state().tab==='game';}document.querySelector('[data-square=d2]').click();document.querySelector('[data-square=d4]').click();const s=a.state();return {repeat,tab:s.tab,length:s.length,pawnOnD4:document.querySelector('[data-square=d4]').getAttribute('aria-label')==='d4 White pawn',blackToMove:s.fen.split(' ')[1]==='b'};" web:web];
    XCTAssertEqualObjects(continued[@"tab"],@"game");XCTAssertEqualObjects(continued[@"length"],@1);
    for(NSString *key in @[@"repeat",@"pawnOnD4",@"blackToMove"])XCTAssertEqualObjects(continued[key],@YES);
    NSLog(@"SETUP_ANALYSIS_TOGGLE: setup=%@ returned=%@ continued=%@",setup,game,continued);
}
- (void)testAboutCreditsUsesInstalledVersion {
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"About page loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    NSString *version=[NSBundle.mainBundle objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
    XCTAssertGreaterThan(version.length,0);
    NSDictionary *result=[self javascript:@"document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.getElementById('toolbarOptions').click();document.querySelector('[data-release-info=credits]').click();const body=document.getElementById('releaseInfoBody');return {version:chessNative.appVersion,title:body.querySelector('[data-app-title]').textContent,open:document.getElementById('releaseInfoDialog').open,author:body.textContent.includes('Developed by Tughan Y. Karsli')};" web:web];
    NSLog(@"ABOUT_INSTALLED_VERSION: %@",result);
    XCTAssertEqualObjects(result[@"version"],version);
    XCTAssertEqualObjects(result[@"title"],[@"Stockfish AI Chess " stringByAppendingString:version]);
    XCTAssertEqualObjects(result[@"open"],@YES);XCTAssertEqualObjects(result[@"author"],@YES);
    [self captureRelease:@"About-Installed-Version"];
    [self javascript:@"document.getElementById('releaseInfoDone').click();return true;" web:web];
}
- (void)testReleasePagesAndBoard {
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Release page loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    id result=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.reset();api.patch({theme:'honeywood',engine:'stockfish19',threads:1,hash:32});document.getElementById('toolbarOptions').click();document.querySelector('[data-release-info=privacy]').click();const policy=document.getElementById('releaseInfoBody').textContent;const open=document.getElementById('releaseInfoDialog').open;document.getElementById('releaseInfoDone').click();document.getElementById('toolbarOptions').click();document.querySelector('[data-release-info=support]').click();const support=document.getElementById('releaseInfoBody').textContent;document.getElementById('releaseInfoDone').click();document.getElementById('toolbarOptions').click();const options=document.getElementById('settingsDialog');const help=document.getElementById('helpButton');const supportButton=options.querySelector('[data-release-info=support]');const creditsButton=options.querySelector('[data-release-info=credits]');const review=options.querySelector('[data-link=review]');const helpAboveSupport=help.nextElementSibling===supportButton&&help.parentElement===supportButton.parentElement;const reviewLast=review.previousElementSibling===creditsButton&&review===review.parentElement.lastElementChild;const reviewVisible=!review.hidden&&getComputedStyle(review).display!=='none';help.click();const helpOpens=document.getElementById('helpDialog').open;document.getElementById('helpDialog').close();document.getElementById('toolbarOptions').click();const originalLinks={...api.state().settings.links};const originalOpen=window.open;let reviewURL='';api.patch({links:{...originalLinks,review:''}});try{window.open=url=>{reviewURL=String(url);return null;};review.click();}finally{window.open=originalOpen;api.patch({links:originalLinks});}const reviewLinkCorrect=reviewURL==='https://apps.apple.com/app/id6817158025?action=write-review'&&!document.getElementById('linksDialog').open;return {open,privacy:policy.includes('tughankarsli@gmail.com')&&policy.includes('Chess.com'),support:support.includes('Engine Match'),theme:document.body.dataset.theme,reviewVisible,helpAboveSupport,helpOpens,reviewLast,reviewLinkCorrect,reviewURL};" web:web];
    NSLog(@"OPTIONS_FOOTER: %@",result);
    XCTAssertEqualObjects(result[@"open"],@YES);XCTAssertEqualObjects(result[@"privacy"],@YES);XCTAssertEqualObjects(result[@"support"],@YES);XCTAssertEqualObjects(result[@"theme"],@"honeywood");for(NSString *key in @[@"reviewVisible",@"helpAboveSupport",@"helpOpens",@"reviewLast",@"reviewLinkCorrect"])XCTAssertEqualObjects(result[key],@YES,@"%@",key);
}
- (void)testCaptureReleaseScreens {
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Screenshot board loaded"];
    [self waitForBoard:web expectation:loaded attempts:600];[self waitForExpectations:@[loaded] timeout:65];
    id mapleReady=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.stopEngineMatch();const {DEFAULT_SETTINGS}=await import('chess://app/features.js');api.patch({...DEFAULT_SETTINGS,engine:'stockfish19',threads:1,hash:32});api.reset();api.setTab('game');await new Promise(r=>setTimeout(r,1500));return document.body.dataset.theme==='maple3';" web:web];
    XCTAssertEqualObjects(mapleReady,@YES);
    [self captureRelease:@"01-Offline-Chess"];
    [self javascript:@"document.getElementById('toolbarOptions').click();document.getElementById('engineMatchButton').click();return true;" web:web];
    [self captureRelease:@"02-Ten-Engines"];
    id analysisCapture=[self javascript:@"document.querySelectorAll('dialog[open]').forEach(d=>d.close());const {nativeIntegration:api}=await import('chess://app/app.js');api.patch({opponent:'local',openingBook:false,time:60});api.load('1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 *');api.setTab('analysis');await new Promise(r=>setTimeout(r,3000));for(let i=0;i<150&&(api.state().lines.length<3||api.state().nodes<10000||document.querySelectorAll('#arrows [data-from]').length<3);i++)await new Promise(r=>setTimeout(r,100));return {lines:api.state().lines.length,arrows:document.querySelectorAll('#arrows [data-from]').length,nodes:api.state().nodes,engines:globalThis.chessNative.engines.length};" web:web];
    NSLog(@"RELEASE_SCREENSHOT_ANALYSIS: %@",analysisCapture);
    XCTAssertEqual([analysisCapture[@"lines"] integerValue],3);
    XCTAssertEqual([analysisCapture[@"arrows"] integerValue],3);
    XCTAssertEqual([analysisCapture[@"engines"] integerValue],10);
    XCTAssertGreaterThan([analysisCapture[@"nodes"] integerValue],10000);
    [self captureRelease:@"03-Position-Analysis"];
    [self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.setTab('game');api.patch({openingBook:false});api.startEngineMatch({white:'stockfish19',black:'obsidian160',seconds:5});for(let i=0;i<140&&api.state().length<4;i++)await new Promise(r=>setTimeout(r,100));return true;" web:web];
    id matchCapture=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');for(let i=0;i<140&&(api.state().length<4||document.querySelectorAll('#gameInsights .move-score').length<2||api.state().nodes<10000||document.querySelector('.moving-piece'));i++)await new Promise(r=>setTimeout(r,100));return {moves:api.state().length,lines:document.querySelectorAll('#gameInsights .move-score').length,nativeLines:api.state().lines.length,nodes:api.state().nodes};" web:web];
    NSLog(@"RELEASE_SCREENSHOT_MATCH: %@",matchCapture);
    XCTAssertGreaterThanOrEqual([matchCapture[@"moves"] integerValue],4);
    XCTAssertEqual([matchCapture[@"lines"] integerValue],2);
    XCTAssertGreaterThan([matchCapture[@"nodes"] integerValue],10000);
    [self captureRelease:@"04-Engine-Match"];
    [self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.stopEngineMatch();document.getElementById('toolbarOptions').click();document.getElementById('boardButton').click();return true;" web:web];
    [self waitForBoardTextures:web];
    [self captureRelease:@"05-Board-Choices"];
    id tournamentCapture=[self javascript:@"document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.getElementById('newGame').click();document.getElementById('newEngineTournament').click();const dialog=document.getElementById('tournamentDialog'),content=dialog.querySelector('.tournament-content');for(const pane of [dialog,content])pane.scrollTop=pane.scrollHeight;await new Promise(r=>setTimeout(r,300));const start=document.getElementById('startTournament').getBoundingClientRect();return {engines:document.querySelectorAll('#tournamentEngines input').length,startVisible:start.top>=0&&start.bottom<=innerHeight,scrollTop:dialog.scrollTop};" web:web];
    NSLog(@"RELEASE_SCREENSHOT_TOURNAMENT: %@",tournamentCapture);
    XCTAssertEqual([tournamentCapture[@"engines"] integerValue],10);
    XCTAssertEqualObjects(tournamentCapture[@"startVisible"],@YES);
    [self captureRelease:@"06-Engine-Tournament"];
}
- (void)waitForBoardTextures:(WKWebView *)web {
    id loaded=[self javascript:@"await Promise.all(['assets/maple3.jpg','assets/wood.jpg','assets/walnut.jpg'].map(async src=>{const img=new Image();img.src=src;await img.decode();}));await new Promise(r=>setTimeout(r,1500));return true;" web:web];
    XCTAssertEqualObjects(loaded,@YES);
}
- (void)testCaptureBoardChoices {
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board choice screenshot loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    [self javascript:@"document.querySelectorAll('dialog[open]').forEach(d=>d.close());const {nativeIntegration:api}=await import('chess://app/app.js');api.stopEngineMatch();api.patch({theme:'honeywood',pieceSet:'classic',engine:'stockfish19',opponent:'local',side:'w',yourName:'',threads:1,hash:32});api.reset();api.setTab('game');document.getElementById('toolbarOptions').click();document.getElementById('boardButton').click();return true;" web:web];
    [self waitForBoardTextures:web];
    [self captureRelease:@"05-Board-Choices"];
}
- (void)captureRelease:(NSString *)name {
    XCTestExpectation *paint=[self expectationWithDescription:@"WebView frame painted"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,800*NSEC_PER_MSEC),dispatch_get_main_queue(),^{[paint fulfill];});
    [self waitForExpectations:@[paint] timeout:3];
    UIWindow *window=UIApplication.sharedApplication.windows.firstObject;
    UIGraphicsImageRendererFormat *format=[UIGraphicsImageRendererFormat defaultFormat];
    format.opaque=YES;
    format.preferredRange=UIGraphicsImageRendererFormatRangeStandard;
    UIGraphicsImageRenderer *renderer=[[UIGraphicsImageRenderer alloc] initWithBounds:window.bounds format:format];
    UIImage *image=[renderer imageWithActions:^(UIGraphicsImageRendererContext *context){[window drawViewHierarchyInRect:window.bounds afterScreenUpdates:YES];}];
    NSURL *folder=[[NSFileManager.defaultManager URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask].firstObject URLByAppendingPathComponent:@"ReleaseScreenshots"];
    [NSFileManager.defaultManager createDirectoryAtURL:folder withIntermediateDirectories:YES attributes:nil error:nil];
    XCTAssertTrue([UIImagePNGRepresentation(image) writeToURL:[folder URLByAppendingPathComponent:[name stringByAppendingString:@".png"]] atomically:YES]);
    XCTAttachment *a=[XCTAttachment attachmentWithImage:image];a.name=name;a.lifetime=XCTAttachmentLifetimeKeepAlways;[self addAttachment:a];
}
- (void)testObsidianStopsOnForcedSuspension {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    [self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.reset();api.patch({engine:'obsidian160',opponent:'computer',side:'b',openingBook:false,moveTime:5,fixedTime:true});api.setTab('game');for(let i=0;i<100&&!api.state().active;i++)await new Promise(r=>setTimeout(r,50));return true;" web:web];
    XCTAssertNotNil([host valueForKey:@"activeSession"]);
    [host suspend];
    XCTAssertNil([host valueForKey:@"activeSession"]);
    id state=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');await new Promise(r=>setTimeout(r,5500));return {moves:api.state().length,suspended:api.state().suspended,active:api.state().active};" web:web];
    XCTAssertEqualObjects(state[@"moves"],@0);
    XCTAssertEqualObjects(state[@"suspended"],@YES);
    XCTAssertEqualObjects(state[@"active"],@NO);
    [host resume];
    state=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');for(let i=0;i<200&&api.state().length!==1;i++)await new Promise(r=>setTimeout(r,50));await new Promise(r=>setTimeout(r,300));return {moves:api.state().length,suspended:api.state().suspended};" web:web];
    XCTAssertEqualObjects(state[@"moves"],@1);
    XCTAssertEqualObjects(state[@"suspended"],@NO);
}
- (void)testObsidianOfflineAndMatches {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    [host setValue:@YES forKey:@"offlineForTesting"];
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    XCTestExpectation *done=[self expectationWithDescription:@"Obsidian offline integration"];
    [web callAsyncJavaScript:@"const tests=await import('chess://app/ios-integration-tests.js');return await tests.obsidian();" arguments:@{} inFrame:nil inContentWorld:WKContentWorld.pageWorld completionHandler:^(id result,NSError *error){
        XCTAssertNil(error,@"%@",error);XCTAssertEqual([result count],9u);NSLog(@"OBSIDIAN_RESULTS: %@",result);[done fulfill];
    }];
    [self waitForExpectations:@[done] timeout:180];
}
- (void)testObsidianMatchRestoresPaused {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    [self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.patch({openingBook:false});api.startEngineMatch({white:'stockfish19',black:'obsidian160',seconds:1});for(let i=0;i<250&&previous<2;i++)await new Promise(r=>setTimeout(r,50));if(api.state().length<2)throw Error('Match did not start');api.persist();return true;" web:web];
    [self javascript:@"window.__reloadPending=true;return true;" web:web];
    [web reload];
    XCTestExpectation *reloaded=[self expectationWithDescription:@"Match restored"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,500*NSEC_PER_MSEC),dispatch_get_main_queue(),^{[self waitForBoard:web expectation:reloaded attempts:200];});
    [self waitForExpectations:@[reloaded] timeout:25];
    id state=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');const moves=api.state().length;await new Promise(r=>setTimeout(r,1500));const result={paused:api.state().engineMatch.paused,moves:api.state().length,unchanged:api.state().length===moves,white:api.state().engineMatch.white,black:api.state().engineMatch.black};api.stopEngineMatch();api.patch({engine:'stockfish19'});return result;" web:web];
    XCTAssertEqualObjects(state[@"paused"],@YES);XCTAssertEqualObjects(state[@"unchanged"],@YES);XCTAssertGreaterThanOrEqual([state[@"moves"] intValue],2);
    XCTAssertEqualObjects(state[@"white"],@"stockfish19");XCTAssertEqualObjects(state[@"black"],@"obsidian160");
}
- (id)javascript:(NSString *)script web:(WKWebView *)web {
    XCTestExpectation *done=[self expectationWithDescription:@"JavaScript result"];
    __block id value;
    [web callAsyncJavaScript:script arguments:@{} inFrame:nil inContentWorld:WKContentWorld.pageWorld completionHandler:^(id result,NSError *error){XCTAssertNil(error,@"%@",error);value=result;[done fulfill];}];
    [self waitForExpectations:@[done] timeout:20];return value;
}
- (void)waitUntil:(BOOL (^)(void))condition {
    XCTNSPredicateExpectation *wait=[[XCTNSPredicateExpectation alloc] initWithPredicate:[NSPredicate predicateWithBlock:^BOOL(id object,NSDictionary *bindings){return condition();}] object:nil];
    XCTAssertEqual([XCTWaiter waitForExpectations:@[wait] timeout:15],XCTWaiterResultCompleted);
}
- (void)testPawnocchioStopsOnForcedSuspension {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    [self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.reset();api.patch({engine:'pawn201',opponent:'computer',side:'b',openingBook:false,moveTime:5,fixedTime:true});api.setTab('game');for(let i=0;i<100&&!api.state().active;i++)await new Promise(r=>setTimeout(r,50));return true;" web:web];
    XCTAssertNotNil([host valueForKey:@"activeSession"]);
    [host suspend];
    XCTAssertNil([host valueForKey:@"activeSession"]);
    id state=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');await new Promise(r=>setTimeout(r,5500));return {moves:api.state().length,suspended:api.state().suspended,active:api.state().active};" web:web];
    XCTAssertEqualObjects(state[@"moves"],@0);
    XCTAssertEqualObjects(state[@"suspended"],@YES);
    XCTAssertEqualObjects(state[@"active"],@NO);
    [host resume];
    state=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');for(let i=0;i<200&&api.state().length!==1;i++)await new Promise(r=>setTimeout(r,50));await new Promise(r=>setTimeout(r,300));return {moves:api.state().length,suspended:api.state().suspended};" web:web];
    XCTAssertEqualObjects(state[@"moves"],@1);
    XCTAssertEqualObjects(state[@"suspended"],@NO);
}
- (void)testPlentyChessStopsOnForcedSuspension {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    [self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.reset();api.patch({engine:'plenty800',opponent:'computer',side:'b',openingBook:false,moveTime:5,fixedTime:true});api.setTab('game');for(let i=0;i<100&&!api.state().active;i++)await new Promise(r=>setTimeout(r,50));return true;" web:web];
    XCTAssertNotNil([host valueForKey:@"activeSession"]);
    [host suspend];
    XCTAssertNil([host valueForKey:@"activeSession"]);
    id state=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');await new Promise(r=>setTimeout(r,5500));return {moves:api.state().length,suspended:api.state().suspended,active:api.state().active};" web:web];
    XCTAssertEqualObjects(state[@"moves"],@0);
    XCTAssertEqualObjects(state[@"suspended"],@YES);
    XCTAssertEqualObjects(state[@"active"],@NO);
    [host resume];
    state=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');for(let i=0;i<200&&api.state().length!==1;i++)await new Promise(r=>setTimeout(r,50));await new Promise(r=>setTimeout(r,300));return {moves:api.state().length,suspended:api.state().suspended};" web:web];
    XCTAssertEqualObjects(state[@"moves"],@1);
    XCTAssertEqualObjects(state[@"suspended"],@NO);
}
- (void)testTimedSearchStopsOnForcedSuspension {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    [self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.reset();api.patch({engine:'reckless090',opponent:'computer',side:'b',openingBook:false,moveTime:5,fixedTime:true});api.setTab('game');for(let i=0;i<100&&!api.state().active;i++)await new Promise(r=>setTimeout(r,50));return true;" web:web];
    XCTAssertNotNil([host valueForKey:@"activeSession"]);
    [host suspend];
    XCTAssertNil([host valueForKey:@"activeSession"]);
    id state=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');await new Promise(r=>setTimeout(r,5500));return {moves:api.state().length,suspended:api.state().suspended,active:api.state().active};" web:web];
    XCTAssertEqualObjects(state[@"moves"],@0);
    XCTAssertEqualObjects(state[@"suspended"],@YES);
    XCTAssertEqualObjects(state[@"active"],@NO);
    [host resume];
    state=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');for(let i=0;i<200&&api.state().length!==1;i++)await new Promise(r=>setTimeout(r,50));await new Promise(r=>setTimeout(r,300));return {moves:api.state().length,suspended:api.state().suspended};" web:web];
    XCTAssertEqualObjects(state[@"moves"],@1);
    XCTAssertEqualObjects(state[@"suspended"],@NO);
}
- (void)waitForBoard:(WKWebView *)web expectation:(XCTestExpectation *)expectation attempts:(int)attempts {
    [web evaluateJavaScript:@"!window.__reloadPending && !!document.querySelector('#toolbarGame')" completionHandler:^(id result,NSError *error){
        if([result boolValue]){[expectation fulfill];return;}
        if(attempts<=0){XCTFail(@"Board never loaded: %@",error);[expectation fulfill];return;}
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW,100*NSEC_PER_MSEC),dispatch_get_main_queue(),^{[self waitForBoard:web expectation:expectation attempts:attempts-1];});
    }];
}
- (void)testPawnocchioOfflineAndMatches {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    [host setValue:@YES forKey:@"offlineForTesting"];
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    XCTestExpectation *done=[self expectationWithDescription:@"Pawnocchio offline integration"];
    [web callAsyncJavaScript:@"const tests=await import('chess://app/ios-integration-tests.js');return await tests.pawn();" arguments:@{} inFrame:nil inContentWorld:WKContentWorld.pageWorld completionHandler:^(id result,NSError *error){
        XCTAssertNil(error,@"%@",error);XCTAssertEqual([result count],8u);NSLog(@"PAWN_RESULTS: %@",result);[done fulfill];
    }];
    [self waitForExpectations:@[done] timeout:180];
}
- (void)testPlentyChessOfflineAndMatches {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    [host setValue:@YES forKey:@"offlineForTesting"];
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    XCTestExpectation *done=[self expectationWithDescription:@"PlentyChess offline integration"];
    [web callAsyncJavaScript:@"const tests=await import('chess://app/ios-integration-tests.js');return await tests.plenty();" arguments:@{} inFrame:nil inContentWorld:WKContentWorld.pageWorld completionHandler:^(id result,NSError *error){
        XCTAssertNil(error,@"%@",error);XCTAssertEqual([result count],7u);NSLog(@"PLENTY_RESULTS: %@",result);[done fulfill];
    }];
    [self waitForExpectations:@[done] timeout:180];
}
- (void)testRecklessOfflineAndMatches {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    [host setValue:@YES forKey:@"offlineForTesting"];
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    XCTestExpectation *done=[self expectationWithDescription:@"Reckless offline integration"];
    [web callAsyncJavaScript:@"const tests=await import('chess://app/ios-integration-tests.js');return await tests.reckless();" arguments:@{} inFrame:nil inContentWorld:WKContentWorld.pageWorld completionHandler:^(id result,NSError *error){
        XCTAssertNil(error,@"%@",error);XCTAssertEqual([result count],6u);NSLog(@"RECKLESS_RESULTS: %@",result);[done fulfill];
    }];
    [self waitForExpectations:@[done] timeout:180];
}
- (void)testEngineMatch {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    [host setValue:@YES forKey:@"offlineForTesting"];
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    XCTestExpectation *done=[self expectationWithDescription:@"Offline engine match"];
    [web callAsyncJavaScript:@"const tests=await import('chess://app/ios-integration-tests.js');return await tests.match();" arguments:@{} inFrame:nil inContentWorld:WKContentWorld.pageWorld completionHandler:^(id result,NSError *error){
        XCTAssertNil(error,@"%@",error);XCTAssertEqual([result count],6u);NSLog(@"ENGINE_MATCH_RESULTS: %@",result);[done fulfill];
    }];
    [self waitForExpectations:@[done] timeout:120];
}
- (void)testPawnocchioMatchRestoresPaused {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    [self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.patch({openingBook:false});api.startEngineMatch({white:'stockfish19',black:'pawn201',seconds:1});for(let i=0;i<250&&previous<2;i++)await new Promise(r=>setTimeout(r,50));if(api.state().length<2)throw Error('Match did not start');api.persist();return true;" web:web];
    [self javascript:@"window.__reloadPending=true;return true;" web:web];
    [web reload];
    XCTestExpectation *reloaded=[self expectationWithDescription:@"Match restored"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,500*NSEC_PER_MSEC),dispatch_get_main_queue(),^{[self waitForBoard:web expectation:reloaded attempts:200];});
    [self waitForExpectations:@[reloaded] timeout:25];
    id state=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');const moves=api.state().length;await new Promise(r=>setTimeout(r,1500));const result={paused:api.state().engineMatch.paused,moves:api.state().length,unchanged:api.state().length===moves,white:api.state().engineMatch.white,black:api.state().engineMatch.black};api.stopEngineMatch();api.patch({engine:'stockfish19'});return result;" web:web];
    XCTAssertEqualObjects(state[@"paused"],@YES);XCTAssertEqualObjects(state[@"unchanged"],@YES);XCTAssertGreaterThanOrEqual([state[@"moves"] intValue],2);
    XCTAssertEqualObjects(state[@"white"],@"stockfish19");XCTAssertEqualObjects(state[@"black"],@"pawn201");
}
- (void)testPlentyChessMatchRestoresPaused {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    [self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.patch({openingBook:false});api.startEngineMatch({white:'stockfish19',black:'plenty800',seconds:1});for(let i=0;i<250&&previous<2;i++)await new Promise(r=>setTimeout(r,50));if(api.state().length<2)throw Error('Match did not start');api.persist();return true;" web:web];
    [self javascript:@"window.__reloadPending=true;return true;" web:web];
    [web reload];
    XCTestExpectation *reloaded=[self expectationWithDescription:@"Match restored"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,500*NSEC_PER_MSEC),dispatch_get_main_queue(),^{[self waitForBoard:web expectation:reloaded attempts:200];});
    [self waitForExpectations:@[reloaded] timeout:25];
    id state=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');const moves=api.state().length;await new Promise(r=>setTimeout(r,1500));const result={paused:api.state().engineMatch.paused,moves:api.state().length,unchanged:api.state().length===moves,white:api.state().engineMatch.white,black:api.state().engineMatch.black};api.stopEngineMatch();api.patch({engine:'stockfish19'});return result;" web:web];
    XCTAssertEqualObjects(state[@"paused"],@YES);XCTAssertEqualObjects(state[@"unchanged"],@YES);XCTAssertGreaterThanOrEqual([state[@"moves"] intValue],2);
    XCTAssertEqualObjects(state[@"white"],@"stockfish19");XCTAssertEqualObjects(state[@"black"],@"plenty800");
}
- (void)testEngineMatchRestoresPaused {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    [self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.patch({openingBook:false});api.startEngineMatch({white:'stockfish19',black:'reckless090',seconds:1});for(let i=0;i<250&&previous<2;i++)await new Promise(r=>setTimeout(r,50));if(api.state().length<2)throw Error('Match did not start');api.persist();return true;" web:web];
    [self javascript:@"window.__reloadPending=true;return true;" web:web];
    [web reload];
    XCTestExpectation *reloaded=[self expectationWithDescription:@"Match restored"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,500*NSEC_PER_MSEC),dispatch_get_main_queue(),^{[self waitForBoard:web expectation:reloaded attempts:200];});
    [self waitForExpectations:@[reloaded] timeout:25];
    id state=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');const moves=api.state().length;await new Promise(r=>setTimeout(r,1500));const result={paused:api.state().engineMatch.paused,moves:api.state().length,unchanged:api.state().length===moves,white:api.state().engineMatch.white,black:api.state().engineMatch.black};api.stopEngineMatch();api.patch({engine:'stockfish19'});return result;" web:web];
    XCTAssertEqualObjects(state[@"paused"],@YES);XCTAssertEqualObjects(state[@"unchanged"],@YES);XCTAssertGreaterThanOrEqual([state[@"moves"] intValue],2);
    XCTAssertEqualObjects(state[@"white"],@"stockfish19");XCTAssertEqualObjects(state[@"black"],@"reckless090");
}
- (void)testDetectedThreadLimit {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Thread limits ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    NSUInteger maximum=MAX((NSUInteger)1,NSProcessInfo.processInfo.processorCount);
    for(NSUInteger n=1;n<=maximum;n++){NSString *command=[NSString stringWithFormat:@"setoption name Threads value %lu",(unsigned long)n];XCTAssertTrue([host validCommand:command]);}
    for(NSString *value in @[@"0",@"-1",@"1.5",@"01",@"1\nstop"])XCTAssertFalse([host validCommand:[@"setoption name Threads value " stringByAppendingString:value]]);
    NSString *excess=[NSString stringWithFormat:@"setoption name Threads value %lu",(unsigned long)maximum+1];XCTAssertFalse([host validCommand:excess]);
    id result=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');const info=await fetch('/api/engine/info').then(r=>r.json());for(let i=0;i<50&&document.getElementById('threads').disabled;i++)await new Promise(r=>setTimeout(r,50));api.stopEngineMatch();api.patch({opponent:'local',openingBook:false,threads:chessNative.maxThreads+1,time:0,showAnalysis:true});api.load('1. e4 e5');api.setTab('analysis');for(let i=0;i<200&&!api.state().lines.length;i++)await new Promise(r=>setTimeout(r,50));const result={native:chessNative.maxThreads,api:info.maxThreads,slider:Number(document.getElementById('threads').max),selected:api.state().settings.threads,searchWorks:api.state().lines.length>0,help:document.getElementById('threadsHelp').textContent};api.patch({threads:1});return result;" web:web];
    NSLog(@"DETECTED_THREADS: %@",result);
    for(NSString *key in @[@"native",@"api",@"slider",@"selected"])XCTAssertEqualObjects(result[key],@(maximum),@"%@",key);
    XCTAssertEqualObjects(result[@"searchWorks"],@YES);
}
- (void)testMainPageScoreColors {
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Score colors ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    id result=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.stopEngineMatch();api.patch({opponent:'local',openingBook:false,showAnalysis:true,time:0,threads:1,hash:32});api.load('1. e4 e5 2. Nf3 Nc6 3. Bb5 a6');api.setTab('game');for(let i=0;i<200&&(!document.querySelector('#gameInsights .move-score')||!document.querySelector('#positionCount .stat-score-value[data-score-tone=positive],#positionCount .stat-score-value[data-score-tone=negative]'));i++)await new Promise(r=>setTimeout(r,50));const elements=[document.querySelector('#positionCount .engine-stat:nth-child(2) .stat-score-value'),...document.querySelectorAll('#gameInsights .move-score')];const colors=elements.map(e=>e?{tone:e.dataset.scoreTone,color:getComputedStyle(e).color}:null);const depth=document.querySelector('#positionCount .engine-stat .stat-score-value');return {colors,depthNeutral:depth?.dataset.scoreTone==='neutral',valid:colors.length>=2&&colors.every(x=>x&&(x.tone==='positive'?x.color==='rgb(0, 131, 59)':x.tone==='negative'?x.color==='rgb(198, 40, 40)':false))};" web:web];
    NSLog(@"MAIN_SCORE_COLORS: %@",result);
    XCTAssertEqualObjects(result[@"valid"],@YES);XCTAssertEqualObjects(result[@"depthNeutral"],@YES);
}
- (void)testOptionalTablebaseDownloadAndProbe {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Tablebase download UI ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    id ui=[self javascript:@"document.getElementById('toolbarOptions').click();document.getElementById('tablebasesButton').click();await new Promise(r=>setTimeout(r,300));const s=await chessNative.tablebaseStatus();return {open:document.getElementById('tablebasesDialog').open,files:s.fileCount,bytes:s.total,running:s.running};" web:web];
    XCTAssertEqualObjects(ui[@"open"],@YES);XCTAssertEqualObjects(ui[@"files"],@220);XCTAssertEqualObjects(ui[@"bytes"],@979611840);XCTAssertEqualObjects(ui[@"running"],@NO);
    [host suspend];
    NSData *data=[NSData dataWithContentsOfURL:[NSBundle.mainBundle URLForResource:@"tablebases-5" withExtension:@"json" subdirectory:@"Web"]];
    NSDictionary *manifest=[NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    NSMutableArray *sample=[NSMutableArray array];for(NSDictionary *entry in manifest[@"files"])if([entry[@"name"] hasPrefix:@"KPPPvK."])[sample addObject:entry];
    XCTAssertEqual(sample.count,2u);
    NSURL *root=[NSURL fileURLWithPath:[NSTemporaryDirectory() stringByAppendingPathComponent:NSUUID.UUID.UUIDString] isDirectory:YES];
    ChessTablebaseDownload *store=[[(id)NSClassFromString(@"ChessTablebaseDownload") alloc] initWithFiles:sample root:root];
    [store start];[store pause];XCTAssertEqualObjects([store status][@"running"],@NO);[store start];
    XCTNSPredicateExpectation *download=[[XCTNSPredicateExpectation alloc] initWithPredicate:[NSPredicate predicateWithBlock:^BOOL(id object,NSDictionary *bindings){return ![[store status][@"running"] boolValue];}] object:nil];
    XCTAssertEqual([XCTWaiter waitForExpectations:@[download] timeout:90],XCTWaiterResultCompleted);
    NSLog(@"OPTIONAL_TABLEBASE_DOWNLOAD: %@",[store status]);XCTAssertEqualObjects([store status][@"installed"],@YES);
    NSString *path=[NSString stringWithFormat:@"%@:%@",[NSBundle.mainBundle.resourcePath stringByAppendingPathComponent:@"Tablebases"],[[root URLByAppendingPathComponent:@"FivePiece"] path]];
    for(NSString *engineID in @[@"stockfish19"]) {
        NSString *session=NSUUID.UUID.UUIDString;__block BOOL hit=NO;
        XCTestExpectation *done=[self expectationWithDescription:@"Downloaded five-piece position searched"];
        [[(id)NSClassFromString(@"SFEngine") shared] open:session engine:engineID output:^(NSString *identifier,NSString *line){if([line rangeOfString:@"tbhits [1-9][0-9]*" options:NSRegularExpressionSearch].location!=NSNotFound)hit=YES;if([line hasPrefix:@"bestmove "])[done fulfill];}];
        for(NSString *command in @[@"setoption name Threads value 1",@"setoption name Hash value 16",@"position fen 7k/8/8/8/8/8/1PPP4/K7 w - - 0 1",[@"setoption name SyzygyPath value " stringByAppendingString:path],@"go movetime 500"]) [[(id)NSClassFromString(@"SFEngine") shared] send:command session:session];
        [self waitForExpectations:@[done] timeout:30];XCTAssertTrue(hit);NSLog(@"OPTIONAL_TABLEBASE_PROBE: %@ hit=%d",engineID,hit);
        [[(id)NSClassFromString(@"SFEngine") shared] close:session];
    }
    // A wrong pinned checksum must never produce an installed set.
    NSMutableDictionary *wrong=[sample[0] mutableCopy];wrong[@"sha256"]=@"wrong";
    NSURL *badRoot=[NSURL fileURLWithPath:[NSTemporaryDirectory() stringByAppendingPathComponent:NSUUID.UUID.UUIDString] isDirectory:YES];
    ChessTablebaseDownload *bad=[[(id)NSClassFromString(@"ChessTablebaseDownload") alloc] initWithFiles:@[wrong] root:badRoot];[bad start];
    XCTNSPredicateExpectation *rejected=[[XCTNSPredicateExpectation alloc] initWithPredicate:[NSPredicate predicateWithBlock:^BOOL(id object,NSDictionary *bindings){return ![[bad status][@"running"] boolValue];}] object:nil];
    XCTAssertEqual([XCTWaiter waitForExpectations:@[rejected] timeout:90],XCTWaiterResultCompleted);XCTAssertEqualObjects([bad status][@"installed"],@NO);XCTAssertTrue([[bad status][@"message"] containsString:@"verification failed"]);
}
- (void)testThreeEngineTournamentStartsAndPersists {
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Tournament ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    id result=[self javascript:@"const tests=await import('chess://app/ios-integration-tests.js');return await tests.tournamentColors();" web:web];
    NSLog(@"THREE_ENGINE_TOURNAMENT: %@",result);
    XCTAssertGreaterThanOrEqual([result[@"moves"] intValue],2);XCTAssertEqualObjects(result[@"participants"],@3);XCTAssertEqualObjects(result[@"games"],@3);XCTAssertEqualObjects(result[@"dialog"],@NO);
    NSDictionary *storage=[NSUserDefaults.standardUserDefaults dictionaryForKey:@"ChessStorage"];
    XCTAssertNotNil(storage[@"chess-preview-tournament"]);
    for(NSString *key in @[@"balanced",@"stockfishBlack",@"playerLabels"])XCTAssertEqualObjects(result[key],@YES,@"%@",key);
    [web reload];
    XCTestExpectation *restored=[self expectationWithDescription:@"Tournament colors restored"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,500*NSEC_PER_MSEC),dispatch_get_main_queue(),^{[self waitForBoard:web expectation:restored attempts:200];});
    [self waitForExpectations:@[restored] timeout:25];
    NSDictionary *saved=[self javascript:@"const {nativeIntegration:api}=await import('./app.js');const saved=JSON.parse(localStorage.getItem('chess-preview-tournament'));const match=api.state().engineMatch;return {schedule:saved.schedule,paused:match.paused,black:match.black,playerLabels:document.getElementById('whiteName').textContent==='Clover 9.1'&&document.getElementById('blackName').textContent==='Stockfish 19'};" web:web];
    XCTAssertEqualObjects(saved[@"schedule"],result[@"schedule"]);XCTAssertEqualObjects(saved[@"paused"],@YES);XCTAssertEqualObjects(saved[@"black"],@"stockfish19");XCTAssertEqualObjects(saved[@"playerLabels"],@YES);
}

- (void)testEngineTournament {
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Tournament ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    id result=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');const $=id=>document.getElementById(id);api.stopEngineMatch();$('newEngineTournament').click();const order=$('newEngineMatch').nextElementSibling.id;const boxes=[...$('tournamentEngines').querySelectorAll('input')];boxes.forEach((b,i)=>b.checked=i<2);$('tournamentGames').value='2';$('tournamentControl').value='game';$('tournamentMinutes').value='3';$('tournamentIncrement').value='2';$('startTournament').click();const first=api.state();api.load('7k/6Q1/5K2/8/8/8/8/8 b - - 0 1');await new Promise(r=>setTimeout(r,900));let saved=JSON.parse(localStorage.getItem('chess-preview-tournament'));const scored=saved.results.length===1&&saved.results[0].result==='1-0';$('newEngineTournament').click();await new Promise(r=>setTimeout(r,4500));const paused=api.state().engineMatch.round===1;$('resumeTournament').click();const second=api.state();api.load('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');await new Promise(r=>setTimeout(r,900));saved=JSON.parse(localStorage.getItem('chess-preview-tournament'));const done=$('tournamentProgress').textContent;const table=$('tournamentStandings').textContent;$('tournamentDialog').close();api.stopEngineMatch();api.reset();return {order,scored,paused,timed:first.settings.fixedTime===false&&first.settings.increment===2,reversed:first.engineMatch.white===second.engineMatch.black&&first.engineMatch.black===second.engineMatch.white,results:saved.results.map(r=>r.result),done,table};" web:web];
    NSLog(@"TOURNAMENT: %@",result);
    XCTAssertEqualObjects(result[@"order"],@"newEngineTournament");
    for(NSString *key in @[@"scored",@"paused",@"timed",@"reversed"])XCTAssertEqualObjects(result[key],@YES);
    XCTAssertEqualObjects(result[@"results"],(@[@"1-0",@"1/2-1/2"]));
    XCTAssertTrue([result[@"done"] containsString:@"Completed"]);
}

- (void)testStockfishBenchmarkAndGameResume {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use isolated storage for benchmark preference checks");
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Benchmark ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    XCTestExpectation *done=[self expectationWithDescription:@"Benchmark score bar and game resume"];
    __block id result;
    [web callAsyncJavaScript:@"const tests=await import('chess://app/ios-integration-tests.js');return await tests.benchmarkScoreBar();" arguments:@{} inFrame:nil inContentWorld:WKContentWorld.pageWorld completionHandler:^(id value,NSError *error){XCTAssertNil(error,@"%@",error);result=value;[done fulfill];}];
    [self waitForExpectations:@[done] timeout:60];
    NSLog(@"BENCHMARK_SCORE_BAR: %@",result);
    for(NSString *key in @[@"valid",@"relativeSpeedLabel",@"twoDecimals",@"duration15Seconds",@"descriptionRemoved",@"initialZero",@"liveBarSeen",@"barFillsToScore",@"barStopped",@"allCores",@"metadata",@"unchanged",@"resetWorks",@"resumed",@"runAgainEnabled",@"runAgainVisible",@"runAgainSolidOnHover",@"runAgainTappable",@"runAgainDisabledDuringRun"])XCTAssertEqualObjects(result[key],@YES,@"%@",key);
    XCTAssertEqualObjects(result[@"threads"],@2);XCTAssertEqualObjects(result[@"hash"],@150);
}

- (void)testInvalidSetupAndSavedPositionRecovery {
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Position safety ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    id rejected=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.stopEngineMatch();api.patch({opponent:'local',showAnalysis:false});api.reset();const bad='7k/8/8/8/8/RRRRRRR1/PPPPPPPP/K7 w - - 0 1';let rejected=false;try{api.load(bad);}catch(e){rejected=true;}const saved=JSON.parse(localStorage.getItem('chess-preview-v2'));saved.pgn=bad;localStorage.setItem('chess-preview-v2',JSON.stringify(saved));await new Promise(r=>setTimeout(r,200));window.__reloadPending=true;return rejected;" web:web];
    XCTAssertEqualObjects(rejected,@YES);
    [web reload];
    XCTestExpectation *reloaded=[self expectationWithDescription:@"Invalid saved position recovered"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,500*NSEC_PER_MSEC),dispatch_get_main_queue(),^{[self waitForBoard:web expectation:reloaded attempts:200];});
    [self waitForExpectations:@[reloaded] timeout:25];
    id result=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');const recovered=api.state().fen.startsWith('rnbqkbnr/pppppppp/');const backup=!!localStorage.getItem('chess-preview-invalid-position-backup');api.patch({showAnalysis:true,time:0,threads:2,hash:150});api.setTab('analysis');for(let i=0;i<200&&!api.state().lines.length;i++)await new Promise(r=>setTimeout(r,50));return {recovered,backup,searchWorks:api.state().lines.length>0};" web:web];
    NSLog(@"POSITION_RECOVERY: %@",result);
    for(NSString *key in @[@"recovered",@"backup",@"searchWorks"])XCTAssertEqualObjects(result[key],@YES,@"%@",key);
}
- (void)testAutomaticTablebasesReplaceLegacyLimits {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use isolated app storage for preference tests");
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Automatic tablebase board"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    [self javascript:@"const {nativeIntegration:api}=await import('./app.js');api.stopEngineMatch();api.patch({engine:'stockfish19',opponent:'local',showAnalysis:false});api.load('1. e4 e5');return true;" web:web];
    for(NSNumber *limit in @[@0,@3,@4,@5]){
        NSString *seed=[NSString stringWithFormat:@"const data=JSON.parse(localStorage.getItem('chess-preview-v2'));data.settings.tablebasePieces=%@;data.tablebaseDefaultsRevision=1;localStorage.setItem('chess-preview-v2',JSON.stringify(data));return true;",limit];
        [self javascript:seed web:web];[web reload];
        XCTestExpectation *restored=[self expectationWithDescription:@"Legacy limit removed"];
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW,500*NSEC_PER_MSEC),dispatch_get_main_queue(),^{[self waitForBoard:web expectation:restored attempts:200];});
        [self waitForExpectations:@[restored] timeout:25];
        NSDictionary *result=[self javascript:@"const {nativeIntegration:api}=await import('./app.js');api.patch({openingBook:false});const data=JSON.parse(localStorage.getItem('chess-preview-v2'));return {legacyRemoved:!Object.hasOwn(api.state().settings,'tablebasePieces')&&!Object.hasOwn(data.settings,'tablebasePieces')&&!Object.hasOwn(data,'tablebaseDefaultsRevision'),selectorRemoved:!document.getElementById('tablebasePieces'),valueBlank:document.getElementById('tablebasesButtonValue').textContent.trim()==='',gamePreserved:api.state().length===2};" web:web];
        for(NSString *key in @[@"legacyRemoved",@"selectorRemoved",@"valueBlank",@"gamePreserved"])XCTAssertEqualObjects(result[key],@YES,@"%@ limit %@",key,limit);
    }
    NSLog(@"AUTOMATIC_TABLEBASES: legacy Off and 3/4/5 limits removed; saved game preserved across reloads");
}
- (void)testScanDigitalPhotoToAnalysis {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use isolated app storage for scanner tests");
    XCTSkipIf(![NSFileManager.defaultManager fileExistsAtPath:[NSBundle.mainBundle.bundlePath stringByAppendingPathComponent:@"Web/scan-fixtures/digital.png"]], @"Prepare the documented upstream scanner fixtures first");
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Scanner board loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    NSDictionary *result=[self javascript:@"const {nativeIntegration:a}=await import('./app.js');window.__scanTestBackup=localStorage.getItem('chess-preview-v2');a.stopEngineMatch();a.patch({opponent:'local',openingBook:false,showAnalysis:false,time:3,threads:1,hash:16});a.load('1. d4 d5');const before=a.state().fen;const blob=await (await fetch('./scan-fixtures/digital.png')).blob();const url=await new Promise(resolve=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.readAsDataURL(blob);});window.__scanOriginalPicker=chessNative.pickScanPhoto;chessNative.pickScanPhoto=async()=>({image:url.split(',')[1]});document.getElementById('scanButton').click();document.getElementById('scanLibrary').click();for(let i=0;i<200&&document.getElementById('scanCrop').hidden;i++)await new Promise(r=>setTimeout(r,50));document.getElementById('scanRead').click();for(let i=0;i<200&&document.getElementById('scanReview').hidden;i++)await new Promise(r=>setTimeout(r,50));if(document.getElementById('scanReview').hidden)throw Error(document.getElementById('scanError').textContent||'Scanner did not finish');document.getElementById('scanAnalyze').click();const turnRequired=a.state().fen===before&&document.getElementById('scanError').textContent.includes('Choose');return {turnRequired,review:true,pieces:document.querySelectorAll('#scanBoard img').length};" web:web];
    NSLog(@"SCAN_DIGITAL_REVIEW: %@",result);
    XCTAssertEqualObjects(result[@"turnRequired"],@YES);XCTAssertEqualObjects(result[@"review"],@YES);XCTAssertEqualObjects(result[@"pieces"],@32);
    [self javascript:@"document.getElementById('scanDialog').scrollTop=0;return true;" web:web];
    [self captureRelease:@"Scan-Digital-Review"];
    result=[self javascript:@"const {nativeIntegration:a}=await import('./app.js');document.getElementById('scanTurn').value='w';document.getElementById('scanAnalyze').click();for(let i=0;i<100&&!a.state().lines.length;i++)await new Promise(r=>setTimeout(r,50));const saved=JSON.parse(localStorage.getItem('chess-preview-v2')).saved;return {fen:a.state().fen,analysis:a.state().tab==='analysis',search:a.state().lines.length>0,closed:!document.getElementById('scanDialog').open,saved:!!saved.find(g=>g.pgn.includes('d4'))};" web:web];
    NSLog(@"SCAN_DIGITAL_ANALYSIS: %@",result);
    XCTAssertEqualObjects(result[@"fen"],@"r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w - - 0 1");
    for(NSString *key in @[@"analysis",@"search",@"closed",@"saved"])XCTAssertEqualObjects(result[key],@YES,@"%@",key);
    [self captureRelease:@"Scan-Position-Analysis"];
    [self javascript:@"chessNative.pickScanPhoto=window.__scanOriginalPicker;localStorage.setItem('chess-preview-v2',window.__scanTestBackup);return true;" web:web];[web reload];
    XCTestExpectation *restored=[self expectationWithDescription:@"Scanner test state restored"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,500*NSEC_PER_MSEC),dispatch_get_main_queue(),^{[self waitForBoard:web expectation:restored attempts:200];});
    [self waitForExpectations:@[restored] timeout:25];
}
- (void)testScanPhysicalPhotoRecognition {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use isolated app storage for scanner tests");
    XCTSkipIf(![NSFileManager.defaultManager fileExistsAtPath:[NSBundle.mainBundle.bundlePath stringByAppendingPathComponent:@"Web/scan-fixtures/physical.jpg"]], @"Prepare the documented upstream scanner fixtures first");
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Physical scanner board loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    XCTestExpectation *done=[self expectationWithDescription:@"Real photo recognized on iPhone"];
    [web callAsyncJavaScript:@"const {nativeIntegration:a}=await import('./app.js');window.__scanTestBackup=localStorage.getItem('chess-preview-v2');a.stopEngineMatch();a.patch({opponent:'local',showAnalysis:false,threads:1,hash:16});const blob=await (await fetch('./scan-fixtures/physical.jpg')).blob();const url=await new Promise(resolve=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.readAsDataURL(blob);});window.__scanOriginalPicker=chessNative.pickScanPhoto;chessNative.pickScanPhoto=async()=>({image:url.split(',')[1],corners:[[319/1200,154/900],[885/1200,155/900],[1030/1200,729/900],[181/1200,727/900]]});document.getElementById('scanButton').click();document.getElementById('scanKind').value='physical';document.getElementById('scanLibrary').click();for(let i=0;i<200&&document.getElementById('scanCrop').hidden;i++)await new Promise(r=>setTimeout(r,50));document.getElementById('scanRead').click();for(let i=0;i<1500&&document.getElementById('scanReview').hidden&&!document.getElementById('scanError').textContent;i++)await new Promise(r=>setTimeout(r,50));if(document.getElementById('scanReview').hidden)throw Error(document.getElementById('scanError').textContent||'Physical recognition timed out');return {pieces:document.querySelectorAll('#scanBoard img').length,review:true};" arguments:@{} inFrame:nil inContentWorld:WKContentWorld.pageWorld completionHandler:^(id result,NSError *error){
        XCTAssertNil(error,@"%@",error);NSLog(@"SCAN_PHYSICAL_REVIEW: %@",result);XCTAssertEqualObjects(result[@"pieces"],@32);XCTAssertEqualObjects(result[@"review"],@YES);[done fulfill];
    }];[self waitForExpectations:@[done] timeout:90];
    [self javascript:@"document.getElementById('scanDialog').scrollTop=0;return true;" web:web];
    [self captureRelease:@"Scan-Physical-Review"];
    NSDictionary *result=[self javascript:@"const {nativeIntegration:a}=await import('./app.js');document.getElementById('scanRotate').click();document.getElementById('scanTurn').value='b';document.getElementById('scanAnalyze').click();return {fen:a.state().fen,analysis:a.state().tab==='analysis',error:document.getElementById('scanError').textContent};" web:web];
    NSLog(@"SCAN_PHYSICAL_ANALYSIS: %@",result);
    XCTAssertEqualObjects(result[@"fen"],@"rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b - - 0 1");XCTAssertEqualObjects(result[@"analysis"],@YES);
    [self javascript:@"chessNative.pickScanPhoto=window.__scanOriginalPicker;document.querySelectorAll('dialog[open]').forEach(d=>d.close());localStorage.setItem('chess-preview-v2',window.__scanTestBackup);return true;" web:web];[web reload];
    XCTestExpectation *restored=[self expectationWithDescription:@"Scanner test state restored"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,500*NSEC_PER_MSEC),dispatch_get_main_queue(),^{[self waitForBoard:web expectation:restored attempts:200];});
    [self waitForExpectations:@[restored] timeout:25];
}
- (void)testUpdatedResourceDefaults {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use isolated app storage for preference tests");
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Resource defaults ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    for(NSString *value in @[@"0",@"3",@"4",@"5",@"7",@"03",@"3\nstop"])XCTAssertFalse([host validCommand:[@"setoption name SyzygyProbeLimit value " stringByAppendingString:value]]);
    id result=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');\nconst {DEFAULT_SETTINGS}=await import('chess://app/features.js');\napi.stopEngineMatch();const originalSettings=api.state().settings;\nconst transport=chessNative.Transport.prototype,send=transport.postMessage,commands=[];\ntransport.postMessage=function(command){commands.push(command);return send.call(this,command);};\ntry{\n api.patch({...DEFAULT_SETTINGS});api.load('1. e4 e5');api.setTab('analysis');\n const text=id=>document.getElementById(id).textContent;\n const toggles={coordinates:true,legalHints:false,lastMove:true,optionArrows:true,sound:false,haptics:false,showAnalysis:true,figurine:true,openingBook:true,wdl:true};\n const defaultsVisible=Object.entries(toggles).every(([id,value])=>document.getElementById(id).checked===value)&&text('modeButtonValue')==='White · 10s'&&text('difficultyButtonValue')==='Level 19 · Full Strength'&&text('boardButtonValue')==='Maple'&&text('piecesButtonValue')==='Classic'&&text('timeButtonValue')==='Forever'&&text('languageButtonValue')==='System'&&document.getElementById('activeEngine').value==='stockfish19'&&text('bookVarietyButtonValue')==='Medium';\n document.getElementById('tablebasesButton').click();const dialog=document.getElementById('tablebasesDialog');\n const selectorRemoved=!document.getElementById('tablebasePieces')&&!dialog.querySelector('select')&&!dialog.textContent.includes('Use up to')&&!Object.hasOwn(DEFAULT_SETTINGS,'tablebasePieces')&&text('tablebasesButtonValue').trim()==='';\n const includedAndOptionalVisible=dialog.textContent.includes('3–4 pieces · Included')&&dialog.textContent.includes('5 pieces · Optional download')&&!!document.getElementById('tablebasesDownload');\n document.getElementById('tablebasesBack').click();document.getElementById('settingsDialog').close();\n api.patch({opponent:'local',openingBook:false});api.setTab('game');const probes=[];\n for(const fen of ['7k/8/8/8/8/8/8/KQ6 w - - 0 1','7k/7r/8/8/8/8/8/KQ6 w - - 0 1']){\n  api.load('[SetUp \"1\"]\\n[FEN \"'+fen+'\"]\\n\\n*');\n  for(let i=0;i<200&&!document.querySelector('#positionCount .tablebase-indicator');i++)await new Promise(r=>setTimeout(r,50));\n  probes.push(!!document.querySelector('#positionCount .tablebase-indicator'));\n }\n return {threads:api.state().settings.threads,hash:api.state().settings.hash,searchWorks:api.state().lines.length>0,hashLabel:text('hashButton'),defaultsVisible,selectorRemoved,includedAndOptionalVisible,noUserLimitCommands:!commands.some(command=>command.startsWith('setoption name SyzygyProbeLimit')),threePieceProbeWorks:probes[0],fourPieceProbeWorks:probes[1]};\n}finally{transport.postMessage=send;api.patch(originalSettings);}\n" web:web];
    NSLog(@"RESOURCE_DEFAULTS_AUTOMATIC_TABLEBASES: %@",result);
    XCTAssertEqualObjects(result[@"threads"],@2);XCTAssertEqualObjects(result[@"hash"],@150);XCTAssertTrue([result[@"hashLabel"] containsString:@"150"]);
    for(NSString *key in @[@"searchWorks",@"defaultsVisible",@"selectorRemoved",@"includedAndOptionalVisible",@"noUserLimitCommands",@"threePieceProbeWorks",@"fourPieceProbeWorks"])XCTAssertEqualObjects(result[key],@YES,@"%@",key);
}
- (void)testMainScreenShowsLiveSpeed {
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Speed display ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    id result=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.stopEngineMatch();api.patch({opponent:'local',openingBook:false,showAnalysis:true,analysisArrows:true,time:0,threads:1,hash:32});api.load('1. e4 e5');api.setTab('game');for(let i=0;i<200&&!document.getElementById('positionCount').textContent.includes('kN/s');i++)await new Promise(r=>setTimeout(r,50));for(let i=0;i<200&&document.querySelectorAll('#gameInsights .move-score').length<2;i++)await new Promise(r=>setTimeout(r,50));const mainEvaluationCount=document.querySelectorAll('#gameInsights .move-score').length;const mainArrowCount=document.querySelectorAll('#arrows g[data-rank]').length;const mainTwoLines=mainEvaluationCount===2&&mainArrowCount===2;const counter=document.getElementById('positionCount');const stats=[...counter.querySelectorAll('.engine-stat')];const rects=stats.map(e=>e.getBoundingClientRect());const mainVisible=!counter.hidden;const text=counter.textContent;const order=stats.length===4&&stats[2].textContent.startsWith('Speed ')&&stats[0].textContent.startsWith('Depth ')&&stats[3].textContent.startsWith('Positions ');const rows=rects.length===4&&Math.abs(rects[0].top-rects[1].top)<2&&rects[2].top>rects[0].top&&rects[3].top>rects[2].top;const mainBadgeStyle=getComputedStyle(stats[0]);const mainBadgeAppearance={radius:mainBadgeStyle.borderRadius,border:mainBadgeStyle.borderTopColor,background:mainBadgeStyle.backgroundColor};api.setTab('analysis');for(let i=0;i<200&&!document.getElementById('engineDepth').textContent.includes('kN/s');i++)await new Promise(r=>setTimeout(r,50));for(let i=0;i<200&&document.querySelectorAll('#analysisLines .analysis-line').length<3;i++)await new Promise(r=>setTimeout(r,50));const analysisEvaluationCount=document.querySelectorAll('#analysisLines .analysis-line').length;const analysisArrowCount=document.querySelectorAll('#arrows g[data-rank]').length;const analysisThreeLines=analysisEvaluationCount===3&&analysisArrowCount===3;const analysisCounter=document.getElementById('engineDepth');const badges=[...analysisCounter.querySelectorAll('.engine-stat-badge')];const analysisOrder=badges.length===3&&badges[0].textContent.startsWith('Depth ')&&badges[1].textContent.startsWith('Speed ')&&badges[2].textContent.startsWith('Positions ');const matchingBadges=badges.length===3&&badges.every(badge=>{const style=getComputedStyle(badge);return style.borderRadius===mainBadgeAppearance.radius&&style.borderTopColor===mainBadgeAppearance.border&&style.backgroundColor===mainBadgeAppearance.background;});const analysisSpeed=analysisCounter.textContent.includes('kN/s');const analysisHidden=counter.hidden;const analysisText=analysisCounter.textContent;api.setTab('game');const returnedMainNeverThree=document.querySelectorAll('#gameInsights .move-score').length<=2&&document.querySelectorAll('#arrows g[data-rank]').length<=2;for(let i=0;i<200&&document.querySelectorAll('#gameInsights .move-score').length<2;i++)await new Promise(r=>setTimeout(r,50));const returnedMainTwo=document.querySelectorAll('#gameInsights .move-score').length===2&&document.querySelectorAll('#arrows g[data-rank]').length===2;return {mainTwoLines,analysisThreeLines,returnedMainTwo,returnedMainNeverThree,mainEvaluationCount,mainArrowCount,analysisEvaluationCount,analysisArrowCount,mainVisible,text,order,rows,analysisHidden,analysisOrder,matchingBadges,analysisSpeed,analysisText};" web:web];
    NSLog(@"MAIN_SPEED: %@",result);
    for(NSString *key in @[@"mainTwoLines",@"analysisThreeLines",@"returnedMainTwo",@"returnedMainNeverThree",@"mainVisible",@"order",@"rows",@"analysisHidden",@"analysisOrder",@"matchingBadges",@"analysisSpeed"])XCTAssertEqualObjects(result[key],@YES,@"%@",key);
    XCTAssertTrue([result[@"text"] containsString:@"kN/s"]);
}
- (void)testCheckmateKingStarsAndConfettiForEitherWinner {
    // Keep the established selector while exercising the current shared display policy.
    [self testGameEndAnimationAssets];
}
- (void)testAnalysisMoveArrowsNavigateWithoutScrolling {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use the isolated CoreScaling app for move-history tests");
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Analysis arrows ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    XCTestExpectation *done=[self expectationWithDescription:@"Analysis arrows preserve history and fixed layout"];
    __block NSDictionary *result;
    [web callAsyncJavaScript:@"const tests=await import('chess://app/ios-integration-tests.js');return await tests.analysisMoveArrows();" arguments:@{} inFrame:nil inContentWorld:WKContentWorld.pageWorld completionHandler:^(id value,NSError *error){XCTAssertNil(error,@"%@",error);result=value;[done fulfill];}];
    [self waitForExpectations:@[done] timeout:45];
    NSLog(@"ANALYSIS_MOVE_ARROWS: %@",result);
    XCTAssertNotNil(result);
    if(!result)return;
    for(NSString *key in @[@"emptyBothDisabled",@"emptyClicksDoNothing",@"realWdlAboveArrows",@"arrowsAboveToolbar",@"tapAreas",@"accessibleLabels",@"boundaries",@"stepsCorrect",@"fullHistoryPreserved",@"fixedDuringSteps",@"hiddenWdlAnchored",@"toolbarSettingsFit",@"onlyAnalysisVisible",@"activeMatchPaused",@"matchHistoryPreserved",@"forwardReturnsToLatest",@"latestDoesNotResume"])XCTAssertEqualObjects(result[key],@YES,@"%@",key);
    XCTAssertEqualObjects(result[@"reviewedPlies"],@6);XCTAssertGreaterThanOrEqual([result[@"matchPlies"] integerValue],2);
}
- (void)testHumanWhiteAnalysisRowsStayAboveToolbar {
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Analysis layout ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    id result=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.stopEngineMatch();api.patch({opponent:'computer',side:'w',openingBook:false,showAnalysis:true,analysisArrows:true,time:0,threads:1,hash:32});api.load('1. e4');api.setTab('analysis');for(let i=0;i<200&&document.querySelectorAll('#analysisLines .analysis-line').length<3;i++)await new Promise(r=>setTimeout(r,50));for(let i=0;i<200&&!document.getElementById('engineDepth').textContent.includes('kN/s');i++)await new Promise(r=>setTimeout(r,50));await new Promise(r=>setTimeout(r,200));const header=document.querySelector('.app>header');const boardFrame=document.querySelector('.app>.board-frame');const headerHidden=getComputedStyle(header).display==='none'&&header.getBoundingClientRect().height===0&&Math.abs(boardFrame.getBoundingClientRect().top-document.querySelector('.app').getBoundingClientRect().top)<1;const panelHeightWithoutHeader=document.getElementById('analysisPanel').getBoundingClientRect().height;header.style.display='flex';const formerHeaderHeight=header.getBoundingClientRect().height;const panelHeightWithHeader=document.getElementById('analysisPanel').getBoundingClientRect().height;header.style.removeProperty('display');const reclaimedHeight=panelHeightWithoutHeader-panelHeightWithHeader;const headerSpaceReclaimed=formerHeaderHeight>=40&&Math.abs(reclaimedHeight-formerHeaderHeight)<1;const rows=[...document.querySelectorAll('#analysisLines .analysis-line')];const arrows=[...document.querySelectorAll('#arrows g[data-rank]')];const matchingArrows=rows.every(row=>arrows.some(arrow=>arrow.dataset.rank===row.dataset.rank&&arrow.dataset.from+arrow.dataset.to===row.dataset.move.slice(0,4)));const baseMessageFont=parseFloat(getComputedStyle(document.getElementById('analysisMessage')).fontSize);const thirdArrow=arrows.find(arrow=>arrow.dataset.rank==='3');const redThirdArrow=thirdArrow?.getAttribute('fill')==='#d32f2f'&&Number(thirdArrow.getAttribute('opacity'))>=0.85;const nav=document.querySelector('.app>.main-toolbar').getBoundingClientRect();const panel=document.getElementById('analysisPanel').getBoundingClientRect();const single=rows.every(row=>{const moves=row.querySelector('.line-continuation');const score=row.querySelector('.line-evaluation');return getComputedStyle(moves).whiteSpace==='nowrap'&&Math.abs(moves.getBoundingClientRect().top-score.getBoundingClientRect().top)<8&&row.getBoundingClientRect().height<=56;});const clear=rows.every(row=>row.getBoundingClientRect().bottom<=nav.top);const wdl=document.getElementById('wdlSummary').getBoundingClientRect();const wdlBottom=wdl.top>=rows.at(-1).getBoundingClientRect().bottom&&wdl.bottom<=nav.top&&nav.top-wdl.bottom<=72+reclaimedHeight;const historyHidden=getComputedStyle(document.querySelector('.history-nav')).display==='none'&&getComputedStyle(document.getElementById('positionLabel')).display==='none';const panelElement=document.getElementById('analysisPanel');const overflowProbe=document.createElement('div');overflowProbe.style.height='1000px';overflowProbe.style.flexShrink='0';panelElement.append(overflowProbe);await new Promise(r=>setTimeout(r,100));const noPager=!panelElement.querySelector('.fixed-page-nav:not([hidden])')&&!panelElement.classList.contains('has-fixed-pages');const touch=new Event('touchmove',{bubbles:true,cancelable:true});panelElement.dispatchEvent(touch);panelElement.scrollTop=100;const analysisFixed=touch.defaultPrevented&&getComputedStyle(panelElement).overflowY==='clip'&&panelElement.scrollTop===0;overflowProbe.remove();api.patch({opponent:'local'});api.load('1. e4 e5 2. Nf3 Nc6');api.setTab('game');const gameProbe=document.createElement('div');gameProbe.style.height='1000px';gameProbe.style.flexShrink='0';document.getElementById('gamePanel').append(gameProbe);const noVisibleBars=()=>[...document.querySelectorAll('.fixed-page-nav,.history-nav')].every(bar=>bar.getClientRects().length===0||getComputedStyle(bar).display==='none');const mainImmediatelyHidden=noVisibleBars();await new Promise(r=>setTimeout(r,200));const gamePanel=document.getElementById('gamePanel');const gameOverflow={clientHeight:gamePanel.clientHeight,scrollHeight:gamePanel.scrollHeight,visibility:document.visibilityState};const gamePagerAbsent=!gamePanel.querySelector('.fixed-page-nav')&&!gamePanel.classList.contains('has-fixed-pages');const gameTouch=new Event('touchmove',{bubbles:true,cancelable:true});gamePanel.dispatchEvent(gameTouch);gamePanel.scrollTop=100;const mainScrollAllowed=!gameTouch.defaultPrevented&&getComputedStyle(gamePanel).overflowY==='auto'&&gamePanel.scrollTop>0;gamePanel.scrollTop=0;const mainPagerHidden=mainImmediatelyHidden&&noVisibleBars()&&gamePagerAbsent;api.setTab('analysis');const switchImmediatelyHidden=noVisibleBars();const reviewFrames=[];for(const [id,cursor] of [['takeBack',3],['takeBack',2],['stepForward',3],['startOfGame',0],['endOfGame',4]]){document.getElementById('toolbarMove').click();document.getElementById(id).click();const immediate=noVisibleBars();await new Promise(r=>setTimeout(r,150));const state=api.state();const reviewTouch=new Event('touchmove',{bubbles:true,cancelable:true});panelElement.dispatchEvent(reviewTouch);panelElement.scrollTop=100;const fixed=reviewTouch.defaultPrevented&&panelElement.scrollTop===0&&Math.abs(document.querySelector('.main-toolbar').getBoundingClientRect().top-nav.top)<1;reviewFrames.push({action:id,cursor:state.cursor,fixed,pass:state.tab==='analysis'&&state.cursor===cursor&&immediate&&noVisibleBars()&&fixed});}let tabSwitchesHidden=true;for(let i=0;i<2;i++){api.setTab('game');tabSwitchesHidden&&=noVisibleBars();await new Promise(r=>setTimeout(r,100));tabSwitchesHidden&&=noVisibleBars();api.setTab('analysis');tabSwitchesHidden&&=noVisibleBars();await new Promise(r=>setTimeout(r,100));tabSwitchesHidden&&=noVisibleBars();}const reviewPagerHidden=mainPagerHidden&&switchImmediatelyHidden&&reviewFrames.every(frame=>frame.pass)&&tabSwitchesHidden;gameProbe.remove();api.setTab('game');const mainHidden=getComputedStyle(document.querySelector('.history-nav')).display==='none'&&getComputedStyle(document.getElementById('positionLabel')).display==='none';const mateResults=[];api.setTab('analysis');for(const [pgn,winner] of [['1. f3 e5 2. g4 Qh4#','Black'],['1. e4 e5 2. Bc4 Nc6 3. Qh5 Nf6 4. Qxf7#','White']]){api.load(pgn);await new Promise(r=>setTimeout(r,100));const message=document.getElementById('analysisMessage');const font=parseFloat(getComputedStyle(message).fontSize);const rect=message.getBoundingClientRect();const raisedCenter=rect.top+rect.height/2;message.classList.remove('checkmate-result');const originalRect=message.getBoundingClientRect();const raised=originalRect.top+originalRect.height/2-raisedCenter>=19;message.classList.add('checkmate-result');mateResults.push({winnerCorrect:message.textContent==='Checkmate — '+winner+' wins',upperHidden:document.getElementById('status').textContent==='',visible:!message.hidden,font20:font>=20,raised});}api.reset();api.setTab('game');const mateDisplay=mateResults.length===2&&mateResults.every(r=>r.winnerCorrect&&r.upperHidden&&r.visible&&r.font20&&r.raised);document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.getElementById('toolbarGame').click();document.getElementById('menuNew').click();const newGameAccessible=document.getElementById('newDialog').open;document.querySelectorAll('dialog[open]').forEach(d=>d.close());return {headerHidden,headerSpaceReclaimed,reclaimedHeight,newGameAccessible,rows:rows.length,arrows:arrows.length,matchingArrows,redThirdArrow,noPager,analysisFixed,reviewPagerHidden,reviewFrames,mainPagerHidden,mainScrollAllowed,gamePagerAbsent,gameOverflow,mateDisplay,mateResults,single,clear,panelClear:panel.bottom<=nav.top+1,historyHidden,mainHidden,wdlBottom};" web:web];
    NSLog(@"HUMAN_ANALYSIS_LAYOUT: %@",result);
    XCTAssertEqualObjects(result[@"rows"],@3);
    XCTAssertEqualObjects(result[@"arrows"],@3);
    XCTAssertEqualObjects(result[@"matchingArrows"],@YES);
    for(NSString *key in @[@"headerHidden",@"headerSpaceReclaimed",@"newGameAccessible",@"mainPagerHidden",@"mainScrollAllowed",@"redThirdArrow",@"noPager",@"analysisFixed",@"reviewPagerHidden",@"mateDisplay",@"single",@"clear",@"panelClear",@"historyHidden",@"mainHidden",@"wdlBottom"])XCTAssertEqualObjects(result[key],@YES,@"%@",key);
}
- (void)testEngineMatchBookMovesUseFixedDelay {
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Book match ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    id result=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');const {bookMoves}=await import('chess://app/features.js');const {Chess}=await import('chess://app/vendor/chess.js');api.stopEngineMatch();api.patch({opponent:'local',openingBook:true,showAnalysis:true,analysisArrows:true,bookVariety:'low'});const noVisibleBars=()=>[...document.querySelectorAll('.fixed-page-nav,.history-nav')].every(bar=>bar.getClientRects().length===0||getComputedStyle(bar).display==='none');api.load('1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3 d5 6. Nf3 dxc4');const bookFrames=[];for(const tab of ['game','analysis']){api.setTab(tab);const immediate=noVisibleBars();await new Promise(r=>setTimeout(r,200));bookFrames.push({tab,pass:immediate&&noVisibleBars(),bookVisible:tab!=='game'||document.querySelector('#gameInsights>strong')?.textContent==='Book',opening:document.querySelector('#gameInsights .opening-name')?.textContent||''});}const screenshotBookPagerHidden=bookFrames.every(frame=>frame.pass&&frame.bookVisible);let liveBookPagerHidden=true;api.startEngineMatch({white:'stockfish19',black:'clover91',seconds:30});api.setTab('analysis');const initialArrows=document.querySelectorAll('#arrows [data-from]').length;await new Promise(r=>setTimeout(r,100));const startsBeforeBudget=api.state().length===0;const noEngineSearch=!api.state().active;let previous=0;let lastMove=performance.now()-100;const intervals=[];let legalBookMoves=true;let synced=true;let animationArrows=0;let arrowsSeen=0;for(let i=0;i<250&&previous<2;i++){liveBookPagerHidden&&=noVisibleBars();const s=api.state();if(previous===1&&s.tab==='analysis'&&!document.querySelector('.moving-piece')){api.setTab('game');liveBookPagerHidden&&=noVisibleBars();}const board=new Chess(s.fen);const arrows=[...document.querySelectorAll('#arrows [data-from]')];if(arrows.length)arrowsSeen++;for(const arrow of arrows)if(board.get(arrow.dataset.from)?.color!==board.turn())synced=false;if(document.querySelector('.moving-piece')&&arrows.length)animationArrows++;if(s.length>previous){intervals.push(performance.now()-lastMove);lastMove=performance.now();const history=new Chess();history.loadPgn(s.pgn);const move=history.history({verbose:true}).at(-1);legalBookMoves&&=bookMoves(new Chess(move.before)).some(b=>b.uci===move.from+move.to+(move.promotion||''));previous=s.length;}await new Promise(r=>setTimeout(r,50));}const moves=api.state().length;api.pauseEngineMatch();const paused=moves;await new Promise(r=>setTimeout(r,3300));const pauseRespected=api.state().length===paused;api.stopEngineMatch();return {screenshotBookPagerHidden,liveBookPagerHidden,bookFrames,moves,initialArrows,startsBeforeBudget,noEngineSearch,legalBookMoves,synced,animationArrows,arrowsSeen,pauseRespected,firstInterval:intervals[0],secondInterval:intervals[1]};" web:web];
    NSLog(@"BOOK_MATCH_RESULT: %@",result);
    XCTAssertEqualObjects(result[@"moves"],@2);XCTAssertEqualObjects(result[@"initialArrows"],@2);
    for(NSString *key in @[@"screenshotBookPagerHidden",@"liveBookPagerHidden",@"startsBeforeBudget",@"noEngineSearch",@"legalBookMoves",@"synced",@"pauseRespected"])XCTAssertEqualObjects(result[key],@YES,@"%@",key);
    XCTAssertEqualObjects(result[@"animationArrows"],@0);XCTAssertGreaterThan([result[@"arrowsSeen"] intValue],0);XCTAssertGreaterThanOrEqual([result[@"firstInterval"] doubleValue],1450.0);XCTAssertLessThan([result[@"firstInterval"] doubleValue],2500.0);XCTAssertGreaterThanOrEqual([result[@"secondInterval"] doubleValue],2100.0);XCTAssertLessThan([result[@"secondInterval"] doubleValue],3500.0);
}
- (void)testEngineMatchContinuesInAnalysis {
    WKWebView *web=[UIApplication.sharedApplication.windows.firstObject.rootViewController valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Match analysis ready"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    id result=[self javascript:@"const {nativeIntegration:api}=await import('chess://app/app.js');api.stopEngineMatch();api.patch({openingBook:false,showAnalysis:true,threads:1,hash:32});api.startEngineMatch({white:'stockfish19',black:'plenty800',seconds:3});for(let i=0;i<200&&!api.state().active;i++)await new Promise(r=>setTimeout(r,50));const id=api.state().searchId;document.getElementById('toolbarAnalysis').click();const same=api.state().searchId===id&&!api.state().engineMatch.paused;let linesSeen=false;let secondSeen=false;let secondOverflow=0;const wdlTops=[];const engines=new Set();const start=api.state().length;const started=performance.now();let wrongTurnArrows=0;for(let i=0;i<500&&api.state().length<start+4;i++){const s=api.state();const {Chess}=await import('chess://app/vendor/chess.js');const board=new Chess(s.fen);for(const arrow of document.querySelectorAll('#arrows [data-from]')){if(board.get(arrow.dataset.from)?.color!==board.turn())wrongTurnArrows++;}wdlTops.push(document.getElementById('wdlSummary').getBoundingClientRect().top);const second=document.querySelector('#analysisLines .analysis-line:nth-child(2)');if(second){secondSeen=true;const panel=document.getElementById('analysisPanel');const pageNav=panel.querySelector('.fixed-page-nav:not([hidden])');const limit=pageNav?pageNav.getBoundingClientRect().top:panel.getBoundingClientRect().bottom;secondOverflow=Math.max(secondOverflow,second.getBoundingClientRect().bottom-limit);}if(s.lines.length){linesSeen=true;engines.add(s.engineIdentity);}await new Promise(r=>setTimeout(r,50));}const s=api.state();const clockAdvanced=s.clock.moveClock.elapsed.w>0&&s.clock.moveClock.elapsed.b>0;const analysisVisible=!document.getElementById('analysisPanel').hidden;const currentId=s.searchId;document.getElementById('toolbarAnalysis').click();const returned=api.state().tab==='game'&&!api.state().engineMatch.paused&&api.state().searchId===currentId;api.pauseEngineMatch();api.setTab('analysis');const pausedMoves=api.state().length;await new Promise(r=>setTimeout(r,1200));const pauseRespected=api.state().engineMatch.paused&&api.state().length===pausedMoves;api.stopEngineMatch();api.patch({engine:'stockfish19'});return {elapsed:performance.now()-started,wrongTurnArrows,secondSeen,secondOverflow,wdlShift:Math.max(...wdlTops)-Math.min(...wdlTops),same,moves:s.length-start,linesSeen,engineCount:engines.size,clockAdvanced,analysisVisible,returned,pauseRespected};" web:web];
    NSLog(@"MATCH_ANALYSIS_RESULT: %@",result);
    XCTAssertEqualObjects(result[@"wrongTurnArrows"],@0);XCTAssertGreaterThan([result[@"elapsed"] doubleValue],9000.0);
    XCTAssertLessThanOrEqual([result[@"wdlShift"] doubleValue],1.0);
    XCTAssertEqualObjects(result[@"secondSeen"],@YES);XCTAssertLessThanOrEqual([result[@"secondOverflow"] doubleValue],1.0);
    for(NSString *key in @[@"same",@"linesSeen",@"clockAdvanced",@"analysisVisible",@"returned",@"pauseRespected"])XCTAssertEqualObjects(result[key],@YES,@"%@",key);
    XCTAssertGreaterThanOrEqual([result[@"moves"] intValue],4);XCTAssertEqualObjects(result[@"engineCount"],@2);
}
- (void)testEngineVersionsAndSwitching {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    [host setValue:@YES forKey:@"offlineForTesting"];
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    XCTestExpectation *done=[self expectationWithDescription:@"Both offline engines"];
    [web callAsyncJavaScript:@"const tests=await import('chess://app/ios-integration-tests.js');return await tests.engines();" arguments:@{} inFrame:nil inContentWorld:WKContentWorld.pageWorld completionHandler:^(id result,NSError *error){
        XCTAssertNil(error,@"%@",error);XCTAssertEqual([result count],5u);NSLog(@"ENGINE_VERSION_RESULTS: %@",result);[done fulfill];
    }];
    [self waitForExpectations:@[done] timeout:120];
}
- (void)testOfflineWebViewAndNativeStockfish {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    WKWebView *web=[host valueForKey:@"webView"];
    XCTAssertNotNil(web);
    [host setValue:@YES forKey:@"offlineForTesting"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Bundled board loaded"];
    [self waitForBoard:web expectation:loaded attempts:200];
    [self waitForExpectations:@[loaded] timeout:25];
    XCTestExpectation *finished=[self expectationWithDescription:@"Offline engine and interface integration"];
    NSString *script=@"const tests=await import('chess://app/ios-integration-tests.js');window.__nativeTestPromise=tests.run();return await window.__nativeTestPromise;";
    [web callAsyncJavaScript:script arguments:@{} inFrame:nil inContentWorld:WKContentWorld.pageWorld completionHandler:^(id result,NSError *error){
        XCTAssertNil(error,@"%@",error);
        XCTAssertTrue([result isKindOfClass:NSArray.class],@"%@",result);
        NSLog(@"IOS_INTEGRATION_RESULTS: %@",result);
        [finished fulfill];
    }];
    [self waitForExpectations:@[finished] timeout:100];
}
- (void)testWebServiceImportsAndDurableStorage {
    UIViewController *host=UIApplication.sharedApplication.windows.firstObject.rootViewController;
    [host setValue:@NO forKey:@"offlineForTesting"];
    WKWebView *web=[host valueForKey:@"webView"];
    XCTestExpectation *loaded=[self expectationWithDescription:@"Board ready for network checks"];
    [self waitForBoard:web expectation:loaded attempts:200];[self waitForExpectations:@[loaded] timeout:25];
    XCTestExpectation *checked=[self expectationWithDescription:@"Real HTTPS imports"];
    NSString *script=@"const tests=await import('chess://app/ios-integration-tests.js');window.__nativeNetworkPromise=tests.network();return await window.__nativeNetworkPromise;";
    [web callAsyncJavaScript:script arguments:@{} inFrame:nil inContentWorld:WKContentWorld.pageWorld completionHandler:^(id result,NSError *error){
        XCTAssertNil(error,@"%@",error);NSLog(@"IOS_NETWORK_RESULTS: %@",result);[checked fulfill];
    }];[self waitForExpectations:@[checked] timeout:90];
    XCTestExpectation *saved=[self expectationWithDescription:@"Native preferences written"];
    [web evaluateJavaScript:@"localStorage.setItem('chess-preview-test','restart-proof')" completionHandler:^(id result,NSError *error){[saved fulfill];}];
    [self waitForExpectations:@[saved] timeout:5];
    [self javascript:@"window.__reloadPending=true;return true;" web:web];
    [web reload];
    XCTestExpectation *reloaded=[self expectationWithDescription:@"WebView recovered"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,500*NSEC_PER_MSEC),dispatch_get_main_queue(),^{[self waitForBoard:web expectation:reloaded attempts:200];});
    [self waitForExpectations:@[reloaded] timeout:25];
    XCTestExpectation *restored=[self expectationWithDescription:@"Native storage survived WebView restart"];
    [web evaluateJavaScript:@"localStorage.getItem('chess-preview-test')" completionHandler:^(id result,NSError *error){XCTAssertEqualObjects(result,@"restart-proof");[restored fulfill];}];
    [self waitForExpectations:@[restored] timeout:5];
}

@end
