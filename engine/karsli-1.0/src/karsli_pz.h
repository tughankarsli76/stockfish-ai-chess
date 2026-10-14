/* Side-control correction adapted from PZChessBot v7.1.
 * Copyright (C) 2026 Kevin Lu and William Ma (upstream).
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Local bounded implementation; retained license in PZChessBot-LICENSE.
 */
#ifndef KARSLI_PZ_H_INCLUDED
#define KARSLI_PZ_H_INCLUDED
#include <algorithm>
#include "position.h"
namespace Stockfish::Karsli {
constexpr usize PzThreatBuckets = 16381;
constexpr usize pz_control_index(Bitboard control) { return usize(control % PzThreatBuckets); }
inline usize pz_control_index(const Position& pos) {
    const Color us = pos.side_to_move();
    const Bitboard control = pos.attacks_by<PAWN>(us) | pos.attacks_by<KNIGHT>(us)
      | pos.attacks_by<BISHOP>(us) | pos.attacks_by<ROOK>(us)
      | pos.attacks_by<QUEEN>(us) | pos.attacks_by<KING>(us);
    return pz_control_index(control);
}
constexpr int pz_correction_delta(int entry, int weight) {
    return std::clamp(entry, -1024, 1024) * std::clamp(weight, 0, 256) / 2048;
}
}
#endif
