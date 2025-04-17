# Handle

The `handle()` function is the most important concept in an AO Module; it is the public interface to the module.

_No [AO Spec](https://gygbo2cdld7i3t624il5zxa3ezyv6sa2ikvhrlmabah2etw45wua.arweave.net/NgwXaENY_o3P2uIX3NwbJnFfSBpCqnitgAgPok7c7ag/#/spec) has every defined this interface. What follows is the fruits of reverse engineering the [CU](https://github.com/permaweb/ao/tree/main/servers/cu) and [loader](https://github.com/permaweb/ao/tree/main/loader)._

## Introduction

When the CU is asked to evaluate an AO Message to an AO Process, it will first look up the AO Module that the AO Process is using. If not already cached, the CU will download the AO Module from Arweave. The AO module is expected to be a WASM module, and should have a `Content-Type: application/wasm` tag on the Arweave transaction that published it. The CU will then use the [`@permaweb/ao-loader`](https://www.npmjs.com/package/@permaweb/ao-loader) npm package to instantiate an instance of the WASM module using the Emscripten runtime indicated by the `Module-Format` tag on the Arweave transaction that published the module.

## The `handle()` Function

The `handle()` function is (or, must be) one of exports available on the instance of the WASM module. If you are writing a custom AO module, it is of chief importance that you correctly implement and export this function from your WASM module.

The `handle()` function is the only way the CU calls into the AO Process. Exactly what is being "handled" is the AO Message which is incoming to the AO Process. AO processes are dormant until there is an incoming message to handle.

The `handle()` function is invoked with two parameters, each of which is a JSON encoded object. The first parameter is the (stringified) AO Message that is being handled. The second parameter is a (stringified) object containing metadata about the AO Process itself and the AO Module that it is based on. [AOS](https://github.com/permaweb/aos) has set the convention that the first parameter is named `msg` and the second is named `env` (as in 'environment').

The return value of `handle()` is a JSON encoded (stringified) object with two keys. The first key is `ok` and should be a boolean indicating success or failure. The second key is `response` and should be a valid `Outbox` object. [See here for a complete description of the Outbox.](./OUTBOX.md) All other keys are ignored.

## Low Level Implementation Details and Calling Convention

Ultimately, your process code has to compile down to WebAssembly. The `handle()` function takes two string arguments and returns a string. However, WebAssembly does not have a `string` type. Instead, Emscripten and WebAssembly work together to implement something very similar to C-style, null-terminated strings.

Before the CU can call the `handle()` function, it first JSON-stringifies the `msg` and `env` values. For each of these string parameters, the Emscripten runtime gets their length, calls into a function named `_emscripten_stack_alloc` that is exported by the WASM module (which allocates space on the stack by advancing the stack pointer enough to fit the string parameter, plus one byte), then copies the string parameter into that allocated space, terminating it with a null byte. (The Emscripten runtime has access to the raw byte array that comprises the WASM memory.) Each call to `_emscripten_stack_alloc` returned the memory address to the first byte of allocated space. So each of these values is now a pointer to a null-terminated string. The Emscripten runtime then invokes the `handle()` function, passing the two pointers as arguments.

The inverse happens when the `handle()` function returns. Rather than returning a string, `handle()` returns a pointer (the memory address) to the first byte of a null-terminated string. Where this string is allocated (hopefully not the heap, which would likely be a memory leak, but easily could be the read-only/data section of memory or even the stack) does not matter. The Emscripten runtime reads the string (which is null-terminated) from the raw WASM memory, then resets the stack pointer (using `_emscripten_stack_restore` exported by the WASM module) to the place it was before it pushed the string input parameters onto the stack.

These stack allocation operations mean that if the size of the incoming AO Message (the `Data` field on the Arweave transaction is of arbitrary size) is larger than the available space on the WASM stack, the stack will overflow and the AO Process cannot handle the message.

Using C language semantics/syntax, we can define (forward declare) a `handle()` function that will work with the Emscripten runtime and `@permaweb/ao-loader`:

```c
const char* handle(const char*, const char*);
```

When this is compiled to Wasm32 each `const char*` pointer will be of the WebAssembly type `i32`. If compiling to Wasm64, they will be type `i64`.

## Errors

Errors can occur at a few levels:

1. WASM errors:
    - This is like the worst kind of error, where `handle()` cannot even return successfully.
    - Examples:
        - Accessing an invalid memory address ("segmentation fault")
        - Stack overflow
        - Something in the WASM calls the imported `abort()` function
1. The JSON object returned by `handle()` contains `"ok": false`:
    - This indicates a fatal, unexpected error (akin to an HTTP 500 response code) occured in your application.
    - This should probably be implemented within the `handle()` function as a try/catch around all your application logic.
1. The JSON object returned by `handle()` contains `"ok": true`, but the `response` Outbox object contains an `Error` set to a truthy value:
    - Most application errors ought to be handled this way.

The key thing to understand about all of these types of errors is that the evaluation result and changes to the WASM memory are discarded as if the incoming message which caused this error was never sequenced by the SU. Since the message (and its `Nonce`) are immutable and the WASM module is (really should be!) deterministic, a CU could skip this AO Message evaluation in the future since it has no impact on the state of the AO Process.

## In AOS

[AOS](https://github.com/permaweb/aos) is built using the [AO Dev CLI](https://github.com/permaweb/ao/tree/main/dev-cli). The AO Dev CLI detects when it is building a Lua project and automatically injects several Lua scripts into the Lua runtime inside of the WASM module. In particular, it:

1. Provides a loader function used any time `require(...)` is invoked from within a Lua script.
1. Adds in a `json` package, which has `json.decode()` and `json.encode()` functions defined.
1. Defines a Lua global function named `handle`.
    - _NB: This function is 'global' within the Lua runtime, not the WASM module._
    - This function uses the aforementioned `require()` loader function to load the aforementioned `json` package.

The AO Dev CLI will also forward declare and define a `handle()` function in a `.c` file. This is the actual `handle()` function exported by the final WASM module! (Emscripten builds this `.c` file into a WASM module binary.)

This C-language `handle()` function uses the Lua/C runtime bindings to push the `const char* msgJson` and `const char* envJson` pointers onto the Lua stack, then finds and invokes the aforementioned Lua global function named `handle`. The Lua global `handle` function immediately decodes its string parameters into Lua tables, requires a module named `.process`, and invokes (yet another) `handle()` function defined by the `.process` module. The return value of that function is encoded as JSON, returned to C-land as a `const char*` pointer, and returned out of the WASM function call (where Emscripten reads it).

AOS defines the `.process` Lua module, and the `handle()` function that it exports, in the `process.lua` file. AOS maintains a `Handlers.list` which the `handle()` function uses to route any incoming messages.

Because of these rigid design decisions made by the AO Dev CLI and AOS, if you are going to [implement a custom AO module in Lua](./lua) and build it with the AO Dev CLI, you will have to follow the pattern of AOS and place a `process.lua` file at the root of your source code directory, and that `process.lua` file must `return` a Lua table with a `handle` function.

## Handle Function Pseudo-Implementation in JavaScript

If you could write a WASM module in JavaScript, the `handle()` function might look like the following. Whatever implementation language is used will need to follow this basic pattern. The build process will likely need to include (compile in) a JSON library to parse the inputs and to conveniently stringify the output. [See here for a complete description of the Outbox.](./OUTBOX.md)

```JavaScript
export function handle (msgJson, envJson) {
    const msg = JSON.parse(msgJson)
    const env = JSON.parse(envJson)

    // invoke all your process logic here

    const outbox = {
        Output: 'Successfully handled message.',
        Messages: [],   // add any outbound messages
        Assignments: [] // add any assignments to any processes
        Spawns: []      // add any new processes to spawn
    }
    return JSON.stringify({
        ok: true,
        response: outbox,
    })
}
```

## Handle Function Interface Definition

_I am using TypeScript below and in [this file](./HANDLE.ts) for expository purposes only._

```TypeScript
type ArweaveWallet = string //  43 base64url characters
type ArweaveTxId   = string //  43 base64url characters
type HashChainHash = string //  43 base64url characters
type Signature     = string // 683 base64url characters
type Timestamp     = number // milliseconds since 1970-01-01

type AoModuleId    = ArweaveTxId
type AoProcessId   = ArweaveTxId
type AoMessageId   = ArweaveTxId

type Tag = { name: string, value: string }

type Message = {
    Anchor: string | undefined              // MUST be 32 bytes if present
    'Block-Height': number                  // Height at the time the SU scheduled the message
    Cron: boolean
    Data: string | undefined
    Epoch: 0,                               // Always zero
    'Forwarded-By': AoProcessId | undefined // Not sure if AoProcessId, or MU's ArweaveWallet
    From: AoModuleId | ArweaveWallet
    'Hash-Chain': HashChainHash
    Id: AoMessageId
    Nonce: number                           // Message sequence number assigned by the SU
    Owner: ArweaveWallet
    'Read-Only': false,
    Signature: Signature,
    Tags: Array<Tag>                        // Could be anything if message is assigned from Arweave
    Target: AoProcessId                     // Should be the ID of your AO Process
    Timestamp: Timestamp                    // The time the SU scheduled the message
}

type Environment = {
    Module: {
        Id: AoModuleId
        Owner: ArweaveWallet
        Tags: Array<Tag>
        // Tags MUST   include { name: 'Data-Protocol'  , value: 'ao'                  }
        // Tags MUST   include { name: 'Type'           , value: 'Module'              }
        // Tags MUST   include { name: 'Content-Type'   , value: 'application/wasm'    }
        // Tags MUST   include { name: 'Module-Format'  , value: string                }
        // Tags MUST   include { name: 'Memory-Limit'   , value: string                }
        // Tags MUST   include { name: 'Compute-Limit'  , value: string                }
        // Tags MUST   include { name: 'Input-Encoding' , value: 'JSON-1' | string     }
        // Tags MUST   include { name: 'Output-Encoding', value: 'JSON-1' | string     }
        // Tags SHOULD include { name: 'Variant'        , value: 'ao.TN.1' /*testnet*/ }
        // Tags MAY    include { name: 'Name'           , value: string                }
    }
    Process: {
        Id: AoProcessId
        Owner: ArweaveWallet
        Tags: Array<Tag>
        // Tags MUST   include { name: 'Data-Protocol'  , value: 'ao'                  }
        // Tags MUST   include { name: 'Type'           , value: 'Process'             }
        // Tags MUST   include { name: 'Module'         , value: AoModuleId            }
        // Tags MUST   include { name: 'Scheduler'      , value: ArweaveWallet         }
        // Tags SHOULD include { name: 'Variant'        , value: 'ao.TN.1' /*testnet*/ }
        // Tags MAY    include { name: 'Name'           , value: string                }
        // Tags MAY    include { name: 'On-Boot'        , value: 'Data' | ArweaveTxId  }
    }
}

type JsonStringified<T> = string // e.g. JSON.stringify(<T>obj)

type HandleResult = {
    ok: boolean
    response: Outbox // See `./OUTBOX.md` in this folder
}

type HandleFunction = (msgJson: JsonStringified<Message>, envJson: JsonStringified<Environment>) => JsonStringified<HandleResult>
```
