# Scan and Analyze

The scanner is entirely on device. PHPicker grants access to the selected photo
only; camera access is requested on Take Photo. Photos are normalized to at most
1600 pixels, kept in memory while the scanner is open, and cleared on close.
There is no image-upload endpoint or API key.

Digital boards use the MIT fenshot 0.1.4 detector and tile classifier. Physical
boards use the MIT chesscog 0.2.7 classifiers adapted to a real chess set. This is
an experimental recognizer, not a guarantee for arbitrary sets, angles, or
occluded pieces. All reads require piece/orientation review and explicit side
to move. Unknown move history defaults to no castling/en passant, move 1 and
halfmove 0; the user can edit these. Illegal positions never reach the engine.

Build models once on an Apple Silicon Mac with Python 3.12:

```sh
CHESS_SCAN_PYTHON=python3.12 sh ios/prepare-scan-models.sh
python3 ios/generate-project.py
```

Model inputs and dependency versions are pinned. Conversion validates Core ML
against the source model, then compiles to `.cloud-cache/scan/compiled`. Xcode
Cloud runs the same preparation before archiving. Do not commit generated
weights or isolated Python environments. Bundled notices are in
`dist/vendor/scan/` and About & Credits.

The normal Node suite verifies FEN/history defaults, rotations, rejected
positions and perspective geometry. Native tests `testScanDigitalPhotoToAnalysis`
and `testScanPhysicalPhotoRecognition` exercise actual Core ML inference and
the scanner UI on an isolated `.corebench.` installation. They also preserve
the previous local state. Those tests require the upstream example images in
`.cloud-cache/scan/test-fixtures/digital.png` and `physical.jpg`, copied into the
Debug bundle only. Sources: fenshot's `chesscom-italian-white.png` regression
fixture and chesscog's transfer-learning dataset `test/01.png` (JPEG quality 95).
Production archives exclude the test photos.

Manual device checks: grant/deny camera permission; select/cancel a Photos item;
capture a physical board; adjust the four numbered corners; rotate a Black-side
view; correct a piece; choose the side to move; open Analysis and play a legal
move. Verify cancel leaves the current game unchanged and photos disappear on
close. In-progress engine tournaments must be finished or stopped before scan.
