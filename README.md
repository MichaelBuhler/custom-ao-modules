# custom-ao-modules

This repo contains simple working examples for each build method that I have figured out.

The rest is up to you.

To see a list of published AO modules that have been built by code in this repository, [click here](./MODULES.md).

## Choose Your Own Adventure!

For a guided experience, [click here](./ADVENTURE.md).

## Build and Test Everything in this Repo

The [Makefile](Makefile) in this folder will make all child folders.

Pre-requisites: `node`, `npm`, and `make`.

```sh
make
make test
```

## Further Reading

Building a custom module for AO can be very frustrating and/or time-consuming. The APIs and interfaces are not very well documented, if at all. I have invested some time in reverse engineering many of the components (especially the [reference CU](https://github.com/permaweb/ao/tree/main/servers/cu#readme) and the [AO dev-cli](https://github.com/permaweb/ao/tree/main/dev-cli#readme)) to figure out what makes AO tick on the inside. With this knowledge, I have hacked together minimally working examples with a variety of languages and toolchains. _(*I might not have published all of them here yet.)_

The main upsides to a custom modules are:

1. You can use a language other than Lua.
1. Your application can be AOS-agnostic.
1. You can build smaller modules, which will require smaller checkpoints.

The main downsides are:

1. This is entirely unsupported by the AO core dev team.
1. There's no hot-patching/code mutation.
    - AOS is a Lua _interpreter_, so you can load in more source code at any time. You won't have that it you _compile_ a small binary.
1. You don't have any libraries.
    - AOS provides useful modules like `json`, `.ao`, and `.handlers`, which greatly simplify the application development experience. You'll have to build these from scratch, but please share your code.

Choose a language folder within this folder to explorer further.
