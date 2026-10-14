/* Tarnished v6.0 interaction LMR adaptation. SPDX-License-Identifier: GPL-3.0-only
 * Pinned commit3aab27b8012b862dc32663e2e65b1113e800e9d3; AGE conceptual credit.
 * Pair/triple coefficients retained from src/parameters.cpp. Local bounded blend
 * preserves Stockfish linear factors. These seeds are not trained for Karsli.
 */
#ifndef KARSLI_TARNISHED_H_INCLUDED
#define KARSLI_TARNISHED_H_INCLUDED
#include <algorithm>
#include <array>
#include <cstdint>
namespace Stockfish::Karsli {
inline constexpr std::array<int,28> TarnishedPairs = {235,-227,433,-177,-18,-1,16,-529,483,-47,267,-159,-188,155,-39,234,67,123,173,125,589,-628,672,-32,58,-193,-69,60};
inline constexpr std::array<int,56> TarnishedTriples = {-80,-556,90,-69,-325,-75,385,-399,-117,-208,-271,-164,516,70,115,47,-224,244,-423,-152,-245,-120,522,-99,271,123,106,-194,-720,-12,121,-286,-160,152,-176,297,-314,-237,-220,-68,-638,127,393,263,120,229,193,-151,-531,-55,-69,-44,365,-267,254,-34};
constexpr int tarnished_interaction(std::uint8_t mask) {
    int result=0, pair=0, triple=0;
    for(int i=0;i<8;i++)
        for(int j=i+1;j<8;j++) {
            const bool two=(mask & (1u<<i)) && (mask & (1u<<j));
            result+=TarnishedPairs[pair++] * int(two);
            for(int k=j+1;k<8;k++)
                result+=TarnishedTriples[triple++] * int(two && (mask & (1u<<k)));
        }
    return result;
}
constexpr int tarnished_lmr(int reduction, std::uint8_t mask, int weight) {
    if(reduction<=0 || weight<=0)return reduction;
    const int delta=std::clamp(tarnished_interaction(mask)*std::clamp(weight,0,256)/1024,-256,256);
    return int(std::min<std::int64_t>(2147483647,std::max<std::int64_t>(0,std::int64_t(reduction)+delta)));
}
}
#endif
