#import <Foundation/Foundation.h>
static NSURL *ChessTablebaseRoot(void) {
    NSURL *support=[NSFileManager.defaultManager URLsForDirectory:NSApplicationSupportDirectory inDomains:NSUserDomainMask].firstObject;
    return [support URLByAppendingPathComponent:@"Syzygy" isDirectory:YES];
}
static NSString *ChessTablebaseSearchPath(void) {
    NSString *bundled=[NSBundle.mainBundle.resourcePath stringByAppendingPathComponent:@"Tablebases"];
    NSURL *extra=[ChessTablebaseRoot() URLByAppendingPathComponent:@"FivePiece" isDirectory:YES];
    if([NSFileManager.defaultManager fileExistsAtPath:[[extra URLByAppendingPathComponent:@"complete"] path]])return [bundled stringByAppendingFormat:@":%@",extra.path];
    return bundled;
}
