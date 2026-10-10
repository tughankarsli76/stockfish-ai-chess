#import <Foundation/Foundation.h>
#include <sys/sysctl.h>
#include <TargetConditionals.h>

// Do not infer a core split from the total: different chips can share a total.
static NSDictionary *ChessCoreBreakdown(NSUInteger total, int performance, int efficiency, NSString *model, BOOL simulator) {
    if(performance>0 && efficiency>0 && (NSUInteger)(performance+efficiency)==total)
        return @{@"performance":@(performance),@"efficiency":@(efficiency)};
    // Apple A19 Pro specifications: https://www.apple.com/am/iphone-17-pro/specs/
    // Explicit fallback when iOS does not expose its performance-level sysctls.
    if(!simulator && total==6 && [@[@"iPhone18,1",@"iPhone18,2"] containsObject:model])
        return @{@"performance":@2,@"efficiency":@4};
    return @{};
}

static int ChessCPUValue(const char *name) {
    int value=0;size_t size=sizeof(value);
    return sysctlbyname(name,&value,&size,NULL,0)==0 && size==sizeof(value)?value:0;
}

static NSDictionary *ChessCPUCoreInfo(void) {
    int performance=0,efficiency=0;
    if(ChessCPUValue("hw.nperflevels")==2) {
        performance=ChessCPUValue("hw.perflevel0.physicalcpu_max");
        efficiency=ChessCPUValue("hw.perflevel1.physicalcpu_max");
    }
    char model[128]={0};size_t size=sizeof(model);
    NSString *identifier=@"";
    if(sysctlbyname("hw.machine",model,&size,NULL,0)==0 && size>0 && size<=sizeof(model)) {
        model[sizeof(model)-1]=0;identifier=[NSString stringWithUTF8String:model]?:@"";
    }
    return ChessCoreBreakdown(NSProcessInfo.processInfo.processorCount,performance,efficiency,identifier,TARGET_OS_SIMULATOR);
}

static NSDictionary *ChessDeviceInfo(void) {
    char machine[128]={0};size_t size=sizeof(machine);
    NSString *identifier=@"unknown";
    if(sysctlbyname("hw.machine",machine,&size,NULL,0)==0 && size>0 && size<=sizeof(machine)) {
        machine[sizeof(machine)-1]=0;identifier=[NSString stringWithUTF8String:machine]?:@"unknown";
    }
    NSDictionary *names=@{@"iPhone18,1":@"iPhone 17 Pro",@"iPhone18,2":@"iPhone 17 Pro Max"};
    NSString *name=names[identifier];
    if(TARGET_OS_SIMULATOR)name=@"iOS Simulator";
    if(!name)name=[NSString stringWithFormat:@"%@ (%@)",UIDevice.currentDevice.model,identifier];
    return @{@"modelName":name,@"identifier":identifier};
}
