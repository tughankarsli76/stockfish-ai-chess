"""Generate the dependency-free Xcode project, preserving existing signing settings."""
from pathlib import Path
import hashlib,json,os,plistlib,shutil,subprocess
root=Path(__file__).resolve().parent
marketing_version=os.environ.get('CHESS_MARKETING_VERSION','1.6')
build_number=os.environ.get('CI_BUILD_NUMBER',os.environ.get('CHESS_BUILD_NUMBER','22'))
if not build_number.isdigit() or int(build_number)<1:raise ValueError('Invalid build number')
subprocess.run(['/usr/bin/python3',str(root/'bundle-background.py')],check=True)
subprocess.run(['/usr/bin/python3',str(root/'prepare-cpp-engines.py')],check=True)
subprocess.run(['/usr/bin/python3',str(root/'prepare-karsli.py')],check=True)
# Preserve existing signing and build settings when extending the project.
projectFile=root/'StockfishChess.xcodeproj/project.pbxproj'
projectFile.parent.mkdir(parents=True,exist_ok=True)
(projectFile.parent/'xcshareddata/xcschemes').mkdir(parents=True,exist_ok=True)
previous=json.loads(subprocess.check_output(['plutil','-convert','json','-o','-',str(projectFile)]))['objects'] if projectFile.exists() else {}
objects={}
def ident(key):return hashlib.sha1(key.encode()).hexdigest()[:24].upper()
def add(key,value):i=ident(key);objects[i]=value;return i
def ref(path,typ,tree='SOURCE_ROOT'):
 return add('file:'+path,{'isa':'PBXFileReference','lastKnownFileType':typ,'path':path,'sourceTree':tree})
def build(file):
 item={'isa':'PBXBuildFile','fileRef':file}
 path=objects[file].get('path','')
 if '/karsli-1.0/src/' in path or path.endswith('KarsliBackend.cpp'):item['settings']={'COMPILER_FLAGS':'-DStockfish=KarsliIOS'}
 if path.endswith('CloverBackend.cpp'):item['settings']={'COMPILER_FLAGS':'-std=c++20 -DCLOVER_EVALFILE=\\"'+'$(SRCROOT)/../engine/clover-9.1/src/quantised.nnue'+'\\"'}
 if '/clover-9.1/src/3rdparty/' in path:item['settings']={'COMPILER_FLAGS':'-include '+'$(SRCROOT)/StockfishChess/EnginePorts/CloverTablebaseNames.h'}
 if path.endswith('StarzixBackend.cpp'):item['settings']={'COMPILER_FLAGS':'-std=c++23 -DSTARZIX_EVALFILE=\\"'+'$(SRCROOT)/../engine/starzix-6.1/src/net.bin'+'\\"'}
 if 'EnginePorts/Halogen_' in path or path.endswith('HalogenBackend.cpp'):item['settings']={'COMPILER_FLAGS':'-std=c++20 -I'+'$(SRCROOT)/../engine/halogen-16.0.0/src'+' -ffp-contract=off'}
 if '/plentychess-8.0.0/src/' in objects[file].get('path','') or objects[file].get('path','').endswith('PlentyChessBackend.cpp'):item['settings']={'COMPILER_FLAGS':'-DARCH_ARM -DPLENTY_IOS'}
 if '/Obsidian-16.0/src/' in objects[file].get('path','') or objects[file].get('path','').endswith('ObsidianBackend.cpp'):item['settings']={'COMPILER_FLAGS':'-DOBSIDIAN_IOS -Wno-psabi'}
 return add('build:'+file,item)
engine=Path('../engine/stockfish-progress/src')
sources=[ref('StockfishChess/App.mm','sourcecode.cpp.objcpp'),ref('StockfishChess/SFEngine.mm','sourcecode.cpp.objcpp')]
for p in sorted((root/engine).rglob('*.cpp')):
 if p.name!='main.cpp' and 'universal' not in p.parts:sources.append(ref(str(engine/p.relative_to(root/engine)),'sourcecode.cpp.cpp'))
sources.extend(ref('StockfishChess/'+name,'sourcecode.cpp.cpp') for name in ['Stockfish19Backend.cpp','RecklessBackend.cpp','AsyncRustBackend.cpp','CloverBackend.cpp','StarzixBackend.cpp','HalogenBackend.cpp'])
for p in sorted((root/'../engine/karsli-1.0/src').rglob('*.cpp')):
 if p.name!='main.cpp' and 'universal' not in p.parts:sources.append(ref('../engine/karsli-1.0/src/'+str(p.relative_to(root/'../engine/karsli-1.0/src')),'sourcecode.cpp.cpp'))
