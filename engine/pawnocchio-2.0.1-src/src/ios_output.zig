// GPL-3.0-or-later. In-process output for the iOS host, without stdio redirection.
const std = @import("std");
pub var callback: ?*const fn ([*]const u8, usize) callconv(.c) void = null;
var buffer: [4096]u8 = undefined;
pub var writer: std.Io.Writer = .{ .vtable = &.{ .drain = drain }, .buffer = &buffer };
fn emit(bytes: []const u8) void { if (callback) |cb| { if (bytes.len > 0) cb(bytes.ptr, bytes.len); } }
fn drain(w: *std.Io.Writer, data: []const []const u8, splat: usize) std.Io.Writer.Error!usize {
    emit(w.buffer[0..w.end]); w.end = 0;
    var count: usize = 0;
    for (data[0 .. data.len - 1]) |bytes| { emit(bytes); count += bytes.len; }
    for (0..splat) |_| { emit(data[data.len - 1]); count += data[data.len - 1].len; }
    return count;
}
