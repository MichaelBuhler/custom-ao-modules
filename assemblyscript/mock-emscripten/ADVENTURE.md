# Mocking the Emscripten Runtime

You want to trick the legacynet CU's into executing your _fake_ [Emscripten](https://emscripten.org/) module? You want to use the _Emscripten_ JavaScript runtime to load an _AssemblyScript_ WASM module?

This is certainly no easy task.

If your module does not provided the exact same imported and exported functions as an authentic Emscripten module, or if any of them differ in parameter or return types, your WASM module will fail to instantiate on the CU.

You'll have to dissasemble the compiled AssemblyScript module, reverse engineer it, and then painstakingly insert a shim for every missing Emscripten import and export.

Or, you can just run my code:

```sh
npm install
npm run build
```

Voilà! You have built a WASM binary that is less than 10kb in size!

Let's test it out by running it through [`ao-loader`](https://www.npmjs.com/package/@permaweb/ao-loader):

```sh
npm run test
```

Did the test pass?

* [Yes, it's working!](../../SUCCESS.md)
  - _Any process running this module will output `Hello, world!` for any incoming message._

* [I get a stupid error message.](../../ERROR.md)

* [This is too confusing.](../../ABORT.md)
