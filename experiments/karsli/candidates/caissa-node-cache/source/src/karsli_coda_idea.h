/*
 * Karsli independent margin-aware LMP experiment, 2026-10-11.
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Motivation: public Coda 0.9.4 release description by Adam Twiss.
 * No Coda implementation, formula, tuned table or network was used.
 * This local rule extends Stockfish's existing move-count threshold.
 * See NOTICE.md and reports/coda-0.9.4-review/ANALIZ.md.
 * The complete engine also includes AGPLv3 Reckless components.
 */
#ifndef KARSLI_CODA_IDEA_H_INCLUDED
#define KARSLI_CODA_IDEA_H_INCLUDED

#include <cstdint>

namespace Stockfish::Karsli {

// A symmetric alpha proximity band. At most two extra move-count slots;
// this does not promise either slot survives the other pruning filters.
constexpr bool coda_idea_near_alpha(int eval, int alpha, int margin) {
    const std::int64_t difference = std::int64_t(eval) - alpha;
    return margin > 0 && difference >= -margin && difference <= margin;
}
constexpr int coda_idea_lmp_limit(int baseLimit, bool eligible, bool nearAlpha) {
    return baseLimit + (eligible && nearAlpha ? 2 : 0);
}

}  // namespace Stockfish::Karsli
#endif
