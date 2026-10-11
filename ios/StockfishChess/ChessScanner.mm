#import "ChessScanner.h"
#import <PhotosUI/PhotosUI.h>
#import <AVFoundation/AVFoundation.h>
#import <CoreML/CoreML.h>
#import <Vision/Vision.h>
#include <vector>
#include <cmath>

@interface ChessScanner () <UIImagePickerControllerDelegate,UINavigationControllerDelegate,PHPickerViewControllerDelegate>
@property(nonatomic,copy) void (^photoReply)(id,NSString *);
@property(nonatomic,strong) dispatch_queue_t queue;
@property(nonatomic) BOOL busy;
@end

// Project the board plane to the original photograph. Keeping a margin around
// the board preserves the physical pieces that extend above their own squares.
static BOOL ScanHomography(NSArray *points,double *h) {
    if(points.count!=4)return NO;
    double a[8][9]={},uv[4][2]={{0,0},{1,0},{1,1},{0,1}};
    for(int i=0;i<4;i++){
        NSArray *p=points[i];if(![p isKindOfClass:NSArray.class]||p.count!=2)return NO;
        if(![p[0] isKindOfClass:NSNumber.class]||![p[1] isKindOfClass:NSNumber.class])return NO;
        double x=[p[0] doubleValue],y=[p[1] doubleValue],u=uv[i][0],v=uv[i][1];
        if(!std::isfinite(x)||!std::isfinite(y)||x<0||x>1||y<0||y>1)return NO;
        double r[9]={u,v,1,0,0,0,-x*u,-x*v,x};
        double s[9]={0,0,0,u,v,1,-y*u,-y*v,y};
        for(int j=0;j<9;j++){a[2*i][j]=r[j];a[2*i+1][j]=s[j];}
    }
    for(int j=0;j<8;j++){
        int pivot=j;for(int i=j+1;i<8;i++)if(fabs(a[i][j])>fabs(a[pivot][j]))pivot=i;
        if(fabs(a[pivot][j])<1e-9)return NO;
        for(int k=j;k<9;k++)std::swap(a[j][k],a[pivot][k]);
        double divisor=a[j][j];for(int k=j;k<9;k++)a[j][k]/=divisor;
        for(int i=0;i<8;i++)if(i!=j){double f=a[i][j];for(int k=j;k<9;k++)a[i][k]-=f*a[j][k];}
    }
    for(int i=0;i<8;i++)h[i]=a[i][8];return YES;
}
static std::vector<uint8_t> ScanPixels(CGImageRef image) {
    size_t w=CGImageGetWidth(image),h=CGImageGetHeight(image);
    std::vector<uint8_t> data(w*h*4);CGColorSpaceRef color=CGColorSpaceCreateDeviceRGB();
    CGContextRef ctx=CGBitmapContextCreate(data.data(),w,h,8,w*4,color,kCGImageAlphaPremultipliedLast|kCGBitmapByteOrder32Big);
    CGContextDrawImage(ctx,CGRectMake(0,0,w,h),image);CGContextRelease(ctx);CGColorSpaceRelease(color);return data;
}
static std::vector<uint8_t> ScanWarp(CGImageRef image,NSArray *points,int margin,int size) {
    double h[8];if(!ScanHomography(points,h))return {};
    auto pixels=ScanPixels(image);int w=(int)CGImageGetWidth(image),height=(int)CGImageGetHeight(image);
    std::vector<uint8_t> out(size*size*3,0);
    for(int y=0;y<size;y++)for(int x=0;x<size;x++){
        double u=(x-margin)/400.0,v=(y-margin)/400.0,den=h[6]*u+h[7]*v+1;
        if(fabs(den)<1e-9)continue;
        double sx=(h[0]*u+h[1]*v+h[2])/den*(w-1),sy=(h[3]*u+h[4]*v+h[5])/den*(height-1);
        if(!std::isfinite(sx)||!std::isfinite(sy)||fabs(sx)>100000||fabs(sy)>100000)continue;
        int ix=floor(sx),iy=floor(sy);double dx=sx-ix,dy=sy-iy;
        for(int c=0;c<3;c++){
            double value=0;
            for(int yy=0;yy<2;yy++)for(int xx=0;xx<2;xx++){
                int px=ix+xx,py=iy+yy;
                if(px>=0&&px<w&&py>=0&&py<height)value+=pixels[(py*w+px)*4+c]*(xx?dx:1-dx)*(yy?dy:1-dy);
            }
            out[(y*size+x)*3+c]=(uint8_t)lround(value);
        }
    }return out;
}
static MLMultiArray *ScanCrop(const std::vector<uint8_t>& pixels,int stride,int x1,int y1,int w,int h,int target,BOOL flip,BOOL pad,NSError **error) {
    MLMultiArray *array=[[MLMultiArray alloc] initWithShape:@[@1,@3,@(target),@(target)] dataType:MLMultiArrayDataTypeFloat32 error:error];
    if(!array)return nil;
    float *out=(float *)array.dataPointer;double means[3]={.485,.456,.406},stds[3]={.229,.224,.225};
    int srcW=pad?100:w,srcH=pad?200:h;
    for(int y=0;y<target;y++)for(int x=0;x<target;x++){
        double sx=(x+.5)*srcW/target-.5,sy=(y+.5)*srcH/target-.5;
        int ix=floor(sx),iy=floor(sy);double dx=sx-ix,dy=sy-iy;
        for(int c=0;c<3;c++){
            double value=0;
            for(int yy=0;yy<2;yy++)for(int xx=0;xx<2;xx++){
                int cx=MAX(0,MIN(srcW-1,ix+xx)),cy=MAX(0,MIN(srcH-1,iy+yy));
                if(pad)cy-=200-h;
                if(cx>=0&&cx<w&&cy>=0&&cy<h){
                    int px=x1+(flip?w-1-cx:cx),py=y1+cy;
                    if(px>=0&&px<stride&&py>=0&&py<stride)value+=pixels[(py*stride+px)*3+c]*(xx?dx:1-dx)*(yy?dy:1-dy);
                }
            }
            out[c*target*target+y*target+x]=(value/255-means[c])/stds[c];
        }
    }return array;
}
static MLMultiArray *ScanPredict(MLModel *model,MLMultiArray *input,NSError **error) {
    MLDictionaryFeatureProvider *provider=[[MLDictionaryFeatureProvider alloc] initWithDictionary:@{@"input":[MLFeatureValue featureValueWithMultiArray:input]} error:error];
    id<MLFeatureProvider> result=provider?[model predictionFromFeatures:provider error:error]:nil;
    return [result featureValueForName:@"probs"].multiArrayValue;
}

