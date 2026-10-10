# Distribution licensing review — unresolved release gate

This is an engineering inventory, not legal clearance. The app should not be described as ready for public distribution until the items below are resolved.

| Component | Local license evidence | Release action |
| --- | --- | --- |
| Stockfish 19 / 18 | GPL v3, Copying.txt | Make exact modified corresponding source and build instructions available, including native integration and required networks |
| Reckless 0.9.0 | AGPL v3, engine/reckless-0.9.0/LICENSE | Review obligations for the statically linked combined app and intended distribution terms |
| PlentyChess 8.0.0, Pawnocchio 2.0.1, Obsidian 16.0 | GPL v3 license files | Preserve authorship, modifications, required network sources/checksums, and reproducible build inputs |
| Fathom/Pyrrhic/SIMDe, Rust/Zig dependencies | Per-component notices | Retain transitive dependency notices and toolchain/version details |
| chess.js | BSD-2-Clause | Preserve copyright and disclaimer |
| Maple/Walnut boards; Pixel, Letter, Pirouetti | AGPL v3+ per assets/CREDITS.txt | Retain artwork source and license; include in distribution review |
| Classic/Merida/Mono; MPChess | GPL v2+ / GPL v3+ | Preserve source SVGs, authors, and modifications |
| Chessnut | Apache 2.0 | Retain LICENSE/attribution |
| Fantasy/Celtic/Spatial | MIT | Retain LICENSE/attribution |
| Shapes | CC BY-SA 4.0 | Attribution/share-alike and distribution restrictions review |
| Kiwen Suwi/Firi/Totoy/Papercut | CC BY 4.0 | Attribution and intended store distribution review |
| RhosGFX and opening data | CC0 notices | Retain provenance |
| Shahi (removed) | Owner requested removal September 23 | Not included in current app assets or new source candidate; historical private audit copy only. |
| App icon | Generated artwork | Retain project generation provenance; no official Stockfish logo used |

## Findings

- Engine source folders are included in the bundle, but this is not a complete, user-accessible corresponding-source delivery plan. Several embedded network files are excluded from those folders; exact versions/URLs and checksums are in IOS-NOTES.md. Full application source and build inputs must be considered, not only engine folders.
- The app links the engines into one native executable. Do not assume the UI/native host can remain proprietary merely because each engine has a separate C++ namespace.
- No owner-approved public source distribution URL exists. A local source candidate can be prepared without publishing private files or credentials. Before publication, select appropriate licensing for owner-authored code and have the combined distribution reviewed.
- App Store contract/DRM restrictions and GPL/AGPL/CC terms need a specific compatibility determination or suitable permission. The FSF has documented App Store GPL concerns; that historical statement is evidence for review, not by itself a definitive analysis of this exact 2026 distribution.
- No noncommercial-only piece sets are selected in PIECE_SETS. The upstream ATTRIBUTION.md lists many unused assets; do not mistake all entries for shipped components.

## Required resolution

1. Review the combined-app licensing and intended App Store delivery with someone qualified in open-source distribution, or obtain appropriate permissions from the relevant rights holders.
2. Confirm the exact neural-network redistribution terms. Shahi was removed at the owner’s request.
3. Approve the license and public repository/archive location for owner-authored code.
4. Publish an audited corresponding-source package, then link it from About & Credits and the listing/support page.
5. Verify a clean build from that package and retain the version/checksum tied to each distributed binary.

Sources checked September 22, 2026:
- https://github.com/official-stockfish/Stockfish/blob/master/README.md
- https://stockfishchess.org/blog/2021/statement-on-fat-fritz-2/
- https://www.fsf.org/blogs/licensing/more-about-the-app-store-gpl-enforcement
- https://developer.apple.com/support/terms/apple-developer-program-license-agreement/
- https://github.com/TamerKaratekin/shahi-chess-shatranj-font

## September 22 pre-membership audit update

The previously shipped Shahi SVGs had shortened filenames and optimized contents. They were replaced with byte-for-byte original upstream SVGs and the original license at the commit recorded in PROVENANCE.json. Runtime URLs now preserve original names (percent-encoded spaces). Previous copies remain only in a private audit backup, excluded from the app and source candidate. This resolves the identified file-preservation issue; it is not legal clearance for the combined distribution.

The web bundling script now removes its generated Web destination before copying current assets, preventing obsolete renamed files or Debug test helpers from surviving a subsequent Release build.

## Current owner preference

The owner confirmed after discussing competing forks: “okay we can make it open source, keep on”. Continue preparing an open-source release. The brief preference for keeping custom code private is superseded. This authorizes preparation; no source has been published. Combined-code license selection and App Store compatibility review remain to be completed before public distribution.

## September 23 network notice correction

Verified Pawnocchio pp_new2.nnue against its pinned SHA-256. Retrieved CC BY-SA 4.0 LICENSE from the exact pinned network repository revision, added provenance/transform notice, and included both in source and native bundling plus in-app About & Credits. The network is not governed by the engine artwork assets/LICENSE (CC BY-ND). This closes the missing network notice, not the remaining distribution review. See reports/licensing-followup-2026-09-23.md for Shahi and Apple terms questions.

## Shahi removed September 23

Owner explicitly requested removal. Removed menu choice, special filename handling and active app credits; moved original assets to a private audit directory excluded from packaging. Saved unavailable piece choices normalize to Classic. Historical website credits describe the previous build until the next website refresh.

## September 23 owner-code license and distribution review

Added scoped GPL-3.0-only terms for original application contributions in root LICENSING.md, with GPLv3 LICENSE. Upstream and asset licenses remain intact. Owner-code license selection is complete locally under the instruction to proceed. APP-STORE-LICENSE-REVIEW.md records current Apple terms, the open-source carve-out in the Standard EULA, and precise unresolved questions. Store clearance and source publication remain separate, unfinished steps.
