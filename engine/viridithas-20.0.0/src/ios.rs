// MIT. A serial command channel replaces stdin; output is delivered to the host.
use std::{cell::RefCell, ffi::{c_char, CStr}, sync::{mpsc, Mutex}, thread};
pub type Output = extern "C" fn(*const u8, usize);
static OUTPUT: Mutex<Option<Output>> = Mutex::new(None);
thread_local! { static LINE: RefCell<String> = const { RefCell::new(String::new()) }; }
pub fn output(text: String) {
    LINE.with(|buffer| {
        let mut buffer = buffer.borrow_mut();
        buffer.push_str(&text);
        while let Some(end) = buffer.find('\n') {
            let line: String = buffer.drain(..=end).collect();
            if let Some(callback) = *OUTPUT.lock().unwrap() { callback(line.as_ptr(), line.len()); }
        }
    });
}
pub struct Handle { sender: mpsc::Sender<String>, worker: Option<thread::JoinHandle<()>> }
#[unsafe(no_mangle)]
pub extern "C" fn viridithas_create(callback: Output) -> *mut Handle {
    *OUTPUT.lock().unwrap() = Some(callback);
    let (sender, receiver) = mpsc::channel();
    let worker = thread::Builder::new().name("viridithas-uci".into()).stack_size(16*1024*1024).spawn(move || {
        if let Err(error) = crate::uci::native_loop(receiver) { output(format!("info string Viridithas failed: {error}\n")); }
    }).unwrap();
    Box::into_raw(Box::new(Handle { sender, worker: Some(worker) }))
}
#[unsafe(no_mangle)]
pub unsafe extern "C" fn viridithas_command(handle: *mut Handle, text: *const c_char) {
    if let Ok(command) = unsafe { CStr::from_ptr(text) }.to_str() { let _ = unsafe { &*handle }.sender.send(command.into()); }
}
#[unsafe(no_mangle)]
pub unsafe extern "C" fn viridithas_destroy(handle: *mut Handle) {
    let mut handle = unsafe { Box::from_raw(handle) };
    let _ = handle.sender.send("quit".into());
    if let Some(worker) = handle.worker.take() { let _ = worker.join(); }
    *OUTPUT.lock().unwrap() = None;
}
