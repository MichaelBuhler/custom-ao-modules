# c

The [C programming language](https://www.c-language.org/). You know what it is.

Since the AO Dev CLI is currently (as of 2025-04-17) broken for C language projects until https://github.com/permaweb/ao/issues/1205 is fixed, you will have to [use `emsdk`](./with-emsdk-container).

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
