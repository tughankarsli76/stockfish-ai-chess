// SPDX-License-Identifier: AGPL-3.0-only
#include "../source/src/karsli_reckless.h"
#include <cassert>
#include <cmath>

int main() {
    using namespace Stockfish::Karsli;
    for (int r = -4096; r <= 16384; r += 7)
        for (int weight = 0; weight <= 1024; ++weight) {
            const int adjusted = protect_recapture(r, weight);
            assert(protect_recapture(r, 0) == r);
            if (r <= 0) assert(adjusted == r);
            else {
                assert(adjusted >= 0 && adjusted <= r);
                assert(r - adjusted <= 1024);
                assert(r / 1024 - adjusted / 1024 <= 1);
            }
        }
    for (int r : {-4096, -1, 0, 1, 1023, 1024, 4096, 16384})
        for (int weight = 0; weight <= 1024; ++weight)
            for (int delta : {-64000, -128, -1, 0, 1, 128, 64000}) {
                const int adjusted = improvement_reduction(r, delta, weight);
                if (r <= 0 || weight == 0 || delta == 0) assert(adjusted == r);
                else {
                    assert(adjusted >= 0 && std::abs(adjusted - r) <= 1024);
                    if (delta > 0) assert(adjusted <= r);
                    if (delta < 0) assert(adjusted >= r);
                }
            }
    for (int base = 1; base <= 245; ++base)
        for (int excess : {0, 1, 294, 295, 590, 30000}) {
            const int reduced = probcut_depth(base, excess);
            assert(reduced >= 0 && reduced <= base && base - reduced <= 2);
        }
    for (unsigned threads = 1; threads <= 1024; ++threads)
        for (unsigned percent = 1; percent <= 100; ++percent) {
            const unsigned threshold = soft_vote_threshold(threads, percent);
            assert(threshold >= 1 && threshold <= threads);
            assert(100 * threshold >= threads * percent);
            assert(threshold == 1 || 100 * (threshold - 1) < threads * percent);
        }
    for (int weight = 0; weight <= 1024; ++weight)
        for (int streak = 0; streak <= 256; ++streak) {
            const double factor = eval_stability_factor(streak, weight);
            assert(factor >= 0.879999 && factor <= 1.200001);
            assert(eval_stability_factor(streak, 0) == 1.0);
        }
    for (int depth = 1; depth <= 245; ++depth)
        for (int score : {-31000, -1, 0, 1, 31000}) {
            const auto packed = pack_root_stat(depth, score);
            assert(root_stat_score(packed) == score);
            assert((packed >> 32) == unsigned(depth));
            assert(pack_root_stat(depth + 1, -31000) > packed);
            assert(pack_root_stat(depth, score + 1) > packed);
        }
}