sources.append(ref('StockfishChess/KarsliBackend.cpp','sourcecode.cpp.cpp'))
sources.append(ref('../engine/clover-9.1/src/3rdparty/Fathom/src/tbprobe.c','sourcecode.c.c'))
sources.extend(ref(str(p.relative_to(root)),'sourcecode.cpp.cpp') for p in sorted((root/'StockfishChess/EnginePorts').glob('Halogen_*.cpp')))
plenty=Path('../engine/plentychess-8.0.0/src')
for p in sorted((root/plenty).glob('*.cpp')):
 if p.name!='engine.cpp':sources.append(ref(str(plenty/p.name),'sourcecode.cpp.cpp'))
sources.append(ref(str(plenty/'fathom/src/tbprobe.c'),'sourcecode.c.c'))
sources.append(ref('StockfishChess/PlentyChessBackend.cpp','sourcecode.cpp.cpp'))
sources.append(ref('StockfishChess/PawnocchioBackend.cpp','sourcecode.cpp.cpp'))
obsidian=Path('../engine/Obsidian-16.0/src')
for p in sorted((root/obsidian).glob('*.cpp')):
 if p.name!='main.cpp':sources.append(ref(str(obsidian/p.name),'sourcecode.cpp.cpp'))
sources.append(ref(str(obsidian/'fathom/src/tbprobe.c'),'sourcecode.c.c'))
sources.append(ref('StockfishChess/ObsidianBackend.cpp','sourcecode.cpp.cpp'))
sources.append(ref('StockfishChess/BackgroundGame.mm','sourcecode.cpp.objcpp'))
sources.append(ref('StockfishChess/ChessScanner.mm','sourcecode.cpp.objcpp'))
assets=root/'StockfishChess/Assets.xcassets';assets.mkdir(exist_ok=True)
for source in ['../dist/assets/branding/AppIcon.appiconset','../dist/assets/branding/launch/LaunchMark.imageset']:
 shutil.copytree(root/source,assets/Path(source).name,dirs_exist_ok=True)
