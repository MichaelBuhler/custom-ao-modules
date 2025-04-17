# C

The [C programming language](https://www.c-language.org/). You should know what it is.

If you don't know what C is, you probably have no business compiling AO modules.

Emscripten excels at compiling C to run within its own (i.e. Emscripten's) WASM runtime.

Unfortunately, the AO Dev CLI build container has been [broken](https://github.com/permaweb/ao/issues/1205) for many months when it comes to building C projects.

You could try reverse engineering what the AO Dev CLI does to use the base Emscripten Docker image and invoke `emcc` directly...

What will you do?

- [Try another language.](../ADVENTURE.md)

- [Any container will do](./with-emsdk-container/ADVENTURE.md)
  - _Use the `emscripten/emsdk` image to build your WASM module._
