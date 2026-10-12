// SPDX-License-Identifier: GPL-3.0-or-later
#include <cassert>
#include <climits>
#include <iostream>
#include "../source/src/karsli_coda_idea.h"
using namespace Stockfish::Karsli;
int main() {
    for (int margin = 0; margin <= 256; ++margin) {
        for (int difference = -257; difference <= 257; ++difference) {
            const bool near = coda_idea_near_alpha(1234 + difference, 1234, margin);
            assert(near == (margin > 0 && difference >= -margin && difference <= margin));
            for (int base : {2, 3, 8, 20, 67}) {
                assert(coda_idea_lmp_limit(base, false, near) == base);
                const int protectedLimit = coda_idea_lmp_limit(base, true, near);
                assert(protectedLimit >= base && protectedLimit <= base + 2);
                for (int count = 0; count <= base + 3; ++count) {
                    // The guard may postpone a trigger; it may never prune earlier.
                    assert(!(count < base && count >= protectedLimit));
                    assert(!(count >= base + 2 && count < protectedLimit));
                }
            }
        }
    }
    assert(!coda_idea_near_alpha(INT_MIN, INT_MAX, 256));
    assert(!coda_idea_near_alpha(INT_MAX, INT_MIN, 256));
    assert(coda_idea_near_alpha(INT_MIN, INT_MIN, 256));
    std::cout << "Independent LMP band, zero control and two-slot bounds passed\n";
}
