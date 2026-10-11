# Stockfish AI Chess development

The `develop` branch is the active app source for version 1.6. The release downloads and historical release tags are immutable records of shipped builds.

- Edit the interface in `dist/`, native integration in `ios/StockfishChess/`, and Xcode project configuration in `ios/generate-project.py`.
- Run `npm test` with Node 24 or newer for interface and game changes. There are no npm dependencies to install.
- Regenerate the Xcode project after native/project changes on a Mac. Linux cloud agents can edit and run web tests; native compilation requires macOS and Xcode.
- Large model inputs are restored with `python3 ios/ci_scripts/restore-models.py`. Their paths, sizes and SHA-256 digests are pinned in `ios/ci_scripts/model-inputs.json`. Keep compiler downloads, models and generated build outputs out of Git.
- Xcode Cloud runs the post-clone script beside the project, verifies the models, installs pinned Rust/Zig compilers, runs the web tests and generates the project before archiving.
- Target pull requests at `develop`. Commit only changes relevant to the requested task. Do not submit to App Review or release an app without the owner's explicit instruction.
