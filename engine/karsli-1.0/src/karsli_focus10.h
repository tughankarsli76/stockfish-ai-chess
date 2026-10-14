/* Local bounded adaptations of public PlentyChess 7, Alexandria 9 and
 * Stormphrax 8 search concepts. SPDX-License-Identifier: GPL-3.0-only
 * Source pins and licenses: experiments/karsli/reports/focus10/source-index.json.
 * No foreign networks or tuned coefficient tables are imported.
 */
#ifndef KARSLI_FOCUS10_H_INCLUDED
#define KARSLI_FOCUS10_H_INCLUDED
#include <algorithm>
#include <array>
#include <cstdint>
namespace Stockfish::Karsli {
constexpr unsigned major_pattern_index(const std::array<std::uint64_t, 6>& pieces) {
    std::uint64_t hash = 0;
    for (auto bits : pieces) {
        hash ^= bits;
        hash = ((hash << 7) | (hash >> 57)) * UINT64_C(0x9e3779b97f4a7c15);
    }
    return unsigned((hash ^ (hash >> 32)) & 4095);
}
constexpr int major_pattern_delta(int entry, int weight) {
    return std::clamp(entry, -1024, 1024) * std::clamp(weight, 0, 256) / 4096;
}
constexpr int eval_complexity_reduction(int reduction, int raw, int adjusted, int weight) {
    if (reduction <= 0 || weight <= 0 || raw == 0 || adjusted == 0) return reduction;
    const std::int64_t delta = std::int64_t(raw) - adjusted;
    const std::int64_t magnitude = adjusted < 0 ? -std::int64_t(adjusted) : adjusted;
    const auto ratio = std::min<std::int64_t>(1024,
      (delta < 0 ? -delta : delta) * 1024 / std::max<std::int64_t>(64, magnitude));
    return std::max(0, reduction - int(ratio * std::clamp(weight, 0, 512) / 1024));
}
constexpr bool shallow_tt_extension(bool enabled, int depth, int ply, int rootDepth,
                                     bool inCheck, bool root, bool excluded, bool quiet,
                                     bool lowerBound, int ttDepth, int eval, int alpha) {
    return enabled && depth >= 3 && depth <= 7 && !inCheck && !root && !excluded
      && quiet && lowerBound && ttDepth >= depth - 3
      && std::int64_t(ply) + depth < std::int64_t(rootDepth) + 2
      && std::int64_t(eval) <= std::int64_t(alpha) - 128;
}
}
#endif
