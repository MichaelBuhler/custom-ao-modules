# rust/with-custom-container

This build process works by first building a custom Docker image, instead of using the [AO Dev CLI](https://github.com/permaweb/ao/tree/main/dev-cli#readme) or [the Docker image](https://hub.docker.com/r/p3rmaw3b/ao/tags) that it provides.

The custom build container will compile your Rust source files into a static library, then use Emscripten to link a final WASM binary that is compatible with [`ao-loader`](https://www.npmjs.com/package/@permaweb/ao-loader).

Modules built by code in this folder:

| AO Module ID | Size (bytes) | Published | AO Link |
| --- | --: | --- | --- |
| `_H4PSBNbZrdBt0G1CxJd0fNzI1kiT_9EojkAwiBqsjM` | 69,872 | 2024-04-15T11:19:18Z | [View](https://www.ao.link/#/module/_H4PSBNbZrdBt0G1CxJd0fNzI1kiT_9EojkAwiBqsjM) |

## pre-requisites

`docker` and `make`.

## build

```sh
make
```

## test

```sh
make test
```

# Implementation Notes

I could only figure out how to make this work for `wasm32`. The Rust compiler can target `wasm64-unknown-unknown`, but the resulting binary keeps calling `$abort` from a section of code called `$__rustc::__rg_oom`, so I think there is a problem with memory management if you don't target Emscripten.

Another challenge was that the Rust stdlib seems to use C++ style exception handling (`panic_unwind`) by default, but every version of AOS has been built from C and the AO Dev CLI added an import named `$__abort_js` with `Module-Format: wasm32-unknown-emscripten3`. The solution is to use Cargo with the `nightly` Rust toolchain to recompile the Rust stdlib from source, with support only for `panic_abort`, not `panic_unwind`. This removes enough undefined symbols (which end up as expected imports on the `env` module in the final binary) that the module can be loaded by `ao-loader` with `Module-Format: wasm32-unknown-emscripten4`. (Credit to @PeterFarber for setting me on the right trail with this.)

The last interesting bit is the way that Rust (always safely!) interfaces with C. It may be possible to compile Rust directly into the final binary without a C trampoline, but I didn't spend time on that. `ao-loader` is still passing the `msgJson` and `envJson` into C-land via the Emscripten stack. Borrowed references to those null-terminated C-style strings (which are on the Emscripten stack) are passed into Rust-land. Critically, the response from Rust (i.e. JSON-encoded outbox data) is passed back to C-land _also as a borrowed reference_ to a C-style string. This means that the string is still allocated within Rust's memory management when the main `handle()` function returns and the AO Message is done being evaluated. So this string gets de-allocated on the next invocation of `handle()`, i.e. when the next incoming AO Message is received.
