/* Triumviratus v6.0 TMv2 Q01-Q05 concepts, GPL-3.0-only.
 * Upstream Tors3/Triumviratus e75e7686f01e880ae731711bbd386da8c1e60f32.
 * Local bounded adaptation; Q07 root verification and TRANN1 are not implemented.
 * Upstream factor seeds are experimental, not calibrated for Karsli.
 */
#ifndef KARSLI_TRIUM_TIME_H_INCLUDED
#define KARSLI_TRIUM_TIME_H_INCLUDED
#include <algorithm>
#include <array>
#include <cmath>
#include <cstdint>
#include <limits>

namespace Stockfish::Karsli {
inline bool trium_time_gate(bool enabled, std::int64_t initialClock,
                            std::int64_t increment, std::int64_t minimum,
                            bool restrictedMode) {
    return enabled && !restrictedMode && increment > 0
        && initialClock >= std::max<std::int64_t>(0, minimum);
}

inline std::int64_t trium_time_optimum(std::int64_t remaining, std::int64_t increment,
                                      std::int64_t overhead, int ply, int movesToGo,
                                      std::int64_t maximum) {
    // Floating pool prevents overflow on adversarial signed-64 UCI clocks.
    const int horizon = movesToGo > 0 ? std::clamp(movesToGo, 1, 50)
      : std::max(14, 35 - int(67LL * (std::clamp(ply, 0, 10000) / 2 + 1) / 100));
    const long double pool = std::max(1.0L, static_cast<long double>(remaining)
      + static_cast<long double>(std::max<std::int64_t>(0, increment)) * (horizon - 1)
      - static_cast<long double>(std::max<std::int64_t>(0, overhead)) * (horizon + 2));
    const auto reserve = std::max<std::int64_t>(1, remaining
      - std::min(std::max<std::int64_t>(0, overhead), std::max<std::int64_t>(0, remaining)));
    const auto cap = std::max<std::int64_t>(1, std::min({maximum, reserve,
      std::numeric_limits<std::int64_t>::max() / 4}));
    const long double budget = std::clamp(pool * 1.24L / horizon, 1.0L,
                                          static_cast<long double>(cap));
    return static_cast<std::int64_t>(budget);
}

inline double trium_time_factor(int moveStability, int evalStability,
                                double bestNodeFraction) {
    constexpr std::array<double, 5> moves{2.32, 1.72, 0.82, 1.12, 0.56};
    constexpr std::array<double, 5> evals{1.39, 1.19, 1.01, 0.93, 0.88};
    if (!std::isfinite(bestNodeFraction)) bestNodeFraction = 0;
    const double nodes = std::clamp((1.55 - std::clamp(bestNodeFraction, 0.0, 1.0))
                                    * 1.30, 0.36, 2.63);
    return std::clamp(moves[std::clamp(moveStability, 0, 4)]
                      * evals[std::clamp(evalStability, 0, 4)] * nodes, 0.25, 4.0);
}

inline std::int64_t trium_prediction_budget(std::int64_t optimum, std::int64_t maximum,
                                           bool matched) {
    const auto cap = std::max<std::int64_t>(1, std::min(maximum,
      std::numeric_limits<std::int64_t>::max() / 4));
    return static_cast<std::int64_t>(std::clamp(static_cast<long double>(optimum)
      * (matched ? 0.945L : 1.157L), 1.0L, static_cast<long double>(cap)));
}
}
#endif
