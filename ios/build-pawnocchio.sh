#!/bin/sh
set -eu
CHESS_ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
export ZIG_GLOBAL_CACHE_DIR="$CHESS_ROOT/ios/zig-cache"
case "${PLATFORM_NAME:-iphonesimulator}" in
 iphoneos) PAWN_TARGET=aarch64-ios.17.0 ;;
 iphonesimulator) PAWN_TARGET=aarch64-ios.17.0-simulator ;;
 *) exit 1 ;;
esac
cd "$CHESS_ROOT/engine/pawnocchio-2.0.1-src"
"$CHESS_ROOT/ios/zig-toolchain/zig" build -Dios=true -Dtarget="$PAWN_TARGET" -Doptimize=ReleaseFast -Duse_tbs=false --prefix "zig-out/$PAWN_TARGET"
# Repack Zig's archive with Apple's 8-byte Mach-O member alignment.
PAWN_PRODUCTS="${BUILT_PRODUCTS_DIR:-$CHESS_ROOT/ios/pawn-libs/$PAWN_TARGET}"
PAWN_OBJECTS="$CHESS_ROOT/engine/pawnocchio-2.0.1-src/zig-out/$PAWN_TARGET/apple-objects"
mkdir -p "$PAWN_PRODUCTS" "$PAWN_OBJECTS"
cd "$PAWN_OBJECTS"
if [ -f libpawnocchio_ios_zcu.o ]; then chmod u+rw ./*.o; fi
xcrun ar -x "../lib/libpawnocchio_ios.a" libpawnocchio_ios_zcu.o compiler_rt.o
chmod u+rw ./*.o
xcrun libtool -static -o "$PAWN_PRODUCTS/libpawnocchio_ios.a" ./*.o
