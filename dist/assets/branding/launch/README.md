# Stockfish AI Chess launch screen

Design: the approved knight icon centered on a solid lighter blue background (#287ac0). The mark is 144 points square. Auto Layout centers it on different screen sizes and orientations. No spinner, fixed timer, network request, or animation is part of the native launch screen.

## Mac integration

1. Add `LaunchMark.imageset` to the iOS target's `Assets.xcassets`.
2. Add `LaunchScreen.storyboard` to the project with membership in the iOS app target.
3. Set the target's Launch Screen File to `LaunchScreen` (`UILaunchStoryboardName`). Use this storyboard instead of a conflicting generated `UILaunchScreen` configuration.
4. Build and check a cold launch in the iOS simulator and on the iPhone. The system replaces this screen as soon as the app draws its first screen. Do not delay initialization to hold it on screen; engine startup can finish after the board appears.

Prepared on Windows. XML and asset references were checked; storyboard compilation and native device behavior still need verification in Xcode.

The separate browser preview holds the design on screen for inspection; it does not simulate launch timing or modify the chess game screen.

Apple documentation: https://developer.apple.com/documentation/xcode/specifying-your-apps-launch-screen/
