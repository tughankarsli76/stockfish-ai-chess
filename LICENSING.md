# Stockfish AI Chess licensing

## Original application code

Copyright (C) 2026 Tughan Y. Karsli, to the extent copyright subsists in the original contributions.

The original application code contributed by Tughan Y. Karsli is free software: you may redistribute it and/or modify it under version 3 of the GNU General Public License, published by the Free Software Foundation (SPDX: GPL-3.0-only). The full license is in LICENSE.

This code is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for details.

This grant covers original application contributions to the interface, native integration, build scripts and tests. It does not replace notices or licenses on third-party code, derivative contributions governed by upstream terms, artwork, fonts, board textures, opening data or neural networks. Retain those licenses, attribution and modification notices. This document makes no claim of ownership of third-party contributions.

## Third-party components

- Karsli 1.0-dev source revision 10 (native profile revision 9): Stockfish-derived research blend; exact component grants, modifications and attributions are in engine/karsli-1.0/NOTICE.md and FOCUS10-NOTICE.md, with their retained licenses. Reckless contributions keep AGPLv3, other GPL components their GPL grants, and Hobbes its MIT notice. The shared Stockfish network remains unchanged.

- Stockfish, PlentyChess, Pawnocchio and Obsidian code: see the GPL licenses and notices in their respective engine directories.
- Reckless: AGPL version 3, engine/reckless-0.9.0/LICENSE. GPLv3 section 13 and AGPLv3 section 13 permit the combination while preserving the applicable terms. Do not relabel Reckless as GPL-only.
- Cinder 0.6.1, Halogen 16.0.0 and Clover 9.1: GPL version 3; preserve each engine's license and notices. Cinder and Clover include their network inputs in their licensed source trees. Halogen's network repository separately supplies a GPL license, copied with the pinned input.
- Viridithas 20.0.0: MIT at the pinned release, with a CC0 network. This does not substitute the license of later development versions. Retain its MIT and network notices.
- Starzix 6.1: WTFPL version 2, including the network in its source tree. Its ordered-map dependency is MIT and incbin is Unlicense. Retain those notices and the LC0 training-data attribution in the engine README.
- The combined Rust host retains AGPLv3 terms for Reckless and GPLv3 terms for Cinder. Vendored crate sources, licenses and a version inventory are in engine/ios-rust-engines; they must accompany corresponding-source distributions.
- Pawnocchio network: CC BY-SA 4.0; see engine/pawnocchio-2.0.1-src/pawnocchio-nets/LICENSE and NOTICE.txt. Other Pawnocchio assets have separate terms in assets/LICENSE.
- Other engine networks and dependencies: preserve the accompanying licenses, source provenance and IOS-NOTES.md files. Network permissions remain part of the distribution audit.
- chess.js: BSD-2-Clause; dist/vendor/chess-LICENSE.txt.
- Pieces, board textures and opening data: individual licenses and dist/assets/CREDITS.txt. The upstream ATTRIBUTION.md includes unused artwork and is not an inventory of shipped sets. Shahi is not shipped in this revision.
- App icon and branding are excluded from this code license grant; no trademark permission is implied. Rights in third-party assets are not changed by this statement.

## Source and distribution

The corresponding-source package must include the original application code, modified engines, required network inputs, build scripts, notices and instructions. Signing credentials, personal game data and developer account details are not source-release materials.

This local licensing choice is not a certification that App Store distribution is compatible with all component licenses. See release/APP-STORE-LICENSE-REVIEW.md for unresolved distribution questions. No additional App Store exception is granted for third-party works by this document.
