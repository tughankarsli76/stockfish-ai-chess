#include <cassert>
#include <limits>
#include "source/src/karsli_caissa.h"
using namespace Stockfish;
int main() {
    Karsli::CaissaNodeCache cache;
    const Move a = Move::make<NORMAL>(SQ_E2,SQ_E4), b = Move::make<NORMAL>(SQ_D2,SQ_D4);
    assert(!cache.find(0));cache.record(0,a,0);assert(!cache.find(0));
    cache.record(1,a,200);assert(cache.find(1)->score(1,a,4096)==0);
    cache.record(1,b,200);assert(cache.find(1)->score(1,a,1024)==512);
    assert(cache.find(1)->score(2,a,4096)==0);
    assert(cache.find(1)->score(1,a,-1)==0);assert(cache.find(1)->score(1,a,100000)==2048);
    const auto* stale=cache.find(1);cache.record(129,b,300);assert(!cache.find(1));assert(stale->score(1,a,1024)==0);
    cache.clear();assert(!cache.find(129));
    for(int i=0;i<3000;++i)cache.record(1,a,std::numeric_limits<u64>::max());
    assert(cache.find(1)->score(1,a,4096)==4096);assert(cache.find(1)->total < (u64(1)<<41));
    cache.clear();for(int i=1;i<65;++i)cache.record(1,Move(u16(i)),300);
    assert(cache.find(1)->total<=32*300);assert(cache.find(1)->score(1,Move(u16(60)),4096)==0);
    assert(sizeof(cache)<100000);
}
