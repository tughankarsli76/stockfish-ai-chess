// GPL-3.0-or-later. The native command queue serializes all exported calls.
const std = @import("std");
pub const panic = std.debug.simple_panic; // Avoid desktop-only dyld stack introspection on iOS.
const root = @import("root.zig");
const output = @import("ios_output.zig");
var threaded_io: std.Io.Threaded = undefined;
var initialized = false;
var active = false;
var board: root.Board = undefined;
var show_wdl = false;
export fn pawnocchio_create(callback: *const fn ([*]const u8, usize) callconv(.c) void) bool {
    output.callback = callback;
    if (!initialized) {
        threaded_io = std.Io.Threaded.init(std.heap.c_allocator, .{});
        root.init(threaded_io.io());
        initialized = true;
    } else root.engine.init(root.io) catch return false;
    active = true;
    board = root.Board.startpos(); show_wdl = false;
    return true;
}
export fn pawnocchio_stop() void {
    if (!active) return;
    root.engine.stopSearch(); root.engine.waitUntilDoneSearching();
}
export fn pawnocchio_destroy() void {
    if (!active) return;
    pawnocchio_stop(); root.engine.deinit(); active = false; output.callback = null;
}
export fn pawnocchio_command(text: [*:0]const u8) bool {
    command(std.mem.span(text)) catch return false;
    return true;
}
fn command(line: []const u8) !void {
    pawnocchio_stop();
    var parts = std.mem.tokenizeScalar(u8, line, ' ');
    const cmd = parts.next() orelse return;
    if (std.mem.eql(u8, cmd, "uci")) {
        root.write("id name pawnocchio 2.0.1\nid author Jonathan Hallstrom\noption name Hash type spin default 16 min 1 max 128\noption name Threads type spin default 1 min 1 max 2\noption name UCI_ShowWDL type check default false\nuciok\n", .{});
    } else if (std.mem.eql(u8, cmd, "isready")) {
        root.write("readyok\n", .{});
    } else if (std.mem.eql(u8, cmd, "ucinewgame")) {
        root.engine.reset(); board = root.Board.startpos();
    } else if (std.mem.eql(u8, cmd, "setoption")) {
        _ = parts.next(); const name = parts.next() orelse return;
        _ = parts.next(); const value = parts.next() orelse return;
        if (std.mem.eql(u8, name, "Threads")) try root.engine.setThreadCount(try std.fmt.parseInt(usize, value, 10));
        if (std.mem.eql(u8, name, "Hash")) try root.engine.setTTSize(try std.fmt.parseInt(usize, value, 10));
        if (std.mem.eql(u8, name, "UCI_ShowWDL")) show_wdl = std.mem.eql(u8, value, "true");
    } else if (std.mem.eql(u8, cmd, "position")) {
        const mode = parts.next() orelse return;
        if (std.mem.eql(u8, mode, "fen")) board = try root.Board.parseFen(parts.rest(), false);
    } else if (std.mem.eql(u8, cmd, "go")) {
        var times: [2]u64 = .{1_000_000_000 * std.time.ns_per_s} ** 2;
        var incs: [2]u64 = .{0} ** 2;
        var move_time: ?u64 = null;
        while (parts.next()) |key| {
            if (std.mem.eql(u8, key, "infinite")) break;
            const value = (try std.fmt.parseInt(u64, parts.next() orelse return, 10)) * std.time.ns_per_ms;
            if (std.mem.eql(u8, key, "movetime")) move_time = value;
            if (std.mem.eql(u8, key, "wtime")) times[0] = value;
            if (std.mem.eql(u8, key, "btime")) times[1] = value;
            if (std.mem.eql(u8, key, "winc")) incs[0] = value;
            if (std.mem.eql(u8, key, "binc")) incs[1] = value;
        }
        const stm = board.stm.toInt();
        const limits = if (move_time) |ns| root.Limits.initFixedTime(root.io, ns) else root.Limits.initStandard(root.io, &board, times[stm], incs[stm], 10 * std.time.ns_per_ms);
        root.engine.startSearch(.{ .search_params = .{
            .board = board, .limits = limits,
            .previous_positions = try root.BoundedArray(root.Board, 200).fromSlice(&.{board}),
            .previous_moves = .{}, .contempt = 0, .normalize = true, .minimal = false, .show_wdl = show_wdl,
        } });
    }
}
