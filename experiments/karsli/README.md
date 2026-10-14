# Continue Karsli in the cloud

The research branch is `codex/karsli-cloud-research` in
`tughankarsli76/stockfish-ai-chess`. The app's native revision 9 is in
`engine/karsli-1.0`; unfinished and validated research snapshots are in this
directory. All five sequential candidates retain their exact reconstructed source and notices:
Berserk NMP, Caissa node cache, Trium disagreement, PZ threat correction and
Tarnished interactions. Unchanged files are reused from the pinned app engine; candidate overlays and per-file hashes reconstruct each full source snapshot. Generated binaries and the shared network are excluded
from Git. Historical records contain paths to the original Mac; use the new
runner for reproducible current paths and evidence.

## Resume through Codex Cloud

Use the existing Stockfish AI Chess cloud environment, fetch the research branch,
and read `WORK-STATE.json`. Install make, a C++17 compiler (clang++ or g++), Python
3.9+ and Node.js 24+. Run these commands from the repository root:

```sh
python3 experiments/karsli/cloud.py --verify-only
python3 experiments/karsli/restore-network.py
python3 experiments/karsli/cloud.py --sanitizers --matches --jobs 2
```

For only one stage, add `--candidate pz-threat-correction` or
`--candidate tarnished-interactions`. The runner builds its preceding reference
stages, checks the new feature independently and with the fourteen-option
profile, and optionally plays sixteen games in eight two-color opening pairs.
On/off profiles differ only in the option being measured. Bounds checks run with
ASan/UBSan. Leak detection is enabled on Linux and disabled on macOS, where the
Apple sanitizer does not support it. Reports record platform and binary hashes;
timing results from different machines are separate evidence.

`build/cloud/` receives logs, source copies, binaries, normal/sanitized validation,
comparison JSON/PGN and independent legal/clock audits. A run fails on invalid
moves, incomplete games, clock forfeits or sanitizer errors. `--skip-build` can
reuse recorded binaries after checking their hashes and the pinned network;
use a fresh build after source changes. Small game samples do not prove strength.

## GitHub engine runner

`.github/workflows/karsli-research.yml` runs on relevant pushes to this branch.
It runs PZ and Tarnished sequentially on Ubuntu, including sanitizers and matches,
and retains evidence for thirty days as Actions artifacts. It has read-only
repository permissions and does not modify or deploy the app. Manual dispatch
becomes available when GitHub can discover the workflow on the default branch.

## Xcode Cloud and TestFlight

The existing `ios/ci_scripts/ci_post_clone.sh` restores checksum-pinned app
models, installs pinned Rust/Zig toolchains, runs web tests and regenerates the
Xcode project. The generator preserves the existing full `StockfishChess` scheme
and creates a separate shared `KarsliCloud` scheme and test plan. That plan runs
the three native tests for the combined profile/material fixtures, background
search and the native engine catalog/matches/stop flows.

Use **Karsli Validation** for research-branch changes: Test, iOS, `StockfishChess`,
`KARSLI_CLOUD_TEST_PLAN=1`, required to pass, one current iPhone simulator
destination, no distribution. This environment switch selects the focused plan
through Apple's existing registered scheme; the separate `KarsliCloud` scheme
also supports local command-line tests.
Use **Karsli TestFlight** manually after validation: Archive the `StockfishChess`
scheme from the research branch and deliver to the existing Owner Testing group.
Neither workflow submits the app for App Review.

Until candidates are deliberately promoted, native builds contain the existing
revision-9 fourteen-option profile. Standalone research tests and iOS integration
tests cover different things. Native tests require macOS/Xcode; Linux cloud tasks
can develop and test the standalone engine and web app.

## Exact next work

Complete PZ sanitizer validation and independently audited paired games, then the
same checks for Tarnished. Record failures and final results in the checkpoint.
Review combined effects before native promotion. Continue remaining feature
scope listed in `AGENTS.md`; keep individual candidates and unproven strength
clearly distinguished.
