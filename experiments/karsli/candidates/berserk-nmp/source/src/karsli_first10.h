/*
 * Karsli first-ten research adaptations, 2026-10-11.
 * SPDX-License-Identifier: GPL-3.0-only
 * Cinder 0.6.1 (Bruno Dutra): one-ply transition correction concept.
 * Obsidian 16 (Gabriele Lombardo), with its Ethereal credit: shallow-history gate.
 * Alexandria 9 (PGG106 and contributors): relative correction LMR concept.
 * Local bounded integer implementations; no foreign tuned values or networks.
 * Exact inspected commits and retained licenses are recorded in NOTICE.md.
 */
#ifndef KARSLI_FIRST10_H_INCLUDED
#define KARSLI_FIRST10_H_INCLUDED

#include <algorithm>
#include <cstdint>

namespace Stockfish::Karsli {

constexpr unsigned transition_index(std::uint64_t current, std::uint64_t previous) {
    const auto delta = current ^ previous;
    return unsigned((delta ^ (delta >> 32)) & 4095);
}

// At maximum entry/weight, contribute at most 32 internal evaluation units.
constexpr int transition_delta(int entry, int weight) {
    return std::clamp(entry, -1024, 1024) * std::clamp(weight, 0, 256) / 8192;
}

constexpr bool suppress_shallow_quiet_bonus(bool enabled, int depth, bool pv,
                                           bool inCheck, int moveCount,
                                           bool otherMovesSearched, int bonus) {
    return enabled && depth >= 1 && depth <= 3 && !pv && !inCheck
        && moveCount == 1 && !otherMovesSearched && bonus > 0;
}

// Relative learned-correction signal, not calibrated uncertainty. The floor
// prevents near-zero evaluations from producing an unbounded ratio. Preserve
// zero/negative LMR and cap the discount at the configured half-ply maximum.
constexpr int relative_correction_reduction(int reduction, int correction,
                                            int evaluation, int weight) {
    if (reduction <= 0 || weight <= 0)
        return reduction;
    const std::int64_t cv = correction;
    const std::int64_t ev = evaluation;
    const auto magnitude = (cv < 0 ? -cv : cv) / 131072;
    const auto denominator = 64 + (ev < 0 ? -ev : ev);
    const auto ratio = std::min<std::int64_t>(1024, magnitude * 1024 / denominator);
    const int discount = int(ratio * std::clamp(weight, 0, 512) / 1024);
    return std::max(0, reduction - discount);
}

}  // namespace Stockfish::Karsli
#endif