(assets/'Contents.json').write_text('{"info":{"author":"xcode","version":1}}')
shutil.copy2(root/'../dist/assets/branding/launch/LaunchScreen.storyboard',root/'StockfishChess/LaunchScreen.storyboard')
resources=[ref('StockfishChess/PrivacyInfo.xcprivacy','text.xml'),ref('StockfishChess/Assets.xcassets','folder.assetcatalog'),ref('StockfishChess/LaunchScreen.storyboard','file.storyboard'),ref('StockfishChess/native-bootstrap.js','sourcecode.javascript'),ref('../engine/stockfish-progress/nn-1a298aa575a0.nnue','file')]
resources.append(ref('StockfishChess/background-model.js','sourcecode.javascript'))
app=ref('StockfishChess.app','wrapper.application','BUILT_PRODUCTS_DIR')
productGroup=add('products',{'isa':'PBXGroup','children':[app],'name':'Products','sourceTree':'<group>'})
mainGroup=add('main',{'isa':'PBXGroup','children':sources+resources+[productGroup],'sourceTree':'<group>'})
sourcePhase=add('sources',{'isa':'PBXSourcesBuildPhase','buildActionMask':2147483647,'files':[build(f) for f in sources],'runOnlyForDeploymentPostprocessing':0})
resourcePhase=add('resources',{'isa':'PBXResourcesBuildPhase','buildActionMask':2147483647,'files':[build(f) for f in resources],'runOnlyForDeploymentPostprocessing':0})
copyPhase=add('web',{'isa':'PBXShellScriptBuildPhase','buildActionMask':2147483647,'files':[],'inputPaths':[],'outputPaths':[],'alwaysOutOfDate':1,'runOnlyForDeploymentPostprocessing':0,'shellPath':'/bin/sh','shellScript':'/usr/bin/python3 "$SRCROOT/bundle-web.py"\n'})
recklessPhase=add('reckless',{'isa':'PBXShellScriptBuildPhase','buildActionMask':2147483647,'files':[],'inputPaths':[],'outputPaths':['$(BUILT_PRODUCTS_DIR)/libchess_rust_ios.a','$(SRCROOT)/StockfishChess/background-model.js'],'alwaysOutOfDate':1,'runOnlyForDeploymentPostprocessing':0,'shellPath':'/bin/sh','shellScript':'/usr/bin/python3 "$SRCROOT/bundle-background.py"\n/usr/bin/python3 "$SRCROOT/prepare-cpp-engines.py"\n/usr/bin/python3 "$SRCROOT/prepare-karsli.py"\n/usr/bin/python3 "$SRCROOT/prepare-halogen-network.py"\n/bin/sh "$SRCROOT/build-rust-engines.sh"\n'})
pawnPhase=add('pawnocchio',{'isa':'PBXShellScriptBuildPhase','buildActionMask':2147483647,'files':[],'inputPaths':[],'outputPaths':['$(BUILT_PRODUCTS_DIR)/libpawnocchio_ios.a'],'alwaysOutOfDate':1,'runOnlyForDeploymentPostprocessing':0,'shellPath':'/bin/sh','shellScript':'/bin/sh "$SRCROOT/build-pawnocchio.sh"\n'})
settings={'ARCHS':'arm64','CLANG_ENABLE_MODULES':'YES','CLANG_ENABLE_OBJC_ARC':'YES','CLANG_CXX_LANGUAGE_STANDARD':'c++17','IPHONEOS_DEPLOYMENT_TARGET':'17.0','SDKROOT':'iphoneos','TARGETED_DEVICE_FAMILY':'1,2','PRODUCT_BUNDLE_IDENTIFIER':'org.example.stockfishaichess','PRODUCT_NAME':'$(TARGET_NAME)','INFOPLIST_FILE':'StockfishChess/Info.plist','ASSETCATALOG_COMPILER_APPICON_NAME':'AppIcon','HEADER_SEARCH_PATHS':'$(SRCROOT)/../engine/stockfish-progress/src','GCC_PREPROCESSOR_DEFINITIONS':['$(inherited)','NDEBUG','IS_64BIT','USE_POPCNT','USE_NEON=8','NNUE_EMBEDDING_OFF'],'OTHER_CPLUSPLUSFLAGS':['-O3','-fconstexpr-steps=500000000'],'OTHER_LDFLAGS':['-framework','CoreGraphics','-framework','UIKit','-framework','WebKit','-framework','UniformTypeIdentifiers'],'ENABLE_USER_SCRIPT_SANDBOXING':'NO','CODE_SIGN_STYLE':'Automatic','DEVELOPMENT_TEAM':'KQVRWBVGS7','SWIFT_VERSION':'5.0','MARKETING_VERSION':marketing_version,'CURRENT_PROJECT_VERSION':build_number,'SUPPORTED_PLATFORMS':'iphoneos iphonesimulator','SUPPORTS_MACCATALYST':'NO'}
def configs(key,settings):
 ids=[]
 for name in ['Debug','Release']:
  preserved=previous.get(ident(key+name),{}).get('buildSettings',{})
  ids.append(add(key+name,{'isa':'XCBuildConfiguration','buildSettings':{**settings,**preserved},'name':name}))
 return add(key+'list',{'isa':'XCConfigurationList','buildConfigurations':ids,'defaultConfigurationIsVisible':0,'defaultConfigurationName':'Debug'})
target=add('target',{'isa':'PBXNativeTarget','buildConfigurationList':configs('targetConfig',settings),'buildPhases':[recklessPhase,pawnPhase,sourcePhase,resourcePhase,copyPhase],'buildRules':[],'dependencies':[],'name':'StockfishChess','productName':'StockfishChess','productReference':app,'productType':'com.apple.product-type.application'})
project=add('project',{'isa':'PBXProject','attributes':{'LastUpgradeCheck':'2700'},'buildConfigurationList':configs('projectConfig',{}),'compatibilityVersion':'Xcode 14.0','developmentRegion':'en','hasScannedForEncodings':0,'knownRegions':['en','Base'],'mainGroup':mainGroup,'productRefGroup':productGroup,'projectDirPath':'','projectRoot':'','targets':[target]})
for config in ['Debug','Release']:
 cfg=objects[ident('targetConfig'+config)]['buildSettings']
 flags=cfg.get('OTHER_LDFLAGS',[])
 flags=[flag for flag in flags if flag!='$(BUILT_PRODUCTS_DIR)/libreckless_ios.a']
 if '$(BUILT_PRODUCTS_DIR)/libchess_rust_ios.a' not in flags:flags+=['$(BUILT_PRODUCTS_DIR)/libchess_rust_ios.a']
 if 'Security' not in flags:flags+=['-framework','Security']
 if '-liconv' not in flags:flags+=['-liconv']
 if '$(BUILT_PRODUCTS_DIR)/libpawnocchio_ios.a' not in flags:flags+=['$(BUILT_PRODUCTS_DIR)/libpawnocchio_ios.a']
 for framework in ['JavaScriptCore','AVFAudio','BackgroundTasks','AVFoundation','PhotosUI','CoreML','Vision']:
  if framework not in flags:flags+=['-framework',framework]
 cfg['OTHER_LDFLAGS']=flags
 cfg['MARKETING_VERSION']=marketing_version
 cfg['CURRENT_PROJECT_VERSION']=build_number
 if config=='Release':
  cfg['PRODUCT_BUNDLE_IDENTIFIER']='com.tughankarsli.stockfishaichess'
  cfg['CURRENT_PROJECT_VERSION']=build_number
  cfg['DEBUG_INFORMATION_FORMAT']='dwarf-with-dsym'
