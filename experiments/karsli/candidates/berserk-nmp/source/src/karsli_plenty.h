/*
 * Karsli PlentyChess adaptations, 2026-10-11.
 * SPDX-License-Identifier: GPL-3.0-only
 * Adapted from PlentyChess 7.0.0 by Yoshie2000 and contributors,
 * commit e2060ab4b3021babb7d74af3cbe908154c03b2fd.
 * See NOTICE.md and licenses/PlentyChess-7.0.0-GPL-3.0.txt.
 * The complete engine also includes AGPLv3 Reckless components.
 */
#ifndef KARSLI_PLENTY_H_INCLUDED
#define KARSLI_PLENTY_H_INCLUDED

#include <algorithm>
#include <cstdint>
#include "position.h"

namespace Stockfish::Karsli {

// Geometric lower-value attacks, not a claim of legal/profitable captures.
constexpr std::uint64_t plenty_threat_targets(std::uint64_t minors,
  std::uint64_t rooks, std::uint64_t queens, std::uint64_t pawnAttacks,
  std::uint64_t minorAttacks, std::uint64_t rookAttacks) {
    return ((minors | rooks | queens) & pawnAttacks)
         | ((rooks | queens) & minorAttacks) | (queens & rookAttacks);
}

inline Bitboard plenty_material_threats(const Position& pos) {
    const Color us = pos.side_to_move(), them = ~us;
    return plenty_threat_targets(pos.pieces(us, KNIGHT, BISHOP),
      pos.pieces(us, ROOK), pos.pieces(us, QUEEN), pos.attacks_by<PAWN>(them),
      pos.attacks_by<KNIGHT>(them) | pos.attacks_by<BISHOP>(them),
      pos.attacks_by<ROOK>(them));
}

// Incremental protection avoids summing two bonuses for the same recapture.
constexpr int plenty_additional_capture_bonus(int bonus, int recaptureBonus) {
    return std::max(0, bonus - recaptureBonus);
}
constexpr int plenty_capture_reduction(int reduction, int bonus) {
    return reduction > 0 ? std::max(0, reduction - bonus) : reduction;
}

}  // namespace Stockfish::Karsli
#endif
