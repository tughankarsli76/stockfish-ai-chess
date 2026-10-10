from pathlib import Path
import os, subprocess
os.chdir(Path(__file__).resolve().parent)
vs=Path(r"C:\Program Files (x86)\Microsoft Visual Studio\18\BuildTools\VC\Tools\MSVC\14.50.35717")
sdk=Path(r"C:\Program Files (x86)\Windows Kits\10")
version="10.0.26100.0"
env=dict(os.environ)
env["PATH"]=str(vs/"bin/Hostx64/x64")+";"+env.get("PATH","")
env["INCLUDE"]=";".join(map(str,[vs/"include",*[sdk/"Include"/version/x for x in ["ucrt","shared","um","winrt"]]]))
env["LIB"]=";".join(map(str,[vs/"lib/x64",sdk/"Lib"/version/"um/x64",sdk/"Lib"/version/"ucrt/x64"]))
with open("build.log","w") as log:
    result=subprocess.run([str(vs/"bin/Hostx64/x64/cl.exe"),"@compile.rsp"],env=env,stdout=log,stderr=subprocess.STDOUT)
raise SystemExit(result.returncode)
