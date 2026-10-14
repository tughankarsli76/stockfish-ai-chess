#include <cassert>
#include <climits>
#include "source/src/karsli_pz.h"
#include "source/src/history.h"
using namespace Stockfish;
int main(){
 using namespace Karsli;
 assert(pz_control_index(Bitboard(0))==0);assert(pz_control_index(Bitboard(16381))==0);
 assert(pz_control_index(~Bitboard(0))<PzThreatBuckets);
 assert(pz_correction_delta(1024,256)==128);assert(pz_correction_delta(-1024,256)==-128);
 assert(pz_correction_delta(INT_MAX,INT_MAX)==128);assert(pz_correction_delta(INT_MIN,INT_MIN)==0);
 StatsEntry<i16,1024> entry;entry=0;for(int i=0;i<10000;i++){entry << 256;assert(int(entry)<=1024&&int(entry)>=-1024);}for(int i=0;i<10000;i++){entry << -256;assert(int(entry)<=1024&&int(entry)>=-1024);}
 for(int e=-1024;e<=1024;e++)for(int w=0;w<=256;w++){int d=pz_correction_delta(e,w);assert(d>=-128&&d<=128);}
}
