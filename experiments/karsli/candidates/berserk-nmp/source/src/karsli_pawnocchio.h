/*
 * Karsli Pawnocchio adaptations, 2026-10-11.
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Ideas from Pawnocchio 2.0.1, Jonathan Hallström and contributors,
 * commit 2903efa6652d1b00d0bdd2fb5983ba35165e9282.
 * See NOTICE.md and licenses/Pawnocchio-2.0.1-GPL-3.0.txt.
 * The complete engine also includes AGPLv3 Reckless components.
 */
#ifndef KARSLI_PAWNOCCHIO_H_INCLUDED
#define KARSLI_PAWNOCCHIO_H_INCLUDED

#include "karsli_plenty.h"

namespace Stockfish::Karsli {

// Board.zig:810 and Searcher.zig:939. Reuse the identical Plenty
// lower-value threat masks, but target their material with our attacks.
inline Bitboard pawnocchio_easy_targets(const Position& pos) {
    const Color us = pos.side_to_move(), them = ~us;
    return plenty_threat_targets(pos.pieces(them, KNIGHT, BISHOP),
      pos.pieces(them, ROOK), pos.pieces(them, QUEEN), pos.attacks_by<PAWN>(us),
      pos.attacks_by<KNIGHT>(us) | pos.attacks_by<BISHOP>(us),
      pos.attacks_by<ROOK>(us));
}

inline Bitboard pawnocchio_attacks(const Position& pos, Color side) {
    return pos.attacks_by<PAWN>(side) | pos.attacks_by<KNIGHT>(side)
         | pos.attacks_by<BISHOP>(side) | pos.attacks_by<ROOK>(side)
         | pos.attacks_by<QUEEN>(side) | pos.attacks_by<KING>(side);
}

constexpr std::uint64_t pawnocchio_pawn_danger(std::uint64_t enemyAttacks,
                                            std::uint64_t friendlyAttacks) {
    return enemyAttacks & ~friendlyAttacks;
}

constexpr int pawnocchio_pawn_order(bool fromDanger, bool toDanger, int weight) {
    return weight * (int(fromDanger) - int(toDanger));
}

// No extra search depth or direct evaluation bonus: only a bounded margin.
constexpr bool pawnocchio_razor_allowed(int eval, int alpha, int depth,
                                      int margin, bool easyTarget) {
    return eval + (easyTarget ? margin : 0) < alpha - 482 * depth * depth;
}

}  // namespace Stockfish::Karsli
#endif