testFile=ref('StockfishChessTests/IntegrationTests.m','sourcecode.c.objc')
testProduct=ref('StockfishChessTests.xctest','wrapper.cfbundle','BUILT_PRODUCTS_DIR')
objects[mainGroup]['children'].append(testFile);objects[productGroup]['children'].append(testProduct)
testSources=add('testSources',{'isa':'PBXSourcesBuildPhase','buildActionMask':2147483647,'files':[build(testFile)],'runOnlyForDeploymentPostprocessing':0})
proxy=add('testProxy',{'isa':'PBXContainerItemProxy','containerPortal':project,'proxyType':1,'remoteGlobalIDString':target,'remoteInfo':'StockfishChess'})
dep=add('testDependency',{'isa':'PBXTargetDependency','target':target,'targetProxy':proxy})
testSettings={'ARCHS':'arm64','CLANG_ENABLE_MODULES':'YES','CLANG_ENABLE_OBJC_ARC':'YES','IPHONEOS_DEPLOYMENT_TARGET':'17.0','SDKROOT':'iphoneos','PRODUCT_NAME':'$(TARGET_NAME)','PRODUCT_BUNDLE_IDENTIFIER':'org.example.stockfishaichess.tests','GENERATE_INFOPLIST_FILE':'YES','TEST_HOST':'$(BUILT_PRODUCTS_DIR)/StockfishChess.app/StockfishChess','BUNDLE_LOADER':'$(TEST_HOST)','OTHER_LDFLAGS':['-framework','XCTest','-framework','WebKit','-framework','UIKit'],'FRAMEWORK_SEARCH_PATHS':['$(inherited)','$(PLATFORM_DIR)/Developer/Library/Frameworks'],'LD_RUNPATH_SEARCH_PATHS':['$(inherited)','@executable_path/Frameworks','@loader_path/Frameworks']}
testTarget=add('testTarget',{'isa':'PBXNativeTarget','buildConfigurationList':configs('testConfig',testSettings),'buildPhases':[testSources],'buildRules':[],'dependencies':[dep],'name':'StockfishChessTests','productName':'StockfishChessTests','productReference':testProduct,'productType':'com.apple.product-type.bundle.unit-test'})
objects[project]['targets'].append(testTarget)
uiFile=ref('StockfishChessUITests/UITests.m','sourcecode.c.objc')
uiProduct=ref('StockfishChessUITests.xctest','wrapper.cfbundle','BUILT_PRODUCTS_DIR')
objects[mainGroup]['children'].append(uiFile);objects[productGroup]['children'].append(uiProduct)
uiSources=add('uiSources',{'isa':'PBXSourcesBuildPhase','buildActionMask':2147483647,'files':[build(uiFile)],'runOnlyForDeploymentPostprocessing':0})
uiSettings={k:v for k,v in testSettings.items() if k not in ['TEST_HOST','BUNDLE_LOADER']}
uiSettings.update({'PRODUCT_BUNDLE_IDENTIFIER':'org.example.stockfishaichess.uitests','TEST_TARGET_NAME':'StockfishChess','CODE_SIGN_STYLE':'Automatic'})
uiTarget=add('uiTarget',{'isa':'PBXNativeTarget','buildConfigurationList':configs('uiConfig',uiSettings),'buildPhases':[uiSources],'buildRules':[],'dependencies':[dep],'name':'StockfishChessUITests','productName':'StockfishChessUITests','productReference':uiProduct,'productType':'com.apple.product-type.bundle.ui-testing'})
objects[project]['targets'].append(uiTarget)
def encode(v):
 if isinstance(v,dict):return '{\n'+''.join(f'{json.dumps(str(k))} = {encode(val)};\n' for k,val in v.items())+'}'
 if isinstance(v,list):return '('+','.join(encode(x) for x in v)+')'
 return json.dumps(v) if isinstance(v,str) else str(v)
