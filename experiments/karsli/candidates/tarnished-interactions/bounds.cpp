#include <cassert>
#include <climits>
#include "source/src/karsli_tarnished.h"
using namespace Stockfish::Karsli;
int main(){
 assert(tarnished_interaction(0)==0);assert(tarnished_interaction(1)==0);
 assert(tarnished_interaction(3)==235);assert(tarnished_interaction(7)==235-227-529-80);
 for(int mask=0;mask<256;mask++)for(int weight=0;weight<=256;weight++)for(int r:{-4096,0,1,128,512,2048,INT_MAX}){
  const int out=tarnished_lmr(r,std::uint8_t(mask),weight);if(r<=0||weight==0)assert(out==r);else{assert(out>=0);assert(std::int64_t(out)-r<=256);assert(std::int64_t(out)-r>=-256);}
 }
}
