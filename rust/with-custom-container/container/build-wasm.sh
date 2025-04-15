#!/bin/bash

. /root/.cargo/env

RUSTFLAGS="-C panic=abort -Z emscripten-wasm-eh=yes" cargo +$RUST_TOOLCHAIN build \
  -Z build-std=std,panic_abort \
  --target $RUST_TARGET \
  --release

emcc \
  -s INITIAL_MEMORY=131072 \
  src/process.c \
  target/$RUST_TARGET/release/libprocess.a \
  -s EXPORTED_FUNCTIONS=_handle \
  -o src/process.mjs
