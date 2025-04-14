# lua

[Lua](https://lua.org/) is a lightweight, loosely-typed, scripting language whose interpreter is written in ANSI C.

This means Lua can be built to run almost anywhere, including inside of a WASM module. 

Lua has first-class support within the AO ecosystem, because [AOS](https://github.com/permaweb/aos) is implemented in Lua.

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
