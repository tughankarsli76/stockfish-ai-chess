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
python3 -m unittest experiments/karsli/test_restore_network.py
python3 experiments/karsli/restore-network.py
python3 experiments/karsli/cloud.py --sanitizers --matches --jobs 2
```

The network restorer first tries the Stockfish server. If that download is
unavailable, it uses the existing immutable build-21 app source archive from
GitHub, verifies the archive's pinned full SHA-256, extracts only the requested
network member, and verifies its pinned byte count and full SHA-256. This works
with the unchanged package-manager network policy; it does not change access
rules or restore unrelated models. A corrupt primary payload is rejected rather
than treated as valid. Keep initial restoration failures with the Linux logs.

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

## Work away from Megan's Mac

Continue in the existing durable cloud chat **Set up stockfish-ai-chess**:
https://chatgpt.com/local/01a12832-000f-7517-bdd9-ca18ec9b80e6

That workspace edits and tests Karsli remotely. GitHub preserves source and
checkpoints, and the **Karsli Validation** workflow in Apple Xcode Cloud compiles
and tests the native iOS integration on Apple's computers. Megan's Mac is not
required for those steps. Physical iPhone checks still need the intended device.

Run standalone engine validation and paired matches with the commands above in
the durable workspace. The separate GitHub Actions research workflow was removed;
there is no additional scheduled engine automation. Keep generated evidence in
`build/cloud/` and deliberately save reviewed final records under `reports/`.

## Combined-effects comparison

After `cloud.py` completes successfully, and while no builds are running, compare
the five-feature bundle against the unchanged current fourteen-option profile:

```sh
node experiments/karsli/tools/compare.mjs --candidate experiments/karsli/build/cloud/karsli-tarnished-interactions --reference experiments/karsli/build/cloud/karsli-tarnished-interactions --profile experiments/karsli/profiles/combined-research-on.json --reference-profile experiments/karsli/profiles/combined-research-off.json --reports experiments/karsli/build/cloud --report-name combined-research --pairs 8 --cycles 1 --clock 5000 --increment 50
node experiments/karsli/tools/audit-combined-games.mjs experiments/karsli/build/cloud/combined-research.json
node experiments/karsli/tools/test-audit-combined.mjs experiments/karsli/build/cloud/combined-research.json
```

The combined audit requires precisely the five research options to differ,
checks both profile files and binary digests, and independently replays PGNs,
opening-color pairs and every recorded clock interval. This comparison is
separate from the single-feature PZ and Tarnished ablations. Sixteen games are
an exploratory check, not evidence of a proven gain or native promotion.



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

Mac PZ and Tarnished optimized and sanitizer validation passed nine checks each.
PZ scored 1W/1L/14D and Tarnished 0W/0L/16D in separately audited sixteen-game
on/off samples. These results establish functionality, not a strength gain.
Linux PZ and Tarnished checks and all three paired audits are complete. Native
Xcode Cloud status is recorded separately by the coordinator. Read `WORK-STATE.json` for
current results; imported candidate manifests also retain historical status.
Review combined effects before native promotion. Continue remaining feature
scope listed in `AGENTS.md`; keep individual candidates and unproven strength
clearly distinguished.

See [COMBINED-REVIEW.md](COMBINED-REVIEW.md) for the interaction review, exact
platform-specific outcomes and the next opt-in native integration gates.
