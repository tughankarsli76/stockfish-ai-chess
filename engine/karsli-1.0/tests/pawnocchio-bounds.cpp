// SPDX-License-Identifier: GPL-3.0-or-later
#include <cassert>
#include <cstdint>
#include <iostream>
#include "../source/src/karsli_pawnocchio.h"
using namespace Stockfish::Karsli;
int main() {
    // A geometric defence removes danger; no overlap with lesser-piece scores.
    for (int square = 0; square < 64; ++square) {
        const auto bit = std::uint64_t(1) << square;
        assert(pawnocchio_pawn_danger(bit, 0) == bit);
        assert(pawnocchio_pawn_danger(bit, bit) == 0);
        assert(pawnocchio_pawn_danger(0, bit) == 0);
    }
    for (int weight = 0; weight <= 1024; ++weight) {
        assert(pawnocchio_pawn_order(true, false, weight) == weight);
        assert(pawnocchio_pawn_order(false, true, weight) == -weight);
        assert(pawnocchio_pawn_order(false, false, weight) == 0);
        assert(pawnocchio_pawn_order(true, true, weight) == 0);
    }
    for (int depth = 1; depth <= 255; ++depth)
        for (int margin = 0; margin <= 512; ++margin) {
            const int boundary = 150 - 482 * depth * depth;
            // Strict inequality: at the protected boundary, full search stays.
            assert(!pawnocchio_razor_allowed(boundary - margin, 150, depth, margin, true));
            assert(pawnocchio_razor_allowed(boundary - margin - 1, 150, depth, margin, true));
            assert(pawnocchio_razor_allowed(boundary - 1, 150, depth, margin, false));
            assert(!pawnocchio_razor_allowed(boundary, 150, depth, margin, false));
        }
    std::cout << "Pawnocchio geometric danger, score signs and razor bounds passed\n";
}
