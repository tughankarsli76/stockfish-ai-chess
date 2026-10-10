// AGPL-3.0. In-process iOS bridge; search and evaluation remain upstream.
use std::{cell::{RefCell, UnsafeCell}, ffi::{c_char, CStr}, sync::{Arc, Mutex, Once, atomic::Ordering}};
use crate::{thread::{SharedContext, Status}, uci::IosUci};
type Output = extern "C" fn(*const u8, usize);
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
// The C++ owner serializes command/destroy and joins the search before mutation.
// stop accesses only its independent shared Arc and atomic fields.
pub struct Handle { state: UnsafeCell<IosUci>, shared: Arc<SharedContext> }
#[unsafe(no_mangle)]
pub extern "C" fn reckless_create(callback: Output) -> *mut Handle {
    static INIT: Once = Once::new();
    INIT.call_once(|| { crate::lookup::initialize(); crate::nnue::initialize(); });
    *OUTPUT.lock().unwrap() = Some(callback);
    let state = IosUci::new();
    Box::into_raw(Box::new(Handle { shared: state.shared.clone(), state: UnsafeCell::new(state) }))
}
#[unsafe(no_mangle)]
pub unsafe extern "C" fn reckless_command(handle: *mut Handle, text: *const c_char) {
    if let Ok(command) = unsafe { CStr::from_ptr(text) }.to_str() {
        unsafe { &mut *(*handle).state.get() }.command(command);
    }
}
#[unsafe(no_mangle)]
pub unsafe extern "C" fn reckless_prepare(handle: *mut Handle) {
    unsafe { &*handle }.shared.ios_cancelled.store(false, Ordering::Release);
}
#[unsafe(no_mangle)]
pub unsafe extern "C" fn reckless_stop(handle: *mut Handle) {
    let shared = &unsafe { &*handle }.shared;
    shared.ios_cancelled.store(true, Ordering::Release);
    shared.status.set(Status::STOPPED);
}
#[unsafe(no_mangle)]
pub unsafe extern "C" fn reckless_destroy(handle: *mut Handle) {
    drop(unsafe { Box::from_raw(handle) });
    *OUTPUT.lock().unwrap() = None;
}
