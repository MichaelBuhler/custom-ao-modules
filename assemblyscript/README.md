# assemblyscript

[AssemblyScript](https://www.assemblyscript.org/) uses TypeScript syntax, but is similar to C++ with its low-level types and memory management.

Since there are no known CU's that can load WASM modules that use AssemblyScript runtimes, you will have to [mock the Emscripten runtime](./mock-emscripten).

The [Makefile](./Makefile) in this folder will make all child folders.

## pre-requisites

`node`, `npm`, and `make`.

## build all

```sh
make
```

## test all

```sh
make test
```
