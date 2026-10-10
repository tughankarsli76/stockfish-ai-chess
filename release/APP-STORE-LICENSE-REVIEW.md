# App Store distribution review — September 23, 2026

## Owner confirmation — September 29, 2026

The owner stated in task 01a0ec37-1c51-7290-8f89-e3672db6df5e: "I have resolved the review and confirm the necessary rights." Based on that explicit confirmation, Apple's third-party content-rights declaration was saved. This records the owner's representation; no new independent legal opinion or supporting review document was supplied to the agent. The earlier engineering review below remains historical evidence.

## Result

Original app code now has a scoped GPL-3.0-only grant in ../LICENSING.md and the unchanged GPLv3 text in ../LICENSE, following the owner's authorization to proceed with open source and settle the license. Third-party terms remain intact. GPLv3 and AGPLv3 explicitly permit combination in section 13; Reckless is not an automatic incompatibility simply because it uses AGPL.

App Store compatibility remains unresolved. This engineering review cannot establish legal clearance for the combined binary. Source publication and App Store binary distribution are separate actions; a source license is not proof of store compatibility. No source repository was published by this review.

## Current evidence

Apple's Developer Program License Agreement requires FOSS compliance in 3.3.4(A)(v) and compatibility with signing/content protection in 5.1. A public-source link alone does not demonstrate that both requirements are satisfied. Source: https://developer.apple.com/support/terms/apple-developer-program-license-agreement/

Apple's Standard EULA allows a custom EULA. Its scope paragraph includes an open-source exception to certain copying/modification restrictions, but also contains transfer/redistribution restrictions. That exception means a blanket claim that Apple always forbids GPL permissions would be too strong; it does not establish compatibility of this exact app. Source: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/

Local authoritative license texts: ../LICENSE sections 1, 3, 6, 10, 12 and 13; ../engine/reckless-0.9.0/LICENSE sections 10, 12 and 13. GPLv3 section 6's installation-information obligation is conditional; do not assume every App Store download automatically triggers it, or that publishing private Apple signing keys is required.

## Questions for a qualified open-source licensing reviewer

Please review this iOS app's single executable, which statically links Stockfish 19/18, Reckless 0.9.0, PlentyChess 8.0.0, Pawnocchio 2.0.1 and Obsidian 16.0, with GPLv3 original app code and separately licensed assets/networks.

1. For the intended App Store territory/pricing and actual Apple agreements, do usage rules, redistribution restrictions or technical protection impose restrictions prohibited by GPLv3/AGPLv3? Does an appropriate custom EULA resolve any contractual part, and what remains outside its control?
2. Does GPLv3 section 6 require installation information for this distribution, and if so what information can lawfully be provided? Assess Apple's system libraries and code-signing arrangements without assuming access to Apple's or the owner's private keys.
3. Are the exact model licenses and CC BY/CC BY-SA assets compatible with the delivery protections and attribution plan? The pinned Pawnocchio network is CC BY-SA 4.0, distinct from its engine artwork.
4. If an exception or permission is necessary, which copyright holders must grant it, and for which components? Owner-code permissions alone cannot waive upstream rights.
5. What exact corresponding-source delivery, notices and custom EULA should accompany the final binary?

## Prepared facts and next action

Shahi is removed. Pawnocchio's pinned network license and attribution are included. The app works offline; optional Chess.com/Lichess imports do not serve this app's engine remotely. Full corresponding source is being prepared privately with a file/hash manifest. The final source package still needs to be tied to the distributed binary and checked from extraction.

Obtain a review of these specific questions before representing the App Store binary as cleared. No inquiry has been sent and no legal service has been engaged. No Apple agreement was accepted in this task.
