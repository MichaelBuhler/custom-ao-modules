# AssemblyScript

AssemblyScript, huh? Interesting choice.

[AssemblyScript](https://www.assemblyscript.org/) comes with its own compiler and runtime.

Unfortunately, there are no known CUs which can load and run WASM modules built by `asc`, the AssemblyScript compiler. _(as of 2025-03-20)_

If that becomes possible in the future, you might see AO modules published to ArWeave with a tag like `Module-Format: wasm32-unknown-assemblyscript`.

What should you do?

- [Try another language.](../ADVENTURE.md)

- [Mock the Emscripten runtime.](./mock-emscripten/ADVENTURE.md)
  - _Produce a WASM module that will appear to have been built by Emscripten._
