#pragma once

#include <algorithm>
#include <cstdint>
#include "../../simde-0.8.2/simde/x86/avx2.h"
#include "../../simde-0.8.2/simde/x86/fma.h"

namespace Obsidian {

namespace SIMD {

#if defined(__AVX512F__) && defined(__AVX512BW__)

  using VecI = simde__m512i;
  using VecF = simde__m512;

  constexpr int PackusOrder[8] = {0, 2, 4, 6, 1, 3, 5, 7};

  inline VecI addEpi16(VecI x, VecI y) { return simde_mm512_add_epi16(x, y); }

  inline VecI addEpi32(VecI x, VecI y) { return simde_mm512_add_epi32(x, y); }

  inline VecF addPs(VecF x, VecF y) { return simde_mm512_add_ps(x, y); }

  inline VecI subEpi16(VecI x, VecI y) { return simde_mm512_sub_epi16(x, y); }

  inline VecI minEpi16(VecI x, VecI y) { return simde_mm512_min_epi16(x, y); }

  inline VecI maxEpi16(VecI x, VecI y) { return simde_mm512_max_epi16(x, y); }

  inline VecI mulloEpi16(VecI x, VecI y) { return simde_mm512_mullo_epi16(x, y); }

  inline VecI maddEpi16(VecI x, VecI y) { return simde_mm512_madd_epi16(x, y); }

  inline VecI set1Epi16(int16_t x) { return simde_mm512_set1_epi16(x); }

  inline VecI set1Epi32(int x) { return simde_mm512_set1_epi32(x); }

  inline VecI setzeroSi() { return simde_mm512_setzero_si512(); }

  inline VecI maddubsEpi16(VecI x, VecI y) { return simde_mm512_maddubs_epi16(x, y); }

  inline VecI slliEpi16(VecI x, int y) { return simde_mm512_slli_epi16(x, y); }

  inline VecI mulhiEpi16(VecI x, VecI y) { return simde_mm512_mulhi_epi16(x, y); }

  inline VecI packusEpi16(VecI x, VecI y) { return simde_mm512_packus_epi16(x, y); }

  inline uint16_t getNnzMask(VecI x) { return simde_mm512_cmpgt_epi32_mask(x, simde_mm512_setzero_si512()); }

  inline VecF setzeroPs() { return simde_mm512_setzero_ps(); }

  inline VecF set1Ps(float x) { return simde_mm512_set1_ps(x); }

  inline VecF minPs(VecF x, VecF y) { return simde_mm512_min_ps(x, y); }
  
  inline VecF maxPs(VecF x, VecF y) { return simde_mm512_max_ps(x, y); }

  inline VecF mulPs(VecF x, VecF y) { return simde_mm512_mul_ps(x, y); }

  inline VecF mulAddPs(VecF x, VecF y, VecF z) { return simde_mm512_fmadd_ps(x, y, z); }

  inline VecF castEpi32ToPs(VecI x) { return simde_mm512_cvtepi32_ps(x); }

  inline float reduceAddPs(VecF vec) {
    return simde_mm512_reduce_add_ps(vec);
  }

#elif defined(__AVX2__) || defined(OBSIDIAN_IOS)

  using VecI = simde__m256i;
  using VecF = simde__m256;

  constexpr int PackusOrder[4] = {0, 2, 1, 3};

  inline VecI addEpi16(VecI x, VecI y) { return simde_mm256_add_epi16(x, y); }

  inline VecI addEpi32(VecI x, VecI y) { return simde_mm256_add_epi32(x, y); }

  inline VecF addPs(VecF x, VecF y) { return simde_mm256_add_ps(x, y); }

  inline VecI subEpi16(VecI x, VecI y) { return simde_mm256_sub_epi16(x, y); }

  inline VecI minEpi16(VecI x, VecI y) { return simde_mm256_min_epi16(x, y); }

  inline VecI maxEpi16(VecI x, VecI y) { return simde_mm256_max_epi16(x, y); }

  inline VecI mulloEpi16(VecI x, VecI y) { return simde_mm256_mullo_epi16(x, y); }

  inline VecI maddEpi16(VecI x, VecI y) { return simde_mm256_madd_epi16(x, y); }

  inline VecI set1Epi16(int16_t x) { return simde_mm256_set1_epi16(x); }

  inline VecI set1Epi32(int x) { return simde_mm256_set1_epi32(x); }

  inline VecI setzeroSi() { return simde_mm256_setzero_si256(); }

  inline VecI maddubsEpi16(VecI x, VecI y) { return simde_mm256_maddubs_epi16(x, y); }

  inline VecI slliEpi16(VecI x, int y) { return simde_mm256_sll_epi16(x, simde_mm_cvtsi32_si128(y)); }

  inline VecI mulhiEpi16(VecI x, VecI y) { return simde_mm256_mulhi_epi16(x, y); }

  inline VecI packusEpi16(VecI x, VecI y) { return simde_mm256_packus_epi16(x, y); }

  inline uint8_t getNnzMask(VecI x) {
    return simde_mm256_movemask_ps(simde_mm256_castsi256_ps(
              simde_mm256_cmpgt_epi32(x, simde_mm256_setzero_si256())));
  }

  inline VecF setzeroPs() { return simde_mm256_setzero_ps(); }

  inline VecF set1Ps(float x) { return simde_mm256_set1_ps(x); }

  inline VecF minPs(VecF x, VecF y) { return simde_mm256_min_ps(x, y); }
  
  inline VecF maxPs(VecF x, VecF y) { return simde_mm256_max_ps(x, y); }

  inline VecF mulPs(VecF x, VecF y) { return simde_mm256_mul_ps(x, y); }

  inline VecF mulAddPs(VecF x, VecF y, VecF z) { return simde_mm256_fmadd_ps(x, y, z); }

  inline VecF castEpi32ToPs(VecI x) { return simde_mm256_cvtepi32_ps(x); }

  inline float reduceAddPs(VecF vec) {
    simde__m128 sum_128 = simde_mm_add_ps(simde_mm256_castps256_ps128(vec), simde_mm256_extractf128_ps(vec, 1));

    simde__m128 upper_64 = simde_mm_movehl_ps(sum_128, sum_128);
    simde__m128 sum_64 = simde_mm_add_ps(sum_128, upper_64);

    simde__m128 upper_32 = simde_mm_shuffle_ps(sum_64, sum_64, 1);
    simde__m128 sum_32 = simde_mm_add_ss(sum_64, upper_32);

    return simde_mm_cvtss_f32(sum_32);
  }

#endif

  constexpr int Alignment = sizeof(VecI);

  inline VecI dpbusdEpi32(VecI sum, VecI x, VecI y) {
    VecI prod16 = maddubsEpi16(x, y);
    VecI prod32 = maddEpi16(prod16, set1Epi16(1));
    return addEpi32(sum, prod32);
  }

}
} // namespace Obsidian
