# Making a custom build container for Rust

For your [custom build container](./container), you start with a recent build of [`emscripten/emsdk`](https://hub.docker.com/r/emscripten/emsdk) provided by the Emscripten project.

You use [`rustup`](https://rustup.rs/) to install Cargo and the latest `nightly` build of the Rust toolchain. _Building an empty Rust project inside the container will populate the build cache, speeding up future builds._

You add a build script to the container which will compile all your Rust source files into a static lib, targeting `wasm32-unknown-emscripten`. As part of this build process, you instruct Cargo to also recompile the Rust stdlib from source using the WASM `$abort()` function to handle any Rust panics that happen at runtime.

Your build script will then invoke `emcc`, the Emscripten compiler entrypoint, to link your Rust lib and a C trampoline together into a final WASM binary.

You are finding it easier to just run my code with a simple `make` command (you'll need Docker to be running):

```sh
make container/.container
```

With a newly built Docker image, you whip up [some C code](./src/process.c) which will act as a trampoline between the Emscripten runtime and your Rust application.

Next, you implement your main application logic [in Rust](./src/process.rs). _You also add a function that will allow your C trampoline to deallocate strings which have been allocated by Rust._

Now you are ready to build your WASM module:

```sh
make wasm
```

Shazam! You've built a shiny new `process.wasm` into your `/src` directory!

Let's test it out by running some tests with [`ao-loader`](https://www.npmjs.com/package/@permaweb/ao-loader):

```sh
make test
```

Did the tests pass?

* [I get a stupid error message.](../../ERROR.md)

* [This is too confusing.](../../ABORT.md)

* Yes, it's working!
  - _Keep reading..._

That's great! It works for me, too. 

<!-- I published the compiled WASM to Arweave as AO Module `TODO`. [Click here](https://www.ao.link/#/module/TODO) to view it on AO Link.

I used that module to spawn AO Process `TODO`. [Click here](https://www.ao.link/#/entity/TODO) to view it on AO Link. -->

Any process running this module will output `Hello, world!` for any dryrun or incoming message.

---

You did it! How do you feel?

* [I feel proud of myself.](../../SUCCESS.md)

* [I have a lot to learn.](../../SUCCESS.md)
  - _It's okay, we all do._
