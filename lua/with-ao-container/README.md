# lua/with-ao-container

This build process works by directly running a Docker container using the [`p3rmaw3b/ao`](https://hub.docker.com/r/p3rmaw3b/ao/tags) image from Docker Hub.

Modules built by code in this folder:

| AO Module ID | Size (bytes) | Published | AO Link |
| --- | --: | --- | --- |
| `Bgo_doLCMWUvX8KpGY-4S0V1sgo9LWzFmYJvqM2I4FM` | 454,614 | 2025-04-15T10:52:32Z | [View](https://www.ao.link/#/module/Bgo_doLCMWUvX8KpGY-4S0V1sgo9LWzFmYJvqM2I4FM) |

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

# Implementation Notes

The Dockerfile which builds the `p3rmaw3b/ao` image is available [here](https://github.com/permaweb/ao/blob/main/dev-cli/container/Dockerfile).

During the build, the Lua [`src`](./src) directory is mounted inside the container. All `.lua` files within the `src` directory are automatically copied into the WASM module (as constant strings), and are made available to the Lua runtime.

Your Lua source files are lazy loaded when you `require()` them. In this case, lazy loading means that Lua interprets the text of the file the first time that it is `require`d. Unfortunately, this means that you won't see your syntax errors until runtime. This problem can be mitigated by running Lua tests against your Lua code before building the WASM module.

If you use this build method, there are currently (2025-03-28 using `p3rmaw3b/ao:0.1.5`) some important and inflexible caveats that are enforced by the C runtime and Lua loader that are provided by the build container:

1. The root of the source directory mounted in the container MUST contain a file named `process.lua`.
1. That `process.lua` file MUST export (i.e. `return`) a table.
1. That exported table MUST define a `handle` key.
1. The corresponding value of `handle` MUST be a function.
1. That `handle` function SHOULD return a table.

The shape (type) of the returned table is commonly referred to as an `Outbox`. [See here for a complete description of the Outbox.](../../OUTBOX.md)
