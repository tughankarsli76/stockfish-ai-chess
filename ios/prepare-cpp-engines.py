"""Generate isolated translation units without changing upstream chess logic."""
from pathlib import Path
import re, runpy
root = Path(__file__).resolve().parent.parent
runpy.run_path(str(root/'ios/verify-new-engine-inputs.py'))
out = root / 'ios/StockfishChess/EnginePorts'
out.mkdir(exist_ok=True)
def write_changed(path, content):
    if not path.exists() or path.read_text()!=content:
        path.write_text(content)
trees = [root/'engine/clover-9.1/src', root/'engine/starzix-6.1/src', root/'engine/halogen-16.0.0/src']
exclude = {'immintrin.h','xmmintrin.h','nmmintrin.h','popcntintrin.h','intrin.h','windows.h','numa.h','omp.h','stdutility/atomic.h','byteswap.h','endian.h','sys/endian.h','sys/isa_defs.h','stdendian.h','stdatomic.h'}
headers = set()
for tree in trees:
    for path in tree.rglob('*'):
        if path.suffix in ('.h','.hpp','.cpp','.c'):
            headers.update(re.findall(r'^\s*#\s*include\s*<([^>]+)>',path.read_text(),re.M))
headers -= exclude
# System and standard headers must be included outside the isolated engine namespaces.
write_changed(out/'Prelude.h', '#pragma once\n'+''.join(f'#include <{h}>\n' for h in sorted(headers)))
tb = trees[0]/'3rdparty/Fathom/src/tbprobe.h'
public_tb = set(re.findall(r'\b(?:TB_[A-Z_]+|tb_[a-z_]+)\b',tb.read_text()))
# Constants/macros need no linkage prefix; only exported variables and functions do.
public_tb = {s for s in public_tb if s.startswith('tb_') or s in ['TB_LARGEST','TB_NUM_WDL','TB_NUM_DTM','TB_NUM_DTZ']}
public_tb.update(['TB_MaxCardinality','TB_MaxCardinalityDTM','TB_probe_dtm','leading_pawn','encode','probe_table','first_ei','num_tables','root_probe_dtm','tb_expand_mate'])
write_changed(out/'CloverTablebaseNames.h', '#pragma once\n'+''.join(f'#define {name} clover_{name}\n' for name in sorted(public_tb)))
halogen = trees[2]
makefile=(halogen/'Makefile').read_text()
source_block=makefile.split('SRCS :=',1)[1].split('OBJS :=',1)[0]
paths=re.findall(r'([\w/.-]+\.cpp)',source_block)
for path in paths:
    if path in ['main.cpp','test/static_exchange_evaluation_test.cpp']:
        continue
    name=path.replace('/','_')
    target=out/('Halogen_'+name)
    source=halogen/path
    write_changed(target, '// GPL-3.0. Generated namespace wrapper.\n#include "Prelude.h"\n#define HALOGEN_IOS 1\n#define INCBIN_SILENCE_BITCODE_WARNING\n#define INCBIN_PREFIX Halogen\n#define gNetData HalogenNetData\n#define gNetSize HalogenNetSize\n#define EVALFILE "'+'../engine/halogen-16.0.0/src/verbatim-ios.nn'+'"\nnamespace HalogenIOS {\nusing std::abs;\n#include "'+'../../../engine/halogen-16.0.0/src/'+path+'"\n}\n')
print(f'Prepared {len(paths)-2} Halogen translation units and common headers.')
