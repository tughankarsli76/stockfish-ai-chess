// SPDX-License-Identifier: GPL-3.0-only
#include <cassert>
#include <cstdint>
#include "../source/src/karsli_plenty.h"
using namespace Stockfish::Karsli;
int main() {
    for (int square=0; square<64; ++square) {
        const std::uint64_t bit=std::uint64_t(1)<<square;
        // Victims: minor, rook, queen. Attackers: pawn, minor, rook.
        const bool expected[3][3]={{true,false,false},{true,true,false},{true,true,true}};
        for (int victim=0; victim<3; ++victim) for (int attacker=0; attacker<3; ++attacker) {
            const auto targets=plenty_threat_targets(victim==0?bit:0,victim==1?bit:0,
                victim==2?bit:0,attacker==0?bit:0,attacker==1?bit:0,attacker==2?bit:0);
            assert(bool(targets)==expected[victim][attacker]);
        }
        assert(plenty_threat_targets(bit,bit,bit,~bit,~bit,~bit)==0);
        assert(plenty_threat_targets(0,0,0,bit,bit,bit)==0);
    }
    for (int bonus=0; bonus<=1024; ++bonus) {
        for (int recap: {0,256,512,1024}) for (int r: {-2048,-1,0,1,255,1024,4096}) {
            const int first=r>0?std::max(0,r-recap):r;
            const int actual=plenty_capture_reduction(first,plenty_additional_capture_bonus(bonus,recap));
            assert(actual==(r>0?std::max(0,r-std::max(bonus,recap)):r));
            if(r<=0)assert(actual==r);
            else assert(actual>=0&&actual<=r&&r-actual<=1024);
        }
        assert(plenty_capture_reduction(2048,bonus)==2048-bonus);
    }
}
