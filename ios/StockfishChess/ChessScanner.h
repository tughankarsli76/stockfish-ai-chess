#import <UIKit/UIKit.h>
@interface ChessScanner : NSObject
- (void)pick:(NSString *)source presenter:(UIViewController *)presenter reply:(void (^)(id,NSString *))reply;
- (void)recognize:(NSDictionary *)request reply:(void (^)(id,NSString *))reply;
@end
