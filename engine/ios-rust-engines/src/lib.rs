// AGPL-3.0-or-later. One Rust runtime for all three in-process engines.
pub use reckless_ios;
pub use viridithas;
use cinder::uci::{Outbound, Uci, UciParser};
use futures::{channel::mpsc::{unbounded, UnboundedSender}, executor::block_on, sink::unfold, StreamExt};
use std::{ffi::{c_char, CStr}, future::ready, thread};
type Output = extern "C" fn(*const u8, usize);
#[used]
static KEEP_RECKLESS: extern "C" fn(Output) -> *mut reckless_ios::ios::Handle = reckless_ios::ios::reckless_create;
#[used]
static KEEP_VIRIDITHAS: extern "C" fn(Output) -> *mut viridithas::ios::Handle = viridithas::ios::viridithas_create;
pub struct CinderHandle { sender: UnboundedSender<String>, worker: Option<thread::JoinHandle<()>> }
#[unsafe(no_mangle)]
pub extern "C" fn cinder_create(callback: Output) -> *mut CinderHandle {
    let (sender, commands) = unbounded();
    let worker = thread::Builder::new().name("cinder-uci".into()).stack_size(16*1024*1024).spawn(move || {
        // Parsing a position constructs a large evaluator. Never run that parser
        // on the iOS dispatch queue's small stack, including non-position commands.
        let input = commands.filter_map(|command: String| ready(UciParser.parse(&command).ok())).fuse();
        let output = unfold((), move |_, value: Outbound| {
            let line = format!("{value}\n");
            callback(line.as_ptr(), line.len());
            ready(Ok::<(), std::convert::Infallible>(()))
        });
        let _ = block_on(Uci::new(input, output).run());
    }).unwrap();
    Box::into_raw(Box::new(CinderHandle { sender, worker: Some(worker) }))
}
#[unsafe(no_mangle)]
pub unsafe extern "C" fn cinder_command(handle: *mut CinderHandle, text: *const c_char) {
    if let Ok(command) = unsafe { CStr::from_ptr(text) }.to_str() {
        let _ = unsafe { &*handle }.sender.unbounded_send(command.to_owned());
    }
}
#[unsafe(no_mangle)]
pub unsafe extern "C" fn cinder_destroy(handle: *mut CinderHandle) {
    let mut handle = unsafe { Box::from_raw(handle) };
    let _ = handle.sender.unbounded_send("quit".to_owned());
    if let Some(worker) = handle.worker.take() { let _ = worker.join(); }
}