@implementation ChessScanner
- (instancetype)init {if((self=[super init]))self.queue=dispatch_queue_create("chess.scan",DISPATCH_QUEUE_SERIAL);return self;}
- (void)finishPhoto:(id)value error:(NSString *)error {if(self.photoReply)self.photoReply(value,error);self.photoReply=nil;}
- (void)pick:(NSString *)source presenter:(UIViewController *)presenter reply:(void (^)(id,NSString *))reply {
    if(self.photoReply||self.busy){reply(nil,@"A scan is already open.");return;}
    self.photoReply=reply;
    if([source isEqual:@"library"]){
        PHPickerConfiguration *config=[[PHPickerConfiguration alloc] init];config.filter=PHPickerFilter.imagesFilter;config.selectionLimit=1;
        PHPickerViewController *picker=[[PHPickerViewController alloc] initWithConfiguration:config];picker.delegate=self;
        [presenter presentViewController:picker animated:YES completion:nil];return;
    }
    if(![source isEqual:@"camera"]||![UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera]){[self finishPhoto:nil error:@"Camera is unavailable. Choose a photo instead."];return;}
    void (^present)(void)=^{UIImagePickerController *picker=[UIImagePickerController new];picker.sourceType=UIImagePickerControllerSourceTypeCamera;picker.delegate=self;[presenter presentViewController:picker animated:YES completion:nil];};
    AVAuthorizationStatus status=[AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    if(status==AVAuthorizationStatusAuthorized){present();return;}
    if(status==AVAuthorizationStatusNotDetermined){[AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL allowed){dispatch_async(dispatch_get_main_queue(),^{if(allowed)present();else [self finishPhoto:nil error:@"Camera access is disabled. Enable it in Settings, or choose a photo."];});}];return;}
    [self finishPhoto:nil error:@"Camera access is disabled. Enable it in Settings, or choose a photo."];
}
- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {[picker dismissViewControllerAnimated:YES completion:^{[self finishPhoto:NSNull.null error:nil];}];}
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info {
    UIImage *image=info[UIImagePickerControllerOriginalImage];[picker dismissViewControllerAnimated:YES completion:^{[self preparePhoto:image];}];
}
- (void)picker:(PHPickerViewController *)picker didFinishPicking:(NSArray<PHPickerResult *> *)results {
    [picker dismissViewControllerAnimated:YES completion:nil];
    NSItemProvider *provider=results.firstObject.itemProvider;
    if(!provider){[self finishPhoto:NSNull.null error:nil];return;}
    [provider loadObjectOfClass:UIImage.class completionHandler:^(id image,NSError *error){dispatch_async(dispatch_get_main_queue(),^{if(error||![image isKindOfClass:UIImage.class])[self finishPhoto:nil error:@"This photo could not be opened."];else [self preparePhoto:image];});}];
}
- (void)preparePhoto:(UIImage *)image {
    dispatch_async(self.queue,^{@autoreleasepool{
        CGFloat scale=MIN(1,1600/MAX(image.size.width,image.size.height));
        UIGraphicsImageRendererFormat *format=[UIGraphicsImageRendererFormat defaultFormat];format.scale=1;format.opaque=YES;
        UIImage *small=[[[UIGraphicsImageRenderer alloc] initWithSize:CGSizeMake(image.size.width*scale,image.size.height*scale) format:format] imageWithActions:^(UIGraphicsImageRendererContext *ctx){[image drawInRect:CGRectMake(0,0,image.size.width*scale,image.size.height*scale)];}];
        NSData *data=UIImageJPEGRepresentation(small,.9);
        VNDetectRectanglesRequest *request=[VNDetectRectanglesRequest new];request.maximumObservations=1;request.minimumAspectRatio=.35;request.minimumSize=.2;
        [[[VNImageRequestHandler alloc] initWithCGImage:small.CGImage options:@{}] performRequests:@[request] error:nil];
        VNRectangleObservation *rect=request.results.firstObject;
        NSArray *corners=rect?@[@[@(rect.topLeft.x),@(1-rect.topLeft.y)],@[@(rect.topRight.x),@(1-rect.topRight.y)],@[@(rect.bottomRight.x),@(1-rect.bottomRight.y)],@[@(rect.bottomLeft.x),@(1-rect.bottomLeft.y)]]:NSNull.null;
        dispatch_async(dispatch_get_main_queue(),^{[self finishPhoto:data?@{@"image":[data base64EncodedStringWithOptions:0],@"corners":corners}:nil error:data?nil:@"This photo could not be opened."];});
    }});
}
- (MLModel *)model:(NSString *)name error:(NSError **)error {
    NSURL *url=[NSBundle.mainBundle.bundleURL URLByAppendingPathComponent:[@"ScanModels/" stringByAppendingString:[name stringByAppendingString:@".mlmodelc"]]];
    MLModelConfiguration *config=[MLModelConfiguration new];config.computeUnits=MLComputeUnitsAll;
    return [MLModel modelWithContentsOfURL:url configuration:config error:error];
}
- (void)recognize:(NSDictionary *)request reply:(void (^)(id,NSString *))reply {
    if(self.busy||self.photoReply){reply(nil,@"A scan is already running.");return;}self.busy=YES;
    dispatch_async(self.queue,^{@autoreleasepool{
        NSError *error=nil;NSMutableArray *probabilities=[NSMutableArray new];
        NSString *kind=request[@"kind"];
        if([kind isEqual:@"digital"]){
            NSArray *tiles=request[@"tiles"];
            if(![tiles isKindOfClass:NSArray.class]||tiles.count!=65536)error=[NSError errorWithDomain:@"Scan" code:1 userInfo:@{NSLocalizedDescriptionKey:@"Invalid board image."}];
            else {
                MLMultiArray *input=[[MLMultiArray alloc] initWithShape:@[@64,@1024] dataType:MLMultiArrayDataTypeFloat32 error:&error];
                float *data=(float *)input.dataPointer;
                for(NSUInteger i=0;input&&i<tiles.count;i++){id value=tiles[i];if(![value isKindOfClass:NSNumber.class]||!std::isfinite([value doubleValue])||[value doubleValue]<0||[value doubleValue]>1){error=[NSError errorWithDomain:@"Scan" code:1 userInfo:@{NSLocalizedDescriptionKey:@"Invalid board image."}];break;}data[i]=[value floatValue];}
                MLModel *model=error?nil:[self model:@"DigitalTiles" error:&error];
                MLMultiArray *output=model?ScanPredict(model,input,&error):nil;
                if(output)for(NSUInteger i=0;i<output.count;i++)[probabilities addObject:output[i]];
            }
        }else if([kind isEqual:@"physical"]){
            NSString *encoded=request[@"image"];double matrix[8];
            UIImage *image=[encoded isKindOfClass:NSString.class]&&encoded.length<6000000?[UIImage imageWithData:[[NSData alloc] initWithBase64EncodedString:encoded options:0]]:nil;
            NSArray *points=request[@"corners"];
            if(!image||CGImageGetWidth(image.CGImage)>1600||CGImageGetHeight(image.CGImage)>1600||![points isKindOfClass:NSArray.class]||!ScanHomography(points,matrix))error=[NSError errorWithDomain:@"Scan" code:2 userInfo:@{NSLocalizedDescriptionKey:@"Choose the four board corners and try again."}];
            else {
                MLModel *occupancy=[self model:@"PhysicalOccupancy" error:&error],*pieces=error?nil:[self model:@"PhysicalPieces" error:&error];
                if(occupancy&&pieces){
                    auto occupiedImage=ScanWarp(image.CGImage,points,50,500),pieceImage=ScanWarp(image.CGImage,points,200,800);
                    NSString *labels=@"bknpqrBKNPQR";
                    for(int rank=0;rank<8&&!error;rank++)for(int col=0;col<8&&!error;col++){
                        @autoreleasepool{
                            int row=7-rank;
                            MLMultiArray *input=ScanCrop(occupiedImage,500,25+col*50,25+row*50,100,100,100,NO,NO,&error);
                            MLMultiArray *presence=input?ScanPredict(occupancy,input,&error):nil;
                            if(!presence)break;
                            double confidence=[presence[0] doubleValue];int label=0;
                            if([presence[1] doubleValue]>confidence){
                                double heightIncrease=1+2*(7-row)/7.0;
                                double left=col<4?.25+.75*(3-col)/3.0:0,right=col>=4?.25+.75*(col-4)/3.0:0;
                                int x1=(int)(200+50*(col-left)),x2=(int)(200+50*(col+1+right)),y1=(int)(200+50*(row-heightIncrease)),y2=200+50*(row+1);
                                MLMultiArray *pieceInput=ScanCrop(pieceImage,800,x1,y1,x2-x1,y2-y1,299,col<4,YES,&error);
                                MLMultiArray *prediction=pieceInput?ScanPredict(pieces,pieceInput,&error):nil;
                                if(!prediction)break;
                                int best=0;for(int i=1;i<12;i++)if([prediction[i] doubleValue]>[prediction[best] doubleValue])best=i;
                                NSString *piece=[labels substringWithRange:NSMakeRange(best,1)];
                                label=(int)[@"1KQRBNPkqrbnp" rangeOfString:piece].location;
                                confidence=[presence[1] doubleValue]*[prediction[best] doubleValue];
                            }
                            for(int i=0;i<13;i++)[probabilities addObject:@(i==label?confidence:0)];
                        }
                    }
                }
            }
        }else error=[NSError errorWithDomain:@"Scan" code:3 userInfo:@{NSLocalizedDescriptionKey:@"Choose the image type."}];
        dispatch_async(dispatch_get_main_queue(),^{self.busy=NO;if(error)reply(nil,error.localizedDescription);else if(probabilities.count!=832)reply(nil,@"The board could not be read. Try a clearer photo.");else reply(@{@"probs":probabilities},nil);});
    }});
}
@end
