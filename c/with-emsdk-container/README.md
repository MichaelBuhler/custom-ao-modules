# c/with-emsdk-container

This build process works by directly running a Docker container using the [`emscripten/emsdk`](https://hub.docker.com/r/emscripten/emsdk) image from Docker Hub.

Modules built by code in this folder:

| AO Module ID | Size (bytes) | Published | AO Link |
| --- | --: | --- | --- |
| `ki_RiId7s3YTKwNIXWv5BrUywU4JMvTpXm8rThlaMDk` | 1,197 | 2025-04-17T06:34:41Z | [View](https://www.ao.link/#/module/ki_RiId7s3YTKwNIXWv5BrUywU4JMvTpXm8rThlaMDk) |

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

The `emsdk` Docker image is [provided](https://github.com/emscripten-core/emsdk/tree/main/docker) by the Emscripten team.

For the build, the C [`src`](./src) directory is mounted inside the container at `/src`, which is the Docker `WORKDIR`.

Since we are using such a low-level, compiled language here, we will simply implement the `handle()` function directly. [See here for a complete description of the `handle` function.](./HANDLE.md)
