/* Local Triumviratus v6.0 correction-disagreement RFP adaptation.
 * SPDX-License-Identifier: GPL-3.0-only
 * Upstream concept commit e75e7686f01e880ae731711bbd386da8c1e60f32.
 * Local normalization and bounded margin; no foreign tuning or network.
 */
#ifndef KARSLI_TRIUM_H_INCLUDED
#define KARSLI_TRIUM_H_INCLUDED
#include <algorithm>
namespace Stockfish::Karsli {
// Remove the different SF19 correction update-rate factors (128/150/186),
// then express the range in the pawn contribution's evaluation scale.
// This is a local disagreement heuristic, not calibrated prediction error.
constexpr int trium_disagreement(int pawn, int minor, int whiteNonPawn, int blackNonPawn) {
    pawn = std::clamp(pawn, -1024, 1024);
    minor = std::clamp(minor, -1024, 1024) * 128 / 150;
    const int nonPawn = (std::clamp(whiteNonPawn, -1024, 1024)
                      + std::clamp(blackNonPawn, -1024, 1024)) * 128 / (2 * 186);
    const int spread = std::max({pawn, minor, nonPawn}) - std::min({pawn, minor, nonPawn});
    return std::min(64, spread * 15341 / 131072);
}
constexpr int trium_rfp_margin(int disagreement, int weight) {
    return std::clamp(disagreement, 0, 64) * std::clamp(weight, 0, 128) / 128;
}
}
#endif
