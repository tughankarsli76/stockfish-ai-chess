# Pawnocchio 2.0.1 iOS integration

Official release source: https://github.com/JonathanHallstrom/pawnocchio/tree/v2.0.1
Preserve the GPL-3.0-or-later LICENSE, corresponding modified source, network
source and these build instructions with distributions.

## Pinned network

The release pins pawnocchio-nets commit bbaf11347430bfedbf27461a1c3c2b360aa5e930.
Fetch https://raw.githubusercontent.com/JonathanHallstrom/pawnocchio-nets/bbaf11347430bfedbf27461a1c3c2b360aa5e930/networks/pp_new2.nnue
into pawnocchio-nets/networks/pp_new2.nnue beneath this directory.
SHA-256: 8b1d78b2908d330ace30ab69c3679a44db8176e0d6bf4116b60da8c383a4bc17
The upstream transform-net build step prepares the ARM network, embedded in the
static library; there are no runtime downloads or external engine services.

## Reproducible build

Install the official Zig 0.16.0 ARM64 macOS distribution in ios/zig-toolchain.
This is project-local and does not modify shell profiles or global tools.
Xcode runs ios/build-pawnocchio.sh with the current PLATFORM_NAME. It builds
ReleaseFast with -Dios=true, -Duse_tbs=false and target aarch64-ios.17.0 or
aarch64-ios.17.0-simulator. Global Zig cache is local at ios/zig-cache.

The script repacks Zig's static archive with Apple's ar/libtool for the 8-byte
Mach-O member alignment required by the Xcode linker. The upstream network and
tuning generation steps are retained. No external package dependencies.

## Local changes

- build.zig adds an optional iOS static library target with version 2.0.1.
- src/ios.zig provides a serialized C ABI command adapter for the app's supported
  UCI commands, reusing upstream board parsing, options, limits and search.
  It selects Zig simple_panic to avoid desktop-only dyld stack introspection.
- src/ios_output.zig supplies a callback-backed Zig Writer; root.zig selects it
  on iOS without redirecting process stdin/stdout.
- The C++ PawnocchioBackend forwards commands on the existing native queue.
  Searches stop and drain before configuration, switching or destruction.
- Lookup tables, embedded weights and the Zig I/O context initialize once.
  Per-engine search workers, hash tables and histories are released on switching
  and reinitialized when Pawnocchio is selected again.
- Search logic, evaluation weights and tuning remain unchanged. The adapter
  accepts no-increment clocks using upstream standard time management (equivalent
  to enabling EnableWeirdTCs). Tablebases and NUMA are disabled.

## UI capabilities

Pawnocchio 2.0.1 has no MultiPV or Skill Level UCI option: the host requests one
analysis line and shows Full strength. It supports native UCI_ShowWDL, Threads,
Hash and timed/infinite analysis. Other installed engines retain their existing
multi-line analysis. No loading messages are added. Minimize stops thinking.

## Network licensing notice

The exact pinned network repository provides CC BY-SA 4.0, retained in pawnocchio-nets/LICENSE and NOTICE.txt. This is separate from the GPL engine code and assets/LICENSE. The app bundle retains these notices and displays them in About & Credits.
