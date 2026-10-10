#![allow(clippy::manual_is_multiple_of)]
#![allow(clippy::if_same_then_else)]
#![allow(unsafe_op_in_unsafe_fn)]

// iOS integration: route UCI output to the host, without redirecting process stdio.
macro_rules! print { ($($arg:tt)*) => { crate::ios::output(format!($($arg)*)) }; }
macro_rules! println {
    () => { crate::ios::output("\n".to_owned()) };
    ($($arg:tt)*) => { crate::ios::output(format!("{}\n", format_args!($($arg)*))) };
}
pub mod ios;
mod board;
mod evaluation;
mod history;
mod lookup;
mod misc;
mod movepick;
mod nnue;
mod numa;
mod parameters;
mod search;
mod stack;
mod thread;
mod threadpool;
mod time;
mod tools;
mod transposition;
mod types;
mod uci;

#[cfg(feature = "syzygy")]
mod tb;

#[cfg(feature = "syzygy")]
#[allow(warnings)]
mod bindings;
