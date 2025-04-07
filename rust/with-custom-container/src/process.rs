
use std::ffi::CString;
use std::os::raw::c_char;

#[unsafe(no_mangle)] // Ensure Rust function name is not mangled
pub extern "C" fn process_handle(_msg: *const c_char, _env: *const c_char) -> *const c_char {
    let ret = b"{\"ok\":true,\"response\":{\"Output\":\"Hello, world!\"}}";
    let cstr = unsafe { CString::from_vec_unchecked(ret.to_vec()) };
    return cstr.into_raw(); // TODO: this is a memory leak
}
