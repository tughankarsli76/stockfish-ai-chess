#include "../source/src/karsli_first10.h"
#include <cassert>
#include <climits>
#include <cstdint>

using namespace Stockfish::Karsli;
int main() {
    for (int weight = 0; weight <= 256; ++weight)
        for (int entry = -1024; entry <= 1024; ++entry) {
            const int delta = transition_delta(entry, weight);
            assert(delta >= -32 && delta <= 32);
            assert(delta == -transition_delta(-entry, weight));
            if (!weight) assert(delta == 0);
        }
    assert(transition_delta(INT_MAX, INT_MAX) == 32);
    assert(transition_delta(INT_MIN, INT_MAX) == -32);
    for (std::uint64_t key : {0ULL, 1ULL, 0x123456789abcdef0ULL, ~0ULL}) {
        assert(transition_index(key, key) == 0);
        assert(transition_index(key, ~key) < 4096);
        assert(transition_index(key, ~key) == transition_index(~key, key));
    }
    for (int depth = 0; depth <= 9; ++depth)
        for (bool enabled : {false, true})
            for (bool pv : {false, true})
                for (bool check : {false, true})
                    for (bool contested : {false, true})
                        for (int moves = 0; moves <= 4; ++moves)
                            for (int bonus : {-1, 0, 1, 100})
                                assert(suppress_shallow_quiet_bonus(enabled, depth, pv, check,
                                    moves, contested, bonus) == (enabled && depth >= 1
                                    && depth <= 3 && !pv && !check && moves == 1
                                    && !contested && bonus > 0));
    for (int reduction : {-1024, -1, 0, 1, 256, 1024, 4096})
        for (int correction : {INT_MIN, -13107200, 0, 13107200, INT_MAX})
            for (int eval : {INT_MIN, -1000, -64, 0, 64, 1000, INT_MAX})
                for (int weight = 0; weight <= 512; ++weight) {
                    const int result = relative_correction_reduction(reduction, correction,
                                                                      eval, weight);
                    if (!weight || reduction <= 0 || !correction)
                        assert(result == reduction);
                    else {
                        assert(result >= 0 && result <= reduction);
                        assert(reduction - result <= weight);
                    }
                }
    // Relative correction protection decreases as evaluation magnitude rises.
    assert(relative_correction_reduction(1024, 13107200, 0, 256)
           <= relative_correction_reduction(1024, 13107200, 1000, 256));
}
