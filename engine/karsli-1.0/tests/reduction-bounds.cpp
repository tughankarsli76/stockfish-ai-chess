// SPDX-License-Identifier: GPL-3.0-or-later
#include "../source/src/karsli.h"
#include <cassert>
#include <array>

int main() {
    using Stockfish::Karsli::protect_quiet_check;
    using Stockfish::Karsli::deeper_margin;
    using Stockfish::Karsli::after_alpha_raises;
    // Cover positive, zero and existing negative reductions at every legal
    // option value. The experiment must never add a new extension or alter
    // captures/non-checks, and zero must restore the upstream reduction.
    for (int reduction = -4096; reduction <= 16384; reduction += 13)
        for (int bonus = 0; bonus <= 1024; ++bonus)
        {
            assert(protect_quiet_check(reduction, bonus, true, true) == reduction);
            assert(protect_quiet_check(reduction, bonus, false, false) == reduction);
            assert(protect_quiet_check(reduction, 0, false, true) == reduction);
            const int adjusted = protect_quiet_check(reduction, bonus, false, true);
            if (reduction <= 0)
                assert(adjusted == reduction);
            else
            {
                assert(adjusted >= 0 && adjusted <= reduction);
                assert(reduction - adjusted <= bonus);
                if (bonus < 1024)
                    assert(protect_quiet_check(reduction, bonus + 1, false, true) <= adjusted);
            }
        }
    // Integer-depth boundaries: a half-ply bonus can remove at most one ply
    // of positive reduction, never increase it, for the full covered range.
    for (int reduction = 1; reduction <= 16384; ++reduction)
    {
        const int adjusted = protect_quiet_check(reduction, 512, false, true);
        const int difference = reduction / 1024 - adjusted / 1024;
        assert(difference >= 0 && difference <= 1);
    }

    // SF19 caps parent depth at 245; its existing singular extensions can
    // make this child depth 247. Cover all legal slopes and negative depth
    // sentinels. A positive slope can only make an extra extension harder
    // to earn; zero must leave the original threshold exactly unchanged.
    for (int depth = -10; depth <= 247; ++depth)
        for (int slope = 0; slope <= 4; ++slope)
        {
            const int margin = deeper_margin(depth, slope);
            assert(deeper_margin(depth, 0) == 53);
            assert(margin >= 53 && margin <= 1041);
            if (depth <= 0)
                assert(margin == 53);
            if (depth < 247)
                assert(deeper_margin(depth + 1, slope) >= margin);
            if (slope < 4)
                assert(deeper_margin(depth, slope + 1) >= margin);
        }
    static_assert(deeper_margin(4, 2) == 61);
    static_assert(deeper_margin(12, 2) == 77);

    // A new signal may increase positive reductions by at most one ply.
    // It must preserve existing extensions, the exact zero control and
    // the zero-raise case. Exhaust every legal coefficient and cover
    // saturated/out-of-range counter inputs to verify the hard budget.
    constexpr std::array<int, 7> reductions = {-4096, -1, 0, 1, 1023, 1024, 16384};
    for (const int reduction : reductions)
        for (int coefficient = 0; coefficient <= 256; ++coefficient)
            for (int raises = -1; raises <= 256; ++raises)
            {
                const int adjusted = after_alpha_raises(reduction, coefficient, raises);
                if (reduction <= 0 || coefficient == 0 || raises <= 0)
                    assert(adjusted == reduction);
                else
                {
                    assert(adjusted >= reduction && adjusted - reduction <= 1024);
                    assert(adjusted / 1024 - reduction / 1024 <= 1);
                    if (raises >= 8)
                        assert(adjusted == after_alpha_raises(reduction, coefficient, 8));
                    assert(after_alpha_raises(reduction, coefficient, raises + 1) >= adjusted);
                }
            }
    static_assert(after_alpha_raises(-1, 256, 8) == -1);
    static_assert(after_alpha_raises(1024, 128, 1) == 1152);
    static_assert(after_alpha_raises(1024, 256, 8) == 2048);
}
