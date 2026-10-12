// SPDX-License-Identifier: GPL-3.0-only
#include <cassert>
#include <climits>
#include "../source/src/karsli_orange.h"
using namespace Stockfish::Karsli;
int main() {
    for (int weight = 0; weight <= 256; ++weight)
        for (int entry = -8192; entry <= 8192; ++entry) {
            const int v = capture_route_score(entry, weight);
            assert(v >= -2048 && v <= 2048);
            assert(v == -capture_route_score(-entry, weight));
            assert(weight || !v);
        }
    for (const int entry : {INT_MIN, INT_MAX})
        for (const int weight : {INT_MIN, -1, 0, 128, 256, INT_MAX})
            assert(capture_route_score(entry, weight) >= -2048 && capture_route_score(entry, weight) <= 2048);
    for (const int margin : {INT_MIN, -1, 0, 32, 64, INT_MAX}) {
        assert(material_rfp_margin(false, margin) == 0);
        assert(material_rfp_margin(true, margin) >= 0 && material_rfp_margin(true, margin) <= 64);
    }
    // An increased margin may block an RFP cutoff; it can never create one.
    for (int excess = -100; excess <= 100; ++excess)
        for (int margin = 0; margin <= 64; ++margin)
            assert(!(excess >= material_rfp_margin(true, margin)) || excess >= 0);
}
