// MIT. iOS in-process transport; the upstream search and evaluation are unchanged.
#![allow(dead_code)]
macro_rules! print { ($($arg:tt)*) => { crate::ios::output(format!($($arg)*)) }; }
macro_rules! println {
    () => { crate::ios::output("\n".to_owned()) };
    ($($arg:tt)*) => { crate::ios::output(format!("{}\n", format_args!($($arg)*))) };
}
macro_rules! eprintln { ($($arg:tt)*) => { crate::ios::output(format!("{}\n", format_args!($($arg)*))) }; }
#[macro_use] mod macros;
mod bench;
mod chess;
mod cli;
mod cuckoo;
mod errors;
mod evaluation;
mod history;
mod historytable;
mod image;
mod lookups;
mod movepicker;
mod nnue;
mod perft;
mod rng;
mod search;
mod searchinfo;
mod stack;
mod tablebases;
mod term;
mod threadlocal;
mod threadpool;
mod timemgmt;
mod transpositiontable;
mod uci;
mod util;
pub mod ios;
pub static NAME: &str = "Viridithas";
pub static VERSION: &str = env!("CARGO_PKG_VERSION");
