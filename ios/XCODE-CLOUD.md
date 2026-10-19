# Phone to TestFlight workflow

Version 2.1 development continues from version 1.6 with optional offline Chess Coach. The GitHub `develop` branch contains editable interface, native integration and engine sources. The 13 large engine model files stay in the immutable public build 21 source asset and are restored with checksum verification. No credentials or compiler installations are committed.

## Xcode Cloud configuration

Configured on October 10, 2026: GitHub's default branch is `develop`; the Apple workflow **Phone Development** watches pushes to `develop`, archives the shared StockfishChess scheme for iOS, prepares the archive for **TestFlight (Internal Testing Only)**, and delivers it to the **Owner Testing** internal group. The environment uses Latest Release (currently Xcode 27 and macOS Golden Gate 27), with clean builds enabled. Cloud numbering started at 22. The first diagnostic run verified all 13 model inputs, then exposed local compiler symlinks accidentally tracked in Git; those symlinks were removed before the archive validation run.

Open `ios/StockfishChess.xcodeproj` from the `develop` checkout in Xcode. Choose Integrate → Create Workflow, select Stockfish AI Chess with bundle ID `com.tughankarsli.stockfishaichess` and team `KQVRWBVGS7`, and connect this GitHub repository.

Use a workflow named **Phone Development** with an Apple Silicon environment, Xcode 27.0 (or a compatible later release), branch-change start condition limited to `develop`, and an iOS Archive action using the shared StockfishChess scheme and Release configuration. Start the cloud build sequence at 22. Set TestFlight internal testing as the delivery postaction and select the owner's internal tester group. Keep App Store releases manual.

Apple discovers `ios/ci_scripts/ci_post_clone.sh` automatically. It restores model inputs, installs Rust nightly-2026-08-16 and Zig 0.16.0, runs all web tests, then regenerates the project using version 2.1 and the cloud build number. The initial end-to-end validation completed with build 25: the clean archive and TestFlight delivery succeeded, and version 1.5 (25) was Testing in Owner Testing. All 13 model checks and all 153 web tests passed in that build. This setup has no automatic App Review submission or public release action.

## Ask an AI agent from your phone

The Xcode Cloud build and delivery workflow is ready; a Codex Cloud editing environment still needs to be connected. Use a Codex Cloud environment connected to this GitHub repository. Select the `develop` branch when starting work. Its setup needs Node 24 or newer; web changes can be tested on Linux without downloading the native models. Ask the agent to make the change, run `npm test`, and open a pull request targeting `develop`.

Review the change on your phone and merge it into `develop`. The branch commit triggers the Xcode Cloud archive. After Apple processes the build, install it through TestFlight. For native changes, use the cloud archive and relevant device tests to validate the result.

ChatGPT mobile Remote can also control a connected Mac, but that route requires the Mac to remain available. A Codex Cloud task plus Xcode Cloud builds provides the workflow when the Mac is offline.

Sources: [Apple first workflow guide](https://developer.apple.com/documentation/xcode/configuring-your-first-xcode-cloud-workflow), [Apple custom scripts](https://developer.apple.com/documentation/xcode/writing-custom-build-scripts), [Codex Cloud](https://learn.chatgpt.com/docs/cloud), [ChatGPT mobile Remote](https://developers.openai.com/blog/mastering-codex-remote-for-engineering).

## Closed App Store Connect version trains

Apple rejected version 1.9 build 95 after native compilation and archive export succeeded. The delivery email reported ITMS-90186 (the 1.9 pre-release train is closed) and ITMS-90062 (the marketing version must be higher than the previously approved 1.9). Moving to 1.9.1 addressed that version rejection.

Apple subsequently rejected version 1.9.1 build 106 with the same errors: the 1.9.1 train is now closed, and uploads must have a higher marketing version than the approved 1.9.1. The current development version is 2.1 in both the checked-in project and project generator. Rebuilding an old 1.9 or 1.9.1 commit will not resolve these rejections. If a workflow supplies `CHESS_MARKETING_VERSION`, it must also specify the current version. Build numbers continue to come from Xcode Cloud. No App Review submission or public release is authorized by this version correction.
