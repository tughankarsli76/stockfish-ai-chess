#import <XCTest/XCTest.h>
@interface UITests : XCTestCase
@end
@implementation UITests
- (void)testLegendaryAnalysisArrowDoubleTapDoesNotZoom {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use isolated CoreScaling storage for historical-game replay");
    self.continueAfterFailure=NO;
    XCUIDevice.sharedDevice.orientation=UIDeviceOrientationPortrait;
    XCUIApplication *app=[XCUIApplication new];[app launch];
    XCUIElement *options=app.webViews.buttons[@"Options"];
    XCTAssertTrue([options waitForExistenceWithTimeout:25]);[options tap];
    XCUIElement *library=[app.webViews.buttons matchingPredicate:[NSPredicate predicateWithFormat:@"label BEGINSWITH %@",@"Classical & Legendary Games"]].firstMatch;
    for(int i=0;i<6&&!library.hittable;i++)[app.webViews.firstMatch swipeUp];
    if(!library.hittable)NSLog(@"LEGENDARY_ARROW_LIBRARY_SETUP: %@",app.debugDescription);
    XCTAssertTrue(library.hittable);[library tap];
    XCUIElement *game=[app.webViews.buttons matchingPredicate:[NSPredicate predicateWithFormat:@"label CONTAINS %@",@"Scachs d'amor"]].firstMatch;
    BOOL gameFound=[game waitForExistenceWithTimeout:5];
    if(!gameFound)NSLog(@"LEGENDARY_ARROW_GAME_SETUP: %@",app.debugDescription);
    XCTAssertTrue(gameFound);[game tap];
    XCUIElement *last=app.webViews.buttons[@"Final position"];
    XCTAssertTrue([last waitForExistenceWithTimeout:5]);[last tap];
    XCUIElement *analyze=app.webViews.buttons[@"Analyze This Position"];
    for(int i=0;i<4&&!analyze.hittable;i++)[app.webViews.firstMatch swipeUp];
    // A thin visible edge can count as hittable while the button's center is clipped.
    // Move the whole control into the viewport before synthesizing the tap.
    if(analyze.hittable)[app.webViews.firstMatch swipeUp];
    BOOL (^analyzeFullyVisible)(void)=^BOOL{
        CGRect viewport=app.webViews.firstMatch.frame,button=analyze.frame;
        return analyze.hittable&&CGRectGetHeight(button)>=44&&CGRectGetMinY(button)>=CGRectGetMinY(viewport)+90&&CGRectGetMaxY(button)<=CGRectGetMaxY(viewport)-16;
    };
    for(int i=0;i<3&&!analyzeFullyVisible();i++)[app.webViews.firstMatch swipeUp];
    if(!analyze.hittable)NSLog(@"LEGENDARY_ARROW_ANALYZE_SETUP: %@",app.debugDescription);
    if(!analyzeFullyVisible()){[self shot:@"Legendary Analyze button clipped during setup"];NSLog(@"LEGENDARY_ARROW_ANALYZE_CLIPPED: button=%@ viewport=%@ %@",NSStringFromCGRect(analyze.frame),NSStringFromCGRect(app.webViews.firstMatch.frame),app.debugDescription);}
    XCTAssertTrue(analyzeFullyVisible());[analyze tap];
    BOOL modalClosed=[analyze waitForNonExistenceWithTimeout:10];
    XCTNSPredicateExpectation *analysisVisible=[[XCTNSPredicateExpectation alloc] initWithPredicate:[NSPredicate predicateWithFormat:@"hittable == YES"] object:options];
    XCTWaiterResult shown=[XCTWaiter waitForExpectations:@[analysisVisible] timeout:5];
    if(!modalClosed||shown!=XCTWaiterResultCompleted){[self shot:@"Legendary modal did not enter Analysis"];NSLog(@"LEGENDARY_ARROW_MODAL_PERSISTED: %@",app.debugDescription);}
    XCTAssertTrue(modalClosed,@"Historical Analyze button remained visible; the replay modal did not close");
    XCTAssertEqual(shown,XCTWaiterResultCompleted,@"Analysis toolbar did not become hittable");
    XCUIElement *next=app.webViews.buttons[@"Next move"],*previous=app.webViews.buttons[@"Previous move"];
    XCTAssertTrue([next waitForExistenceWithTimeout:10]);XCTAssertTrue(previous.exists);
    XCTAssertFalse(next.enabled);XCTAssertTrue(previous.enabled);

    // Accessibility frames measure the actual rendered page, including a WebKit zoom.
    // The square names stay constant even when the enabled arrow advances a move.
    NSDictionary *(^frames)(void)=^{
        NSMutableDictionary *result=[NSMutableDictionary dictionary];
        NSPredicate *squareNames=[NSPredicate predicateWithFormat:@"label MATCHES '^[a-h][1-8] .+'"];
        XCUIElementQuery *squares=[[app.webViews descendantsMatchingType:XCUIElementTypeAny] matchingPredicate:squareNames];
        result[@"squareCount"]=@(squares.count);
        XCUIElementQuery *corners=[squares matchingPredicate:[NSPredicate predicateWithFormat:@"label MATCHES '^(a8|h8|a1|h1) .+'"]];
        for(XCUIElement *square in corners.allElementsBoundByIndex){
            result[[square.label substringToIndex:2]]=NSStringFromCGRect(square.frame);
        }
        for(NSString *label in @[@"Previous move",@"Next move",@"Options",@"Move"]){
            XCUIElement *button=app.webViews.buttons[label];
            result[label]=button.exists?NSStringFromCGRect(button.frame):@"missing";
        }
        return [result copy];
    };
    void (^doubleTapAndCheck)(XCUIElement *,NSString *)=^(XCUIElement *button,NSString *phase){
        [self shot:[@"Before " stringByAppendingString:phase]];
        NSDictionary *before=frames();XCTAssertEqualObjects(before[@"squareCount"],@64);
        for(NSString *square in @[@"a8",@"h8",@"a1",@"h1"])XCTAssertNotNil(before[square],@"%@ missing corner %@",phase,square);
        CGRect target=button.frame;CGPoint origin=app.frame.origin;
        XCUICoordinate *point=[[app coordinateWithNormalizedOffset:CGVectorMake(0,0)] coordinateWithOffset:CGVectorMake(CGRectGetMidX(target)-origin.x,CGRectGetMidY(target)-origin.y)];
        NSLog(@"LEGENDARY_ARROW_DOUBLE_TAP %@ enabled=%d target=%@ screenPoint=%@ before=%@",phase,button.enabled,NSStringFromCGRect(target),NSStringFromCGPoint(point.screenPoint),before);
        // Coordinate events reach disabled buttons too; element doubleTap requires hittability.
        [point doubleTap];
        [self shot:[@"After " stringByAppendingString:phase]];
        NSDictionary *after=frames();
        NSLog(@"LEGENDARY_ARROW_DOUBLE_TAP %@ after=%@",phase,after);
        XCTAssertEqualObjects(after[@"squareCount"],@64,@"%@ hid board squares after double-tap",phase);
        for(NSString *key in before){
            if([key isEqual:@"squareCount"])continue;
            XCTAssertNotNil(after[key],@"%@ lost %@",phase,key);
            XCTAssertNotEqualObjects(after[key],@"missing",@"%@ hid %@",phase,key);
            CGRect a=CGRectFromString(before[key]),b=CGRectFromString(after[key]);
            XCTAssertEqualWithAccuracy(b.origin.x,a.origin.x,1,@"%@ zoomed or shifted %@ horizontally",phase,key);
            XCTAssertEqualWithAccuracy(b.origin.y,a.origin.y,1,@"%@ zoomed or shifted %@ vertically",phase,key);
            XCTAssertEqualWithAccuracy(b.size.width,a.size.width,1,@"%@ zoomed %@ width",phase,key);
            XCTAssertEqualWithAccuracy(b.size.height,a.size.height,1,@"%@ zoomed %@ height",phase,key);
        }
    };
    doubleTapAndCheck(next,@"disabled Next at the final legendary move");
    XCTAssertFalse(next.enabled);
    [previous tap];
    XCTAssertTrue(next.enabled);
    doubleTapAndCheck(next,@"Next becoming disabled on the second tap");
    XCTAssertFalse(next.enabled);
    [app.webViews.buttons[@"Move"] tap];
    XCUIElement *start=app.webViews.buttons[@"Start of Game"];
    XCTAssertTrue([start waitForExistenceWithTimeout:5]);[start tap];
    XCTAssertFalse(previous.enabled);XCTAssertTrue(next.enabled);
    doubleTapAndCheck(previous,@"disabled Previous at the starting position");
    XCTAssertFalse(previous.enabled);
}
- (void)testEngineMatchContinuesAfterActualHome {
    XCTSkipIf(![NSBundle.mainBundle.bundleIdentifier containsString:@".corebench."], @"Use isolated app storage for background matches");
    self.continueAfterFailure=NO;
    XCUIApplication *app=[XCUIApplication new];[app launch];
    XCTAssertTrue([app.webViews.buttons[@"Options"] waitForExistenceWithTimeout:25]);
    [app.webViews.buttons[@"Options"] tap];
    XCUIElement *book=app.webViews.switches[@"Use Opening Book"];
    for(int i=0;i<4&&!book.hittable;i++)[app.webViews.firstMatch swipeUp];
    XCTAssertTrue(book.exists);if([book.value isEqual:@"1"])[book tap];
    [app.webViews.buttons[@"Done"] tap];
    XCTAssertTrue([app.webViews.buttons[@"Game"] waitForExistenceWithTimeout:25]);
    [app.webViews.buttons[@"Game"] tap];[app.webViews.buttons[@"New Game"] tap];
    [app.webViews.buttons[@"Engine Match"] tap];
    XCUIElement *seconds=[[app.webViews descendantsMatchingType:XCUIElementTypeAny] matchingPredicate:[NSPredicate predicateWithFormat:@"label == 'Match seconds per move'"]].firstMatch;
    XCTAssertTrue([seconds waitForExistenceWithTimeout:5]);
    if(![seconds.value isEqual:@"1"]){
        [seconds tap];XCUIElement *wheel=app.pickerWheels.firstMatch;
        if([wheel waitForExistenceWithTimeout:1]){
            [wheel adjustToPickerWheelValue:@"1"];[app.toolbars.buttons[@"Done"] tap];
        }else {
            XCUIElement *one=[[app descendantsMatchingType:XCUIElementTypeAny] matchingPredicate:[NSPredicate predicateWithFormat:@"label == '1'"]].firstMatch;
            if(![one waitForExistenceWithTimeout:3])NSLog(@"MATCH_TIME_SELECT: %@",app.debugDescription);
            XCTAssertTrue(one.exists);[one tap];
        }
    }
    XCTAssertEqualObjects(seconds.value,@"1");
    [app.webViews.buttons[@"Start Match"] tap];
    // Allow the foreground-started continued-processing request to be granted.
    XCTestExpectation *started=[self expectationWithDescription:@"Match started"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,2*NSEC_PER_SEC),dispatch_get_main_queue(),^{[started fulfill];});
    [self waitForExpectations:@[started] timeout:5];
    [XCUIDevice.sharedDevice pressButton:XCUIDeviceButtonHome];
    XCTestExpectation *background=[self expectationWithDescription:@"Actual OS background beyond finite UIKit time"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,65*NSEC_PER_SEC),dispatch_get_main_queue(),^{[background fulfill];});
    [self waitForExpectations:@[background] timeout:70];
    XCTAssertEqual(app.state,XCUIApplicationStateRunningBackground);
    [app activate];
    XCTAssertTrue([app.webViews.buttons[@"Move"] waitForExistenceWithTimeout:20]);
    [app.webViews.buttons[@"Move"] tap];[app.webViews.buttons[@"Move List"] tap];
    NSUInteger plies=[app.webViews.buttons matchingPredicate:[NSPredicate predicateWithFormat:@"label MATCHES '^[0-9]+[.…] .+'"]].count;
    // Engine startup and switching also consume time between the timed searches.
    XCTAssertGreaterThanOrEqual(plies,24u,@"One-second match did not keep advancing while the app was truly in the background");
    NSLog(@"ACTUAL_HOME_MATCH: 65 seconds background, %lu legal recorded plies",(unsigned long)plies);
    [app.webViews.buttons[@"Done"] tap];[app.webViews.buttons[@"Game"] tap];
    if(app.webViews.buttons[@"Stop Match"].exists)[app.webViews.buttons[@"Stop Match"] tap];
}
- (void)testSearchSurvivesHomeAndReturn {
    self.continueAfterFailure=NO;
    XCUIApplication *app=[XCUIApplication new];[app launch];
    XCTAssertTrue([app.webViews.buttons[@"Options"] waitForExistenceWithTimeout:25]);
    XCUIElement *analysis=app.webViews.switches[@"Analysis"];
    if(![analysis.value isEqual:@"1"])[analysis tap];
    [XCUIDevice.sharedDevice pressButton:XCUIDeviceButtonHome];
    XCTestExpectation *background=[self expectationWithDescription:@"Background interval"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,3*NSEC_PER_SEC),dispatch_get_main_queue(),^{[background fulfill];});
    [self waitForExpectations:@[background] timeout:5];
    [app activate];
    XCTAssertTrue([app.webViews.buttons[@"Options"] waitForExistenceWithTimeout:15]);
    XCTAssertEqualObjects(analysis.value,@"1");
    [self shot:@"Background search returned to analysis"];
}
- (void)testTabletPortraitAndLandscape {
    self.continueAfterFailure=NO;
    XCUIDevice.sharedDevice.orientation=UIDeviceOrientationPortrait;
    XCUIApplication *app=[XCUIApplication new];[app launch];
    // The UI runner may use a phone idiom even when the tested app is on iPad.
    XCTSkipUnless(CGRectGetWidth(app.frame)>=700,@"Tablet-specific rotation check");
    XCUIElement *options=app.webViews.buttons[@"Options"];
    XCTAssertTrue([options waitForExistenceWithTimeout:25]);
    XCTAssertTrue(options.hittable);
    XCUIElement *a8=[app.webViews.switches matchingPredicate:[NSPredicate predicateWithFormat:@"label BEGINSWITH 'a8 '"]].firstMatch;
    XCUIElement *h1=[app.webViews.switches matchingPredicate:[NSPredicate predicateWithFormat:@"label BEGINSWITH 'h1 '"]].firstMatch;
    XCTAssertGreaterThan(CGRectGetWidth(a8.frame)*8,CGRectGetWidth(app.frame)*0.65);
    XCTAssertLessThan(CGRectGetMaxY(h1.frame),CGRectGetMinY(options.frame));
    [self shot:@"Tablet portrait"];
    XCUIDevice.sharedDevice.orientation=UIDeviceOrientationLandscapeLeft;
    XCTAssertTrue(options.hittable);
    XCTAssertLessThan(CGRectGetMaxX(h1.frame),CGRectGetWidth(app.frame)*0.7);
    XCTAssertLessThan(CGRectGetMaxY(h1.frame),CGRectGetMinY(options.frame));
    XCUIElement *analysis=app.webViews.switches[@"Analysis"];
    if(![analysis.value isEqual:@"1"])[analysis tap];
    XCTNSPredicateExpectation *active=[[XCTNSPredicateExpectation alloc] initWithPredicate:[NSPredicate predicateWithFormat:@"value == '1'"] object:analysis];
    [self waitForExpectations:@[active] timeout:5];
    [self shot:@"Tablet landscape analysis"];
    [options tap];
    XCTAssertTrue([app.webViews.buttons[@"Done"] waitForExistenceWithTimeout:5]);
    [app.webViews.buttons[@"Done"] tap];
    XCUIDevice.sharedDevice.orientation=UIDeviceOrientationPortrait;
    XCTAssertTrue(options.hittable);
    XCTAssertFalse(app.webViews.buttons[@"Next"].exists);
    XCTAssertFalse(app.webViews.buttons[@"Previous"].exists);
    [self shot:@"Tablet portrait analysis after rotation"];
    XCUICoordinate *start=[app coordinateWithNormalizedOffset:CGVectorMake(0.5,0.81)];
    XCUICoordinate *end=[app coordinateWithNormalizedOffset:CGVectorMake(0.5,0.70)];
    [start pressForDuration:0.05 thenDragToCoordinate:end];
    XCTAssertTrue(options.hittable);
    [self shot:@"Tablet analysis scrolled"];
}
- (void)testFixedMainAndScrollingOptions {
    XCUIDevice.sharedDevice.orientation=UIDeviceOrientationPortrait;
    XCUIApplication *app=[XCUIApplication new];[app launch];
    XCUIElement *options=app.webViews.buttons[@"Options"];
    XCTAssertTrue([options waitForExistenceWithTimeout:25]);
    CGRect original=options.frame;
    [app.webViews.firstMatch swipeUp];
    XCTAssertEqualWithAccuracy(options.frame.origin.y,original.origin.y,1);
    [options tap];
    XCTAssertTrue([app.webViews.buttons[@"Done"] waitForExistenceWithTimeout:5]);
    XCTAssertFalse(app.webViews.buttons[@"Next"].exists);
    XCTAssertFalse(app.webViews.buttons[@"Previous"].exists);
    XCUIElement *lastOption=app.webViews.buttons[@"About & Credits"];
    for(int i=0;i<5&&!lastOption.hittable;i++)[app.webViews.firstMatch swipeUp];
    XCTAssertTrue(lastOption.hittable);
    [self shot:@"Options scrolled to last setting"];
    [app.webViews.buttons[@"Done"] tap];
    XCTAssertEqualWithAccuracy(options.frame.origin.y,original.origin.y,1);
}
- (void)shot:(NSString *)name {
    XCTestExpectation *paint=[self expectationWithDescription:@"UI screenshot painted"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW,800*NSEC_PER_MSEC),dispatch_get_main_queue(),^{[paint fulfill];});
    [self waitForExpectations:@[paint] timeout:3];
    XCTAttachment *attachment=[XCTAttachment attachmentWithScreenshot:XCUIScreen.mainScreen.screenshot];attachment.name=name;attachment.lifetime=XCTAttachmentLifetimeKeepAlways;[self addAttachment:attachment];
}
- (void)testDesignNativeDialogsAndBackground {
    self.continueAfterFailure=NO;
    XCUIDevice.sharedDevice.orientation=UIDeviceOrientationPortrait;
    XCUIApplication *app=[XCUIApplication new];[app launch];
    XCUIElement *options=app.webViews.buttons[@"Options"];
    XCTAssertTrue([options waitForExistenceWithTimeout:25]);[self shot:@"Portrait board"];
    [options tap];XCTAssertTrue([app.webViews.buttons[@"Done"] waitForExistenceWithTimeout:5]);[self shot:@"Original options"];
    [app.webViews.buttons[@"Done"] tap];
    [app.webViews.buttons[@"Game"] tap];[app.webViews.buttons[@"Export Game"] tap];[app.webViews.buttons[@"Export File"] tap];
    XCTAssertTrue([app.cells[@"Save to Files"] waitForExistenceWithTimeout:8]);[self shot:@"Native PGN share sheet"];
    [app.otherElements[@"PopoverDismissRegion"] tap];
    [app.webViews.buttons[@"Game"] tap];[app.webViews.buttons[@"Import Game"] tap];[app.webViews.buttons[@"Email? Finder? Safari?"] tap];[app.webViews.buttons[@"Choose File"] tap];
    XCTAssertTrue([app.navigationBars.buttons[@"Cancel"] waitForExistenceWithTimeout:20]);[self shot:@"Native document picker"];
    [app.navigationBars.buttons[@"Cancel"] tap];
    [app.webViews.buttons[@"Cancel"] tap];
    XCUIDevice.sharedDevice.orientation=UIDeviceOrientationLandscapeLeft;
    XCTAssertTrue([app.webViews.buttons[@"Options"] waitForExistenceWithTimeout:20]);[self shot:@"Landscape board"];
    XCUIDevice.sharedDevice.orientation=UIDeviceOrientationPortrait;
    [app.webViews.switches[@"Analysis"] tap];
    [XCUIDevice.sharedDevice pressButton:XCUIDeviceButtonHome];
    [app activate];
    XCTAssertTrue([app.webViews.buttons[@"Options"] waitForExistenceWithTimeout:10]);[self shot:@"Resumed analysis"];
    [app terminate];[app launch];
    XCTAssertTrue([app.webViews.buttons[@"Options"] waitForExistenceWithTimeout:20]);[self shot:@"Cold relaunch"];
}
@end
