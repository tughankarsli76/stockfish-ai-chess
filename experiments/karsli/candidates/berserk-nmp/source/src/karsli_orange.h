/*
 * Karsli remaining-orange research adaptations, 2026-10-11.
 * SPDX-License-Identifier: GPL-3.0-only
 * Hobbes 3.0 (Dan Kelsey, MIT): complementary capture from/to history.
 * Halogen 16 (Kieren Pearson and contributors, GPLv3): material-threat RFP margin.
 * Local bounded implementations; no foreign tuned values or network weights.
 * Exact commits and retained notices are recorded in NOTICE.md.
 */
#ifndef KARSLI_ORANGE_H_INCLUDED
#define KARSLI_ORANGE_H_INCLUDED
#include <algorithm>

namespace Stockfish::Karsli {

// Complement, rather than replace, the existing piece/to/victim history.
// The worker-local entry is bounded by StatsEntry; maximum addition is 2048.
constexpr int capture_route_score(int entry, int weight) {
    return std::clamp(entry, -8192, 8192) * std::clamp(weight, 0, 256) / 1024;
}

// A constant bounded margin also protects non-improving material-threat nodes.
// This geometric signal is not a proof that a capture is legal or profitable.
constexpr int material_rfp_margin(bool threatened, int margin) {
    return threatened ? std::clamp(margin, 0, 64) : 0;
}

}  // namespace Stockfish::Karsli
#endif
