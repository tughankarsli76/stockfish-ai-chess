"""Build the host converter and reproduce Halogen's baseline NEON network layout."""
from pathlib import Path
import hashlib,json,os,subprocess
root=Path(__file__).resolve().parent.parent
source=root/'engine/halogen-16.0.0/src'
original=source/'150521a9.nn'
expected='150521a9957beb7fe90395dd5b134f75cde4e6dfc95e5d5fdee80031e7c7c9cb'
if hashlib.sha256(original.read_bytes()).hexdigest()!=expected:
    raise RuntimeError('Halogen network checksum mismatch')
output=source/'verbatim-ios.nn'
record=source/'verbatim-ios.json'
inputs=[source/'tools/verbatim.cpp']+sorted((source/'network').rglob('*.hpp'))
digest=hashlib.sha256(b''.join(p.read_bytes() for p in inputs)).hexdigest()
if output.exists() and record.exists():
    data=json.loads(record.read_text())
    if data.get('converterInputsSHA256')==digest and data.get('outputSHA256')==hashlib.sha256(output.read_bytes()).hexdigest():
        print('Halogen baseline NEON network verified');raise SystemExit(0)
tool=root/'ios/halogen-verbatim-tool'
env={k:v for k,v in os.environ.items() if k not in ['SDKROOT','IPHONEOS_DEPLOYMENT_TARGET']}
subprocess.run(['xcrun','--sdk','macosx','clang++','-std=c++20','-O2','-DNDEBUG','-DUSE_NEON','-I'+str(source),str(source/'tools/verbatim.cpp'),'-o',str(tool)],env=env,check=True)
subprocess.run([str(tool),str(original),str(output)],check=True)
record.write_text(json.dumps({'originalSHA256':expected,'converterInputsSHA256':digest,'outputSHA256':hashlib.sha256(output.read_bytes()).hexdigest(),'architecture':'NEON without DOTPROD or NETWORK_SHUFFLE'},indent=2)+'\n')
