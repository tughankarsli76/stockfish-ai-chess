/*
 * Karsli Reckless adaptations, 2026-10-11.
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Adapted from Reckless 0.9.0 by codedeliveryservice and contributors,
 * commit 0e92358f5acd66e5ac77b1bf558202e47c515435 (AGPLv3).
 * See NOTICE.md and licenses/Reckless-0.9.0-AGPL-3.0.txt.
 * Original Stockfish components retain their GPL grants; GPLv3/AGPLv3
 * section 13 governs this combination. No Reckless network is imported.
 */
#ifndef KARSLI_RECKLESS_H_INCLUDED
#define KARSLI_RECKLESS_H_INCLUDED

#include <algorithm>
#include <array>
#include <cstdint>

namespace Stockfish::Karsli {

struct RecklessOptions {
    int  recaptureLMR = 0;
    bool recaptureExtension = false;
    bool nmpCaptureGuard = false;
    int  quietHistory = 0;
    int  captureHistory = 0;
    int  evalStability = 0;
    bool reverseQsearch = false;
    int  improvement = 0;
    bool adaptiveProbcut = false;
    int  softVotePercent = 0;
    bool depthVotes = false;
    bool sharedOptimism = false;
    bool diagnostics = false;
};

enum class RecklessEvent {
    RecaptureLMR, RecaptureExtension, NmpGuard, QuietHistory, CaptureHistory,
    EvalStability, ReverseQsearch, Improvement, ProbcutAdapt, ProbcutFallback,
    SoftVote, DepthVote, SharedRoot, Count
};

constexpr std::array<const char*, int(RecklessEvent::Count)> RecklessEventNames = {
    "recapture-lmr", "recapture-extension", "nmp-guard", "quiet-history",
    "capture-history", "eval-stability", "reverse-qsearch", "improvement",
    "probcut-adapt", "probcut-fallback", "soft-vote", "depth-vote", "shared-root"
};

// 1024 units per ply. Never introduce an extension or change an existing one.
constexpr int protect_recapture(int reduction, int bonus) {
    return reduction > 0 ? std::max(0, reduction - bonus) : reduction;
}

// A bounded continuous signal applied only to positive LMR, preserving zero.
constexpr int improvement_reduction(int reduction, int improvement, int weight) {
    if (reduction <= 0 || weight == 0)
        return reduction;
    const int adjustment = std::clamp(-std::clamp(improvement, -128, 128) * weight / 64,
                                      -1024, 1024);
    return std::max(0, reduction + adjustment);
}

constexpr int probcut_depth(int baseDepth, int excess) {
    return std::max(0, baseDepth - std::clamp(excess / 295, 0, 2));
}

inline double eval_stability_factor(int streak, int weight) {
    const double confidence = std::clamp(1.2 - 0.04 * std::clamp(streak, 0, 32), 0.88, 1.2);
    return 1.0 + (confidence - 1.0) * weight / 1024.0;
}

constexpr unsigned soft_vote_threshold(unsigned threads, unsigned percent) {
    return std::max(1u, (threads * percent + 99) / 100);
}

// Depth occupies the high word. Same-depth updates prefer the higher score.
constexpr std::uint64_t pack_root_stat(unsigned depth, int score) {
    return (std::uint64_t(depth) << 32) | std::uint32_t(score + 32768);
}
constexpr int root_stat_score(std::uint64_t stat) {
    return int(std::uint32_t(stat)) - 32768;
}

}  // namespace Stockfish::Karsli

#endif
