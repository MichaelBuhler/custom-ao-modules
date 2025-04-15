# Rust

Rust, a modern classic.

[Rust](https://www.rust-lang.org/) is empowering everyone to build reliable and efficient software. In Cargo, it has a mature package manager and build tool.

Some support for Rust was added to the [AO Dev CLI](https://github.com/permaweb/ao/tree/main/dev-cli#readme) in August 2024, but it doesn't seem to be fully implemented (as of 2025-04-15).

Fortunately for you, `wasm32-unknown-emscripten` is a supported target of `rustc`, the Rust compiler.

You'll probably need to build a custom toolchain to compile your Rust source files into a static lib (WASM object file archive) then pass that to Emscripten to link your final binary.

What should you do?

- [Try another language.](../ADVENTURE.md)

- [Build a custom toolchain.](./with-custom-container/ADVENTURE.md)
  - _Build a Docker container that can compile Rust then link against it with Emscripten._
