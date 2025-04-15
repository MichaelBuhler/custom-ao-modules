
use std::ffi::CString;
use std::os::raw::c_char;

// This function handles the incoming AO Message
#[unsafe(no_mangle)] // Ensure Rust function name is not mangled
pub extern "C" fn process_handle(_msg: *const c_char, _env: *const c_char) -> *const c_char {
    let ret = b"{\"ok\":true,\"response\":{\"Output\":\"Hello, world!\"}}";
    let cstr = unsafe { CString::from_vec_unchecked(ret.to_vec()) };
    let ptr = cstr.into_raw(); // this pointer must later be passed to `free_string()` below
    return ptr;
}

// This function is used by C to deallocate strings previously allocated by Rust
#[unsafe(no_mangle)] // Ensure Rust function name is not mangled
pub extern "C" fn free_string(ptr: *mut c_char) {
    unsafe { drop(CString::from_raw(ptr)) }; // Retake ownership and immediately drop it
}
