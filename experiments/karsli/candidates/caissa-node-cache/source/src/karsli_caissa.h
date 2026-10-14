/* Local Caissa 2.0 node-effort quiet-ordering adaptation.
 * Copyright (c) 2021 Michał Witanowski (upstream concept, MIT).
 * Local implementation GPL-3.0-only; combined engine includes AGPL components.
 * See candidate Caissa-LICENSE and inherited NOTICE records.
 */
#ifndef KARSLI_CAISSA_H_INCLUDED
#define KARSLI_CAISSA_H_INCLUDED
#include <algorithm>
#include <array>
#include "types.h"
namespace Stockfish::Karsli {
class CaissaNodeCache {
 public:
    struct Entry {
        Key key = 0;
        bool valid = false;
        u64 total = 0;
        struct Item { Move move = Move::none(); u64 nodes = 0; };
        std::array<Item, 32> moves{};
        int score(Key expected, Move move, int weight) const {
            if (!valid || key != expected || total <= 256) return 0;
            for (const auto& item : moves)
                if (item.move == move)
                    return int(u64(std::clamp(weight, 0, 4096)) * item.nodes / total);
            return 0;
        }
    };
    void clear() { entries = {}; }
    const Entry* find(Key key) const {
        const auto& e = entries[index(key)];
        return e.valid && e.key == key ? &e : nullptr;
    }
    void record(Key key, Move move, u64 nodes) {
        if (!move.is_ok() || !nodes) return;
        auto& e = entries[index(key)];
        if (!e.valid || e.key != key) { e = {}; e.key = key; e.valid = true; }
        // Bound the sum and multiplication even for arbitrarily long searches.
        if (e.total > (u64(1) << 40)) {
            e.total = 0;
            for (auto& item : e.moves) { item.nodes /= 2; e.total += item.nodes; }
        }
        nodes = std::min(nodes, u64(1) << 30);
        for (auto& item : e.moves)
            if (item.move == move || !item.move.is_ok()) {
                item.move = move; item.nodes += nodes; e.total += nodes; return;
            }
    }
 private:
    static usize index(Key key) { return usize((key ^ (key >> 32)) & 127); }
    std::array<Entry, 128> entries{};
};
}
#endif
