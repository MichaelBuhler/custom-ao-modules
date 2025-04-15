# Custom AO Modules

This repository contains simple working examples for each build method that I have figured out.

The rest is up to you.

## Choose Your Own Adventure!

For a guided experience, please [click here](./ADVENTURE.md).

## Repository Goals

For each target language, the primary goal is to produce a functioning AO Module that can pass a simple test suite.

"Functioning AO Module" means that the produced WASM binary can be published to Arweave and used for spawning AO processes on testnet/legacynet. By necessity, this means that module will be loadable and invocable by [`ao-loader`](https://www.npmjs.com/package/@permaweb/ao-loader).

[See here for a description of module features and the test suite.](./TESTS.md)

A secondary goal is to tweak each build process to make both the WASM binary and its runtime memory usage as small as possible.

## Modules

See [MODULES.md](./MODULES.md) for a list of modules which have been built and published from the code in this repository.

## Main Challenges

Anyone building a custom AO Module will be principally concerned with correctly implementing and exporting a `handle()` function from their built WASM binary. [See here for a complete description of the `handle` function.](./HANDLE.md)

Secondarily, the `handle()` function should return a valid Outbox object (JSON-encoded). [See here for a complete description of the Outbox.](./OUTBOX.md)

A tertiary concern is finagling your WASM binary's imports and exports to be compatible with one of the `Module-Format`s supported by [`ao-loader`](https://www.npmjs.com/package/@permaweb/ao-loader). This is by far the most difficult aspect for languages not supported by the [AO Dev CLI](https://github.com/permaweb/ao/tree/main/dev-cli#readme).

## Build and Test Everything in this Repository

The [Makefile](Makefile) in this folder will make all child folders.

Pre-requisites: `docker`, `node`, `npm`, and `make`.

```sh
make
make test
```

## Further Reading

Building a custom module for AO can be very frustrating and/or time-consuming. The APIs and interfaces are not very well documented, if at all. I have invested some time in reverse engineering many of the components (especially the [reference CU](https://github.com/permaweb/ao/tree/main/servers/cu#readme) and the [AO Dev CLI](https://github.com/permaweb/ao/tree/main/dev-cli#readme)) to figure out what makes AO tick on the inside. With this knowledge, I have hacked together minimally working examples with a variety of languages and toolchains. _(*I may not have published all of them here yet.)_

The main upsides to a custom modules are:

1. You can use a language other than Lua.
1. Your application can be AOS-agnostic.
1. You can build smaller modules, which use less memory, which enables smaller checkpoints.

The main downsides are:

1. This is entirely unsupported by the AO core dev team.
1. There's no hot-patching/code mutation for compiled languages.
    - AOS is a Lua _interpreter_, so you can load in more source code at any time. You won't have that if you _compile_ a small binary.
    - I do have some hope that other interpreted langauges (starting with Python and JavaScript) will loadable at runtime.
1. You don't have any libraries.
    - AOS provides useful modules like `json`, `.ao`, and `.handlers`, which greatly simplify the application development experience.
    - It will take time for the community to build up these resources for other langauges. Please share your code.

Choose a language folder to explore further.
