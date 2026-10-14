#!/usr/bin/env python3
"""Rebuild and validate the paused Karsli candidates on Linux or Apple Silicon."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import platform
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[2]
HERE = ROOT / 'experiments/karsli'
NET_NAME = 'nn-1a298aa575a0.nnue'
STAGES = ['berserk-nmp', 'caissa-node-cache', 'trium-disagreement',
          'pz-threat-correction', 'tarnished-interactions']


def sha(path):
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(chunk)
    return digest.hexdigest()


def run(command, log, env=None, cwd=ROOT):
    print('Running: ' + ' '.join(map(str, command)), flush=True)
    with log.open('w') as output:
        result = subprocess.run(list(map(str, command)), cwd=cwd, env=env,
                                stdout=output, stderr=subprocess.STDOUT)
    print('\n'.join(log.read_text(errors='replace').splitlines()[-12:]), flush=True)
    if result.returncode:
        raise RuntimeError(f'Command failed ({result.returncode}); see {log}')


def source_file(stage, name):
    overlay = HERE / 'candidates' / stage / 'source' / name
    return overlay if overlay.is_file() else ROOT / 'engine/karsli-1.0' / name


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--candidate', choices=['pz-threat-correction', 'tarnished-interactions', 'all'], default='all')
    parser.add_argument('--jobs', type=int, default=2)
    parser.add_argument('--sanitizers', action='store_true')
    parser.add_argument('--matches', action='store_true')
    parser.add_argument('--verify-only', action='store_true')
    parser.add_argument('--skip-build', action='store_true', help='Reuse binaries verified against the previous build report')
    args = parser.parse_args()
    if not 1 <= args.jobs <= 16:
        parser.error('--jobs must be between 1 and 16')
    os.chdir(ROOT)
    manifest = json.loads((HERE / 'SOURCE-MANIFEST.json').read_text())
    for name, expected in manifest['files'].items():
        if sha(HERE / name) != expected:
            raise RuntimeError('Candidate source checksum mismatch: ' + name)
    for stage, files in manifest['reconstructedSources'].items():
        for name, expected in files.items():
            if sha(source_file(stage, name)) != expected:
                raise RuntimeError('Reconstructed candidate source mismatch: ' + stage + '/' + name)
    print(f"Verified {len(manifest['files'])} imported source/notice files.", flush=True)
    print('Verified all five reconstructed source snapshots.', flush=True)
    if args.verify_only:
        return
    metadata = json.loads((ROOT / 'ios/ci_scripts/model-inputs.json').read_text())
    # Use the repository's complete pinned digest rather than trusting the filename prefix.
    network = next(x for x in metadata['files'] if x['path'] == 'engine/stockfish-progress/' + NET_NAME)
    net = ROOT / network['path']
    if not net.is_file():
        raise RuntimeError('Restore the pinned network first: python3 ios/ci_scripts/restore-models.py')
    if sha(net) != network['sha256']:
        raise RuntimeError('Neural network checksum mismatch')
    machine = platform.machine().lower()
    arch = 'apple-silicon' if platform.system() == 'Darwin' and machine == 'arm64' else ('armv8' if machine in ['arm64', 'aarch64'] else 'x86-64')
    compiler = 'clang' if shutil.which('clang++') else 'gcc'
    cxx = shutil.which('clang++' if compiler == 'clang' else 'g++')
    node = shutil.which('node')
    if not cxx or not node:
        raise RuntimeError('Install a C++17 compiler, make, Python 3.9+ and Node.js 24+')
    node_major = int(subprocess.check_output([node, '-p', 'process.versions.node.split(".")[0]'], text=True))
    if node_major < 24:
        raise RuntimeError('Node.js 24 or newer is required')
    out = HERE / 'build/cloud'
    out.mkdir(parents=True, exist_ok=True)
    selected = ['pz-threat-correction', 'tarnished-interactions'] if args.candidate == 'all' else [args.candidate]
    binaries = {}
    report = {'platform': platform.platform(), 'architecture': arch,
              'networkSHA256': sha(net), 'builds': [], 'validation': {}, 'passed': False}
    previous_report = json.loads((out / 'run.json').read_text()) if args.skip_build else None
    if previous_report and previous_report['networkSHA256'] != sha(net):
        raise RuntimeError('Cannot reuse binaries with a different network')
    try:
        for name in STAGES[:STAGES.index(selected[-1]) + 1]:
            for sanitized in ([False, True] if args.sanitizers and name in selected else [False]):
                key = name + ('-sanitized' if sanitized else '')
                source_hash = hashlib.sha256(json.dumps(manifest['reconstructedSources'][name], sort_keys=True).encode()).hexdigest()
                source = out / (key + '-source')
                binary = out / ('karsli-' + key)
                if args.skip_build:
                    record = next(r for r in previous_report['builds'] if r['name'] == key)
                    if record.get('sourceSHA256') != source_hash or previous_report['architecture'] != arch:
                        raise RuntimeError('Source or architecture changed; build fresh binaries: ' + key)
                    if sha(binary) != record['sha256']:
                        raise RuntimeError('Previously built binary checksum mismatch: ' + key)
                    binaries[key] = binary
                    report['builds'].append(record)
                    continue
                if source.exists():
                    shutil.rmtree(source)
                for relative in manifest['reconstructedSources'][name]:
                    destination = source / relative
                    destination.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(source_file(name, relative), destination)
                (source / 'src' / NET_NAME).symlink_to(net)
                command = ['make', '-j' + str(args.jobs), 'build', 'ARCH=' + arch,
                           'COMP=' + compiler, 'EXE=' + str(binary)]
                if sanitized:
                    command += ['debug=yes', 'optimize=no', 'sanitize=address undefined',
                                'EXTRACXXFLAGS=-O1 -fno-omit-frame-pointer']
                run(command, out / (key + '-build.log'), cwd=source / 'src')
                binaries[key] = binary
                report['builds'].append({'name': key, 'sha256': sha(binary), 'sourceSHA256': source_hash, 'command': command})
        env = os.environ.copy()
        leaks = '0' if platform.system() == 'Darwin' else '1'
        env.update({'ASAN_OPTIONS': 'detect_leaks=' + leaks + ':halt_on_error=1', 'UBSAN_OPTIONS': 'halt_on_error=1:print_stacktrace=1'})
        for name in selected:
            candidate = HERE / 'candidates' / name
            bounds = out / (name + '-bounds')
            bounds_input = out / (name + '-bounds-input')
            bounds_input.mkdir(exist_ok=True)
            shutil.copy2(candidate / 'bounds.cpp', bounds_input / 'bounds.cpp')
            if not (bounds_input / 'source').exists():
                (bounds_input / 'source').symlink_to(out / (name + '-source'), target_is_directory=True)
            run([cxx, '-std=c++17', '-O1', '-g', '-fsanitize=address,undefined',
                 '-fno-omit-frame-pointer', bounds_input / 'bounds.cpp', '-o', bounds],
                out / (name + '-bounds-build.log'), env=env)
            run([bounds], out / (name + '-bounds.log'), env=env)
            prefix = 'KARSLI_PZ' if name.startswith('pz-') else 'KARSLI_TARNISHED'
            previous = STAGES[STAGES.index(name)-1]
            for sanitized in ([False, True] if args.sanitizers else [False]):
                key = name + ('-sanitized' if sanitized else '')
                validation = out / (key + '-validation.json')
                check_env = {**env, prefix + '_BINARY': str(binaries[key]),
                             prefix + '_BASELINE': str(binaries[previous]),
                             prefix + '_REPORT': str(validation)}
                run([node, candidate / 'validate.mjs'], out / (key + '-validation.log'), env=check_env)
                result = json.loads(validation.read_text())
                if not result['passed'] or len(result['checks']) != 9:
                    raise RuntimeError('Incomplete candidate validation: ' + key)
                report['validation'][key] = {'passed': True, 'checks': len(result['checks'])}
            if args.matches:
                run([node, HERE / 'tools/compare.mjs', '--candidate', binaries[name],
                     '--reference', binaries[name], '--profile', candidate / 'profile-on.json',
                     '--reference-profile', candidate / 'profile-off.json', '--reports', out,
                     '--report-name', name + '-ablation', '--pairs', '8', '--cycles', '1',
                     '--clock', '5000', '--increment', '50'], out / (name + '-matches.log'), env=env)
                run([node, HERE / 'tools/audit-cloud-games.mjs', out / (name + '-ablation.json')],
                    out / (name + '-audit.log'), env=env)
        report['passed'] = True
    finally:
        (out / 'run.json').write_text(json.dumps(report, indent=2) + '\n')


if __name__ == '__main__':
    main()
