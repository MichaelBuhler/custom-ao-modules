# rust

[Rust](https://www.rust-lang.org/) is a systems programming language focused on safety, speed, and concurrency, with strict memory management and no garbage collector.

The Rust compiler (and Cargo) supports wasm32 and wasm64 as build targets, with explicit support for the Emscripten runtime (`wasm32-unknown-emscripten`).

The [Makefile](./Makefile) in this folder will make all child folders.

## pre-requisites

`docker` and `make`.

## build all

```sh
make
```

## test all

```sh
make test
```
