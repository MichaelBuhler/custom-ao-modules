# Mocking the Emscripten Runtime

You want to trick the legacynet CU's into executing your _fake_ [Emscripten](https://emscripten.org/) module? You want to use the _Emscripten_ JavaScript runtime to load an _AssemblyScript_ WASM module?

This is certainly no easy task.

If your module does not provided the exact same imported and exported functions as an authentic Emscripten module, or if any of them differ in parameter or return types, your WASM module will fail to instantiate on the CU.

You'll have to dissasemble the compiled AssemblyScript module, reverse engineer it, and then painstakingly insert a shim for every missing Emscripten import and export.

Or, you can just run my code in this folder:

```sh
make wasm
```

Voilà! You have built a WASM binary that is less than 2kb in size!!

Let's test it out by running it through [`@permaweb/ao-loader`](https://www.npmjs.com/package/@permaweb/ao-loader):

```sh
make test
```

Did the test pass?

* [I get a stupid error message.](../../ERROR.md)

* [This is too confusing.](../../ABORT.md)

* Yes, it's working!
  - _Keep reading..._

That's great! It works for me, too. 

I published the compiled WASM to Arweave as AO Module `nVeoUh5AfaDRnkkxHoxcjOo5Gv6BxrbdZEUSKT2FkG4`. [Click here](https://www.ao.link/#/module/nVeoUh5AfaDRnkkxHoxcjOo5Gv6BxrbdZEUSKT2FkG4) to view it on AO Link.

I used that module to spawn AO Process `2Jm4oQ02par7N20-syVpjiYmxlloYy158XZNRQOCYIk`. [Click here](https://www.ao.link/#/entity/2Jm4oQ02par7N20-syVpjiYmxlloYy158XZNRQOCYIk) to view it on AO Link.

Any process running this module will output `Hello, world!` for any dryrun or incoming message.

---

You did it! How do you feel?

* [I feel proud of myself.](../../SUCCESS.md)

* [I have a lot to learn.](../../SUCCESS.md)
  - _It's okay, we all do._
