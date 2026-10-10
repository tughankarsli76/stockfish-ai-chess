# Privacy and API audit

Inspected native App.mm, native-bootstrap.js, Web JavaScript, and linked binary symbols. No ads, tracking SDK, developer backend, or analytics were found. Stored game/settings data uses app-local NSUserDefaults plus WebView storage. Optional requests go directly to Chess.com/Lichess and disclose the requested public username and network metadata. Support email is voluntary and outside the app's automated data flow.

PrivacyInfo.xcprivacy declares no tracking/collected data and these required reasons:
- UserDefaults CA92.1: app's own game/settings storage.
- FileTimestamp C617.1: bundled/app-container engine and file metadata (fstat/lstat/fstatat appear in the linked native binary).
- FileTimestamp 3B52.1: user-selected document metadata, including size checks.
- SystemBootTime 35F9.1: elapsed engine search and game timing (clock_gettime in native binary).

Verified against Apple's official NSPrivacyAccessedAPITypeReasons documentation JSON on September 22, 2026. Recheck final archive privacy report and App Store Connect validation after enrollment. This manifest does not replace the App Store privacy questionnaire.

Proposed App Store label: Data Not Collected, subject to the owner's confirmation and review of the third-party public import services against Apple's definitions. Do not describe optional imports as transmitting no information. The full in-app policy describes their network metadata.

Sources:
https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api
https://developer.apple.com/documentation/bundleresources/app-privacy-configuration/nsprivacyaccessedapitypes/nsprivacyaccessedapitypereasons
https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy
