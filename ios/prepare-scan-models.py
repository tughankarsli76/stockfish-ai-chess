"""Reproduce offline Core ML scanners from checksum-pinned MIT model inputs.

Run with the isolated environment created by prepare-scan-models.sh.
Generated weights stay in .cloud-cache, never in Git.
"""
from pathlib import Path
import hashlib, json, pickle, sys, types, urllib.request, zipfile, tarfile, subprocess
import numpy as np
import torch
from torch import nn
from torchvision import models
import coremltools as ct
import onnx
from onnx import numpy_helper

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / '.cloud-cache/scan'
OUT = CACHE / 'compiled'
OUT.mkdir(parents=True, exist_ok=True)

def download(name, url, digest):
    path = CACHE / name
    if not path.exists() or hashlib.sha256(path.read_bytes()).hexdigest() != digest:
        urllib.request.urlretrieve(url, path)
    if hashlib.sha256(path.read_bytes()).hexdigest() != digest:
        raise RuntimeError('Scan input checksum mismatch: ' + name)
    return path

class SavedClassifier(nn.Module):
    def forward(self, x):
        return self.model(x)

# Only the two reviewed wrapper names are remapped. No chesscog package code
# is imported. The checkpoint's exact bytes are verified before deserialization.
class ModelUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if (module, name) in [('chesscog.occupancy_classifier.models','ResNet'),
                              ('chesscog.piece_classifier.models','InceptionV3')]:
            return SavedClassifier
        if module.startswith(('torch.', 'torchvision.models.')) or module in ('collections','__builtin__','builtins'):
            return super().find_class(module, name)
        raise pickle.UnpicklingError('Unexpected checkpoint class: ' + module + '.' + name)

CHECKPOINT_PICKLE = types.SimpleNamespace(__name__='scan_checkpoint', Unpickler=ModelUnpickler,
                                         load=pickle.load, loads=pickle.loads)

class DigitalTiles(nn.Module):
    def __init__(self, graph):
        super().__init__()
        self.conv1=nn.Conv2d(1,32,3,padding=1)
        self.conv2=nn.Conv2d(32,64,3,padding=1)
        self.conv3=nn.Conv2d(64,64,3,padding=1)
        self.fc1=nn.Linear(1024,256)
        self.fc2=nn.Linear(256,13)
        state={item.name.removeprefix('net.'):torch.from_numpy(numpy_helper.to_array(item).copy())
               for item in graph.initializer if item.name.startswith('net.')}
        self.load_state_dict(state)
    def forward(self,x):
        x=x.reshape(-1,1,32,32)
        for conv in (self.conv1,self.conv2,self.conv3):
            x=torch.nn.functional.max_pool2d(torch.relu(conv(x)),2)
        x=torch.relu(self.fc1(x.flatten(1)))
        return torch.softmax(self.fc2(x),dim=1)

class Probabilities(nn.Module):
    def __init__(self, model):
        super().__init__(); self.model=model
    def forward(self,x):
        return torch.softmax(self.model(x),dim=1)

def convert(name, model, shape):
    destination=OUT/(name+'.mlmodelc')
    if destination.exists():
        return
    model.eval()
    torch.manual_seed(19)
    sample=torch.rand(shape)
    traced=torch.jit.trace(model,sample)
    converted=ct.convert(traced,inputs=[ct.TensorType(name='input',shape=shape)],
                         outputs=[ct.TensorType(name='probs')],
                         minimum_deployment_target=ct.target.iOS17,
                         compute_precision=ct.precision.FLOAT32)
    converted.author='Georg Wölflein / Coachess; converted for Stockfish AI Chess'
    converted.license='MIT'
    package=CACHE/(name+'.mlpackage')
    converted.save(str(package))
    # Validate conversion numerically before compiling for the app.
    expected=model(sample).detach().numpy()
    actual=converted.predict({'input':sample.numpy()})['probs']
    error=float(np.max(np.abs(expected-actual)))
    if not np.allclose(actual,expected,atol=0.002,rtol=0.01):
        raise RuntimeError(f'{name} conversion diverged: {error}')
    (CACHE/(name+'-conversion.json')).write_text(json.dumps({'maxError':error,'shape':shape}))
    subprocess.run(['xcrun','coremlcompiler','compile',str(package),str(OUT)],check=True)
    print(name,'verified max error',error,flush=True)

def main():
    manifest=json.loads((ROOT/'ios/scan-model-inputs.json').read_text())
    for name in ['occupancy_classifier','piece_classifier']:
        item=manifest[name]
        archive=download(item.get('filename',name+'.zip'),item['url'],item['sha256'])
        folder=CACHE/item.get('folder',name)
        if not folder.exists():
            with zipfile.ZipFile(archive) as z: z.extractall(CACHE/item.get('extractTo',name))
        checkpoint=next(folder.glob('*.pt'))
        loaded=torch.load(checkpoint,map_location='cpu',weights_only=False,pickle_module=CHECKPOINT_PICKLE)
        loaded.eval()
        # Drop the training-only auxiliary head before tracing Inception.
        if name=='piece_classifier':
            loaded.model.aux_logits=False
            loaded.model.AuxLogits=None
        convert('PhysicalOccupancy' if name=='occupancy_classifier' else 'PhysicalPieces',
                Probabilities(loaded),(1,3,100,100) if name=='occupancy_classifier' else (1,3,299,299))
    item=manifest['digital']
    archive=download('fenshot.tar.gz',item['url'],item['sha256'])
    folder=CACHE/'fenshot'
    if not folder.exists():
        with tarfile.open(archive) as t: t.extractall(folder)
    graph=onnx.load(str(folder/'package/model/chess-tiles-v2.onnx')).graph
    convert('DigitalTiles',DigitalTiles(graph),(64,1024))

if __name__=='__main__': main()