(root/'StockfishChess.xcodeproj/project.pbxproj').write_text('// !$*UTF8*$!\n'+encode({'archiveVersion':1,'classes':{},'objectVersion':56,'objects':objects,'rootObject':project}))
(root/'StockfishChess.xcodeproj/xcshareddata/xcschemes/StockfishChess.xcscheme').write_text(f'''<?xml version="1.0" encoding="UTF-8"?>
<Scheme LastUpgradeVersion="2700" version="1.3"><BuildAction parallelizeBuildables="YES" buildImplicitDependencies="YES"><BuildActionEntries><BuildActionEntry buildForTesting="YES" buildForRunning="YES" buildForProfiling="YES" buildForArchiving="YES" buildForAnalyzing="YES"><BuildableReference BuildableIdentifier="primary" BlueprintIdentifier="{target}" BuildableName="StockfishChess.app" BlueprintName="StockfishChess" ReferencedContainer="container:StockfishChess.xcodeproj"/></BuildActionEntry></BuildActionEntries></BuildAction><TestAction buildConfiguration="Debug" selectedDebuggerIdentifier="Xcode.DebuggerFoundation.Debugger.LLDB" selectedLauncherIdentifier="Xcode.IDEFoundation.Launcher.LLDB" shouldUseLaunchSchemeArgsEnv="YES"><Testables><TestableReference skipped="NO"><BuildableReference BuildableIdentifier="primary" BlueprintIdentifier="{testTarget}" BuildableName="StockfishChessTests.xctest" BlueprintName="StockfishChessTests" ReferencedContainer="container:StockfishChess.xcodeproj"/></TestableReference><TestableReference skipped="NO"><BuildableReference BuildableIdentifier="primary" BlueprintIdentifier="{uiTarget}" BuildableName="StockfishChessUITests.xctest" BlueprintName="StockfishChessUITests" ReferencedContainer="container:StockfishChess.xcodeproj"/></TestableReference></Testables></TestAction><LaunchAction buildConfiguration="Debug" selectedDebuggerIdentifier="Xcode.DebuggerFoundation.Debugger.LLDB" selectedLauncherIdentifier="Xcode.IDEFoundation.Launcher.LLDB" launchStyle="0" useCustomWorkingDirectory="NO" ignoresPersistentStateOnLaunch="NO" debugDocumentVersioning="YES" debugServiceExtension="internal" allowLocationSimulation="YES"><BuildableProductRunnable runnableDebuggingMode="0"><BuildableReference BuildableIdentifier="primary" BlueprintIdentifier="{target}" BuildableName="StockfishChess.app" BlueprintName="StockfishChess" ReferencedContainer="container:StockfishChess.xcodeproj"/></BuildableProductRunnable></LaunchAction><ArchiveAction buildConfiguration="Release" revealArchiveInOrganizer="YES"/></Scheme>''')
info={'ITSAppUsesNonExemptEncryption':False,'UIApplicationSceneManifest':{'UIApplicationSupportsMultipleScenes':False,'UISceneConfigurations':{'UIWindowSceneSessionRoleApplication':[{'UISceneConfigurationName':'Chess','UISceneDelegateClassName':'SceneDelegate'}]}},'CFBundleDisplayName':os.environ.get('CHESS_APP_DISPLAY_NAME','Stockfish AI Chess'),'CFBundleExecutable':'$(EXECUTABLE_NAME)','CFBundleIdentifier':'$(PRODUCT_BUNDLE_IDENTIFIER)','CFBundleName':'$(PRODUCT_NAME)','CFBundlePackageType':'APPL','CFBundleShortVersionString':'$(MARKETING_VERSION)','CFBundleVersion':'$(CURRENT_PROJECT_VERSION)','LSRequiresIPhoneOS':True,'UILaunchStoryboardName':'LaunchScreen','UISupportedInterfaceOrientations':['UIInterfaceOrientationPortrait','UIInterfaceOrientationLandscapeLeft','UIInterfaceOrientationLandscapeRight'],'UISupportedInterfaceOrientations~ipad':['UIInterfaceOrientationPortrait','UIInterfaceOrientationPortraitUpsideDown','UIInterfaceOrientationLandscapeLeft','UIInterfaceOrientationLandscapeRight'],'UIRequiresFullScreen':False,'UIFileSharingEnabled':True,'LSSupportsOpeningDocumentsInPlace':True}
info['NSCameraUsageDescription']='Take a chessboard photo to recognize its position and analyze it on your device.'
info.update({'UIBackgroundModes':['processing'],'BGTaskSchedulerPermittedIdentifiers':['$(PRODUCT_BUNDLE_IDENTIFIER).engine-match.*']})
(root/'StockfishChess/Info.plist').write_bytes(plistlib.dumps(info))
print('Generated',root/'StockfishChess.xcodeproj')
