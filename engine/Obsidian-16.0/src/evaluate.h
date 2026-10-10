#pragma once

#include "position.h"

namespace Obsidian {

namespace Eval {

  /// <returns> A value relative to the side to move </returns>
  Score evaluate(Position& pos, bool isRootStm, NNUE::Accumulator& accumulator);
}
} // namespace Obsidian
