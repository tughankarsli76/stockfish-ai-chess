# Karsli research continuation

Read `WORK-STATE.json`, `README.md`, each candidate's `manifest.json` and retained
notices before continuing. The user resumed work on 13 October 2026.

The app's deployed engine is `engine/karsli-1.0`, revision 9 with fourteen native
profile options. The five snapshots under `candidates/` are sequential research
stages. A candidate being implemented, compiled or reviewed does not mean it is
validated, stronger, or integrated into the iPhone app.

- Run commands from the repository root. Use `restore-network.py` and `cloud.py`.
- Preserve the pinned source and network hashes. If changing imported candidate
  source, record the change and update `SOURCE-MANIFEST.json` deliberately.
- Run optimized and ASan/UBSan validation, then paired games without competing
  builds or heavy tests on the same machine. Replay PGNs and audit clocks.
- Keep logs, initial failures and final evidence; put generated work in `build/`.
- Preserve defaults off and report small match samples without Elo claims.
- Review combined effects before moving any candidate into the native profile.
  Update corresponding-source/profile manifests, generated commands, tests and
  notices together when promotion is justified.
- Remaining scope includes Trium time management/TRANN1, Karsli-specific LMR
  tuning and Raphael fractional depth. Do not describe these as complete.
- Never commit device identifiers, preferences, saved games, signing material,
  toolchains, compiled engines, model files or build products.

Native Xcode tests use the `KarsliCloud` scheme/test plan. Apple workflow settings
live in App Store Connect; the repository does not create workflows by itself.
