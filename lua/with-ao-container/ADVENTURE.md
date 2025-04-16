# Using the `p3rmaw3b/ao` image to build Lua

Using the `p3rmaw3b/ao` Docker image is a piece of cake, thanks to the work of the AO core dev team. Version `1.0.5` is the [latest available tag](https://hub.docker.com/r/p3rmaw3b/ao/tags) (as of 2025-04-14).

Create a directory for your Lua source code, e.g. `mkdir src`. Add a `process.lua` file that returns an object with a `handle()` function.

Your `handle()` function will be passed the incoming AO Message as the first parameter. Process and Module metadata are passed as the second parameter. Your function should return a valid `Outbox` table. [See here for a complete description of the Outbox.](../../OUTBOX.md)

Then you just need to bind mount your source code directory inside of the container and run the provided `ao-build-module` script: _(Alternately, you can use the Makefile in this folder.)_

```sh
docker container run --volume ./src:/src p3rmaw3b/ao:0.1.5 ao-build-module
# --- OR ----
make wasm
```

Done. You have built an AO module from your Lua project.

Let's test it out by running it through [`ao-loader`](https://www.npmjs.com/package/@permaweb/ao-loader):

```sh
make test
```

Did the tests pass?

* [I get a stupid error message.](../../ERROR.md)

* [This is too confusing.](../../ABORT.md)

* Yes, it's working!
  - _Keep reading..._

That's great! It works for me, too. 

I published the compiled WASM to Arweave as AO Module `Bgo_doLCMWUvX8KpGY-4S0V1sgo9LWzFmYJvqM2I4FM`. [Click here](https://www.ao.link/#/module/Bgo_doLCMWUvX8KpGY-4S0V1sgo9LWzFmYJvqM2I4FM) to view it on AO Link.

I used that module to spawn AO Process `duAiJDLAYzmEvaMk_rH07OXQ4W3hcIBCT_YGz0Mzcn0`. [Click here](https://www.ao.link/#/entity/duAiJDLAYzmEvaMk_rH07OXQ4W3hcIBCT_YGz0Mzcn0) to view it on AO Link.

Any process running this module will output `Hello, world!` for most dryruns or incoming message. If you set the tag `Action: Echo`, it will echo any data you send to it in its output. If you send an `Action: Ping` message, it will reply to the sender with an `Action: Pong` message. Any other `Action` will result in an error.

---

You did it! How do you feel?

* [I feel proud of myself.](../../SUCCESS.md)

* [I have a lot to learn.](../../SUCCESS.md)
  - _It's okay, we all do._
