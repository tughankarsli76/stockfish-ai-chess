#import <Foundation/Foundation.h>
#import <CommonCrypto/CommonDigest.h>
#import "TablebasePaths.h"

static BOOL ChessVerifyTablebase(NSURL *url,NSDictionary *entry) {
    NSDictionary *attrs=[NSFileManager.defaultManager attributesOfItemAtPath:url.path error:nil];
    if([attrs[NSFileSize] unsignedLongLongValue]!=[entry[@"bytes"] unsignedLongLongValue])return NO;
    NSInputStream *stream=[NSInputStream inputStreamWithURL:url];[stream open];
    CC_SHA256_CTX context;CC_SHA256_Init(&context);uint8_t buffer[65536];NSInteger count;
    while((count=[stream read:buffer maxLength:sizeof(buffer)])>0)CC_SHA256_Update(&context,buffer,(CC_LONG)count);
    [stream close];if(count<0)return NO;
    unsigned char digest[CC_SHA256_DIGEST_LENGTH];CC_SHA256_Final(digest,&context);
    NSMutableString *hex=[NSMutableString string];for(int i=0;i<CC_SHA256_DIGEST_LENGTH;i++)[hex appendFormat:@"%02x",digest[i]];
    return [hex isEqualToString:entry[@"sha256"]];
}
@interface ChessTablebaseDownload : NSObject <NSURLSessionDownloadDelegate>
@property(nonatomic,strong) NSArray<NSDictionary *> *files;
@property(nonatomic,strong) NSURL *root;
@property(nonatomic,strong) NSURLSession *session;
@property(nonatomic,strong) NSURLSessionDownloadTask *task;
@property(nonatomic) NSUInteger index,generation;
@property(nonatomic) unsigned long long total,received;
@property(nonatomic) BOOL running;
@property(nonatomic,copy) NSString *message;
+ (instancetype)shared;
- (NSDictionary *)status;
- (void)start;
- (void)pause;
- (instancetype)initWithFiles:(NSArray *)files root:(NSURL *)root;
@end
@implementation ChessTablebaseDownload
+ (instancetype)shared {static ChessTablebaseDownload *store;static dispatch_once_t once;dispatch_once(&once,^{
    NSData *data=[NSData dataWithContentsOfURL:[NSBundle.mainBundle URLForResource:@"tablebases-5" withExtension:@"json" subdirectory:@"Web"]];
    NSDictionary *manifest=data?[NSJSONSerialization JSONObjectWithData:data options:0 error:nil]:nil;
    store=[[self alloc] initWithFiles:manifest[@"files"]?:@[] root:ChessTablebaseRoot()];
});return store;}
- (instancetype)initWithFiles:(NSArray *)files root:(NSURL *)root {if((self=[super init])){self.files=files;self.root=root;for(NSDictionary *entry in files)self.total+=[entry[@"bytes"] unsignedLongLongValue];self.message=@"Not downloaded";}return self;}
- (NSURL *)staging {return [self.root URLByAppendingPathComponent:@"FivePiece.partial" isDirectory:YES];}
- (NSURL *)installed {return [self.root URLByAppendingPathComponent:@"FivePiece" isDirectory:YES];}
- (BOOL)isInstalled {return [NSFileManager.defaultManager fileExistsAtPath:[[self.installed URLByAppendingPathComponent:@"complete"] path]];}
- (NSDictionary *)status {
    unsigned long long complete=0;NSUInteger count=0;NSURL *folder=self.isInstalled?self.installed:self.staging;
    for(NSDictionary *entry in self.files){NSDictionary *a=[NSFileManager.defaultManager attributesOfItemAtPath:[[folder URLByAppendingPathComponent:entry[@"name"]] path] error:nil];if(a && [a[NSFileSize] unsignedLongLongValue]==[entry[@"bytes"] unsignedLongLongValue]){complete+=[entry[@"bytes"] unsignedLongLongValue];count++;}}
    return @{@"installed":@(self.isInstalled),@"running":@(self.running),@"bytes":@(MIN(self.total,complete+self.received)),@"total":@(self.total),@"files":@(count),@"fileCount":@(self.files.count),@"message":self.isInstalled?@"Installed — available offline":self.message};
}
- (void)fail:(NSString *)message {self.message=message;self.running=NO;self.received=0;[self.task cancel];self.task=nil;[self.session invalidateAndCancel];self.session=nil;self.generation++;}
- (void)pause {if(self.running)[self fail:@"Paused — completed files are saved. Tap Resume Download."];}
- (void)start {
    if(self.running||self.isInstalled)return;
    if(!self.files.count){[self fail:@"Download manifest is unavailable."];return;}
    NSError *error=nil;[NSFileManager.defaultManager createDirectoryAtURL:self.staging withIntermediateDirectories:YES attributes:nil error:&error];
    if(error){[self fail:error.localizedDescription];return;}
    for(NSURL *file in [NSFileManager.defaultManager contentsOfDirectoryAtURL:self.staging includingPropertiesForKeys:nil options:0 error:nil])if([file.pathExtension isEqualToString:@"download"])[NSFileManager.defaultManager removeItemAtURL:file error:nil];
    [self.root setResourceValue:@YES forKey:NSURLIsExcludedFromBackupKey error:nil];
    NSNumber *available=nil;[self.root getResourceValue:&available forKey:NSURLVolumeAvailableCapacityForImportantUsageKey error:nil];
    unsigned long long remaining=self.total-[[self status][@"bytes"] unsignedLongLongValue];
    if(available && available.unsignedLongLongValue<remaining+64ULL*1024*1024){[self fail:@"Not enough free storage. Free space and try again."];return;}
    NSURLSessionConfiguration *config=NSURLSessionConfiguration.defaultSessionConfiguration;config.timeoutIntervalForRequest=60;config.timeoutIntervalForResource=1800;
    self.session=[NSURLSession sessionWithConfiguration:config delegate:self delegateQueue:NSOperationQueue.mainQueue];
    self.running=YES;self.index=0;self.received=0;self.generation++;self.message=@"Checking saved files…";[self next];
}
- (void)next {
    if(!self.running)return;
    if(self.index==self.files.count){
        NSError *error=nil;
        if(![@"verified" writeToURL:[self.staging URLByAppendingPathComponent:@"complete"] atomically:YES encoding:NSUTF8StringEncoding error:&error] || ![NSFileManager.defaultManager moveItemAtURL:self.staging toURL:self.installed error:&error]){[self fail:error.localizedDescription?:@"Could not install tablebases."];return;}
        self.running=NO;self.message=@"Installed — available offline";[self.session finishTasksAndInvalidate];self.session=nil;return;
    }
    NSDictionary *entry=self.files[self.index];NSURL *file=[self.staging URLByAppendingPathComponent:entry[@"name"]];NSUInteger generation=self.generation;
    self.message=[NSString stringWithFormat:@"Checking file %lu of %lu…",(unsigned long)self.index+1,(unsigned long)self.files.count];
    dispatch_async(dispatch_get_global_queue(QOS_CLASS_UTILITY,0),^{BOOL valid=ChessVerifyTablebase(file,entry);dispatch_async(dispatch_get_main_queue(),^{
        if(generation!=self.generation||!self.running)return;
        if(valid){self.index++;[self next];return;}
        self.message=[NSString stringWithFormat:@"Downloading file %lu of %lu…",(unsigned long)self.index+1,(unsigned long)self.files.count];
        self.task=[self.session downloadTaskWithURL:[NSURL URLWithString:entry[@"url"]]];[self.task resume];
    });});
}
- (void)URLSession:(NSURLSession *)session downloadTask:(NSURLSessionDownloadTask *)task didWriteData:(int64_t)bytes totalBytesWritten:(int64_t)written totalBytesExpectedToWrite:(int64_t)expected {
    if(task==self.task)self.received=MAX(0,written);
}
- (void)URLSession:(NSURLSession *)session downloadTask:(NSURLSessionDownloadTask *)task didFinishDownloadingToURL:(NSURL *)location {
    if(task!=self.task||!self.running)return;
    if(((NSHTTPURLResponse *)task.response).statusCode!=200){[self fail:@"Download failed. Check your connection and tap Resume Download."];return;}
    NSDictionary *entry=self.files[self.index];NSUInteger generation=self.generation;
    NSURL *temporary=[self.staging URLByAppendingPathComponent:[NSUUID.UUID.UUIDString stringByAppendingString:@".download"]];NSError *error=nil;
    if(![NSFileManager.defaultManager moveItemAtURL:location toURL:temporary error:&error]){[self fail:error.localizedDescription];return;}
    self.message=@"Verifying download…";
    dispatch_async(dispatch_get_global_queue(QOS_CLASS_UTILITY,0),^{BOOL valid=ChessVerifyTablebase(temporary,entry);dispatch_async(dispatch_get_main_queue(),^{
        if(generation!=self.generation||!self.running){[NSFileManager.defaultManager removeItemAtURL:temporary error:nil];return;}
        if(!valid){[NSFileManager.defaultManager removeItemAtURL:temporary error:nil];[self fail:@"File verification failed. Tap Resume Download to retry."];return;}
        NSURL *target=[self.staging URLByAppendingPathComponent:entry[@"name"]];
        [NSFileManager.defaultManager removeItemAtURL:target error:nil];NSError *moveError=nil;
        if(![NSFileManager.defaultManager moveItemAtURL:temporary toURL:target error:&moveError]){[self fail:moveError.localizedDescription];return;}
        self.received=0;self.task=nil;self.index++;[self next];
    });});
}
- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didCompleteWithError:(NSError *)error {if(task==self.task && error && self.running)[self fail:@"Download interrupted. Check your connection and tap Resume Download."];}
@end
