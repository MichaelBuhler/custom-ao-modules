# Lua

Lua, a classic choice.

[Lua](https://lua.org/) has its own compiler, interpreter, and C runtime library, with a 30+ year history.

Lua is designed to run within a C program/environment, so it does not run natively on AO.

Fortunately, Emscripten excels at compiling C to run within its own (i.e. Emscripten's) WASM runtime.

Also fortunately for you, the AO core dev team maintains a Docker image which can be used to quickly compile Lua to run on AO. This image is available on Docker Hub under the name [`p3rmaw3b/ao`](https://hub.docker.com/r/p3rmaw3b/ao/tags).

On the other hand, Lua 'tis a silly place full of tables, metatables, weakly-types variables, and global namespace pollution.

What will you do?

- [Try another language.](../ADVENTURE.md)

- [Lua is best for me.](./with-ao-container/ADVENTURE.md)
  - _Use the `p3rmaw3b/ao` image to build your WASM module._
