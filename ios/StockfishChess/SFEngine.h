#import <Foundation/Foundation.h>
NS_ASSUME_NONNULL_BEGIN
@interface SFEngine : NSObject
+ (instancetype)shared;
- (void)open:(NSString *)session engine:(NSString *)engineID output:(void (^)(NSString *, NSString *))output;
- (void)send:(NSString *)command session:(NSString *)session;
- (void)close:(NSString *)session;
- (void)suspend;
- (void)stop:(NSString *)session completion:(void (^)(void))completion;
@end
NS_ASSUME_NONNULL_END
