"""Bundle the DOM-free background model into JavaScriptCore without npm dependencies."""
from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
modules={}
def visit(path):
 path=path.resolve();key=str(path.relative_to(root/'dist'))
 if key in modules:return key
 source=path.read_text();imports=[]
 for m in re.finditer(r"import\s*\{([^}]+)\}\s*from\s*['\"]([^'\"]+)['\"];?",source):
  dep=visit(path.parent/m[2]);imports.append('const {'+m[1]+'}=modules['+repr(dep)+'];')
 source=re.sub(r"import\s*\{[^}]+\}\s*from\s*['\"][^'\"]+['\"];?",'',source)
 exports=re.findall(r'export\s+(?:class|function|const|let|var)\s+(\w+)',source)
 for m in re.finditer(r'export\s*\{([^}]+)\};?',source):exports.extend(x.strip() for x in m[1].split(',') if x.strip())
 source=re.sub(r'export\s*\{[^}]+\};?','',source);source=re.sub(r'\bexport\s+(?=class|function|const|let|var)','',source)
 modules[key]='modules['+repr(key)+']=(()=>{\n'+'\n'.join(imports)+'\n'+source+'\nreturn {'+','.join(exports)+'};})();'
 return key
visit(root/'dist/background-game.js')
out=root/'ios/StockfishChess/background-model.js'
out.write_text('const modules={};\n'+'\n'.join(modules.values())+"\nglobalThis.BackgroundGame=modules['background-game.js'].BackgroundGame;\n")
