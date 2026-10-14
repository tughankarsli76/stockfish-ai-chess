/*
 * Karsli experimental search adaptation, 2026-10-07.
 * SPDX-License-Identifier: GPL-3.0-only
 *
 * Inspired by Clover 9.1's check-aware late-move reduction,
 * authored by Luca Metehau (GPL-3.0-or-later).
 * This narrower adaptation protects only quiet checking moves and
 * cannot turn a positive reduction into a search extension.
 *
 * The depth-dependent deeper re-search margin is adapted from the idea
 * in PlentyChess 7.0.0 by Yoshie2000 and contributors (GPLv3), commit
 * e2060ab4b3021babb7d74af3cbe908154c03b2fd, src/search.cpp:1100.
 * Stockfish's base margin, integer depths and search bounds are retained.
 *
 * The alpha-raise counter idea comes from Pawnocchio 2.0.1 by
 * Jonathan Hallström (2025, GPL-3.0-or-later), src/Searcher.zig:
 * 1105, 1372, 1516. This adaptation protects existing extensions,
 * saturates the counter and caps the added reduction at one ply.
 */
#ifndef KARSLI_H_INCLUDED
#define KARSLI_H_INCLUDED

#include <algorithm>

namespace Stockfish::Karsli {

constexpr int protect_quiet_check(int reduction, int bonus, bool capture, bool givesCheck) {
    if (!capture && givesCheck && reduction > 0)
        return std::max(0, reduction - bonus);
    return reduction;
}

constexpr int deeper_margin(int childDepth, int slope) {
    return 53 + slope * std::max(0, childDepth);
}

constexpr int after_alpha_raises(int reduction, int coefficient, int raises) {
    if (reduction <= 0 || coefficient == 0 || raises <= 0)
        return reduction;
    const int bonus = std::min(1024, coefficient * std::clamp(raises, 0, 8));
    return reduction + bonus;
}

}  // namespace Stockfish::Karsli

#endif
