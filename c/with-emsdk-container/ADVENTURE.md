# Using the `emscripten/emsdk` image to build C

Using the [`emscripten/emsdk`](https://hub.docker.com/r/emscripten/emsdk) Docker image is a piece of cake, thanks to the work of the Emscripten team.

You create a `process.c` file, in a new `src` directory.

You define a non-static `handle()` function, which takes two string pointers as arguments and returns another string pointer.

Your `handle()` function will be passed the incoming AO Message as the first parameter. AO Process and AO Module metadata are passed as the second parameter. Both of these are JSON-encoded strings. It also needs to return a valid JSON-encoded object of a particular shape. [See here for a complete description of the `handle()` function interface.](../../HANDLE.md)

Part of the shape of the returned JSON object is the `Outbox`. [See here for a complete description of the Outbox.](../../OUTBOX.md)

Finally, you can invoke `docker run` to run `emcc` (the Emscripten compiler) inside of a container based on the `emscripten/emsdk` image, mounting your `src` directory, exporting your `handle()` function so that it does not get stripped during optimization, enumerating all of your input file, and naming your output.

_Sample code is avilable for you in this folder. You can build it with `make`:_

```sh
docker container run --volume ./src:/src emscripten/emsdk emcc -s EXPORTED_FUNCTIONS=_handle -o process.mjs process.c 
# -- OR --
make wasm
```

Presto! You have built a WASM binary that is less than 2kb in size!!

_By tuning additional Emscripten settings, you can produce a very small WASM module with minimal runtime requirements like only 64kb of memory._

Let's test it out by running it through [`ao-loader`](https://www.npmjs.com/package/@permaweb/ao-loader):

```sh
make test
```

Did the test pass?

* [I get a stupid error message.](../../ERROR.md)

* [This is too confusing.](../../ABORT.md)

* Yes, it's working!
  - _Keep reading..._

That's great! It works for me, too. 

I published the compiled WASM to Arweave as AO Module `ki_RiId7s3YTKwNIXWv5BrUywU4JMvTpXm8rThlaMDk`. [Click here](https://www.ao.link/#/module/ki_RiId7s3YTKwNIXWv5BrUywU4JMvTpXm8rThlaMDk) to view it on AO Link.

I used that module to spawn AO Process `7S32V4A1fx-5Ec_t9cZJvNoObISoPSZdLK8yP2c0dto`. [Click here](https://www.ao.link/#/entity/7S32V4A1fx-5Ec_t9cZJvNoObISoPSZdLK8yP2c0dto) to view it on AO Link.

Any process running this module will output `Hello, world!` for any dryrun or incoming message.

---

You did it! How do you feel?

* [I feel proud of myself.](../../SUCCESS.md)

* [I have a lot to learn.](../../SUCCESS.md)
  - _It's okay, we all do._
