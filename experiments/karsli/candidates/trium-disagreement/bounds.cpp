#include <cassert>
#include <climits>
#include "source/src/karsli_trium.h"
using namespace Stockfish::Karsli;
int main(){
 assert(trium_disagreement(0,0,0,0)==0);assert(trium_disagreement(128,150,186,186)==0);
 assert(trium_disagreement(-128,-150,-186,-186)==0);
 assert(trium_disagreement(1024,-1024,-1024,-1024)==64);
 assert(trium_disagreement(INT_MAX,INT_MIN,INT_MAX,INT_MIN)<=64);
 assert(trium_rfp_margin(64,128)==64);assert(trium_rfp_margin(64,64)==32);
 assert(trium_rfp_margin(64,0)==0);assert(trium_rfp_margin(-1,128)==0);
 for(int a=-1024;a<=1024;a+=31)for(int b=-1024;b<=1024;b+=31){int d=trium_disagreement(a,b,-a,b);assert(d>=0&&d<=64);for(int w=-1;w<=129;w++){int m=trium_rfp_margin(d,w);assert(m>=0&&m<=64);}}
}
