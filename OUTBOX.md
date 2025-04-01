# Outbox

The "Outbox" is an important concept in AO, and in its first-class module [AOS](https://github.com/permaweb/aos).

_The [AO Draft 5 Spec](https://gygbo2cdld7i3t624il5zxa3ezyv6sa2ikvhrlmabah2etw45wua.arweave.net/NgwXaENY_o3P2uIX3NwbJnFfSBpCqnitgAgPok7c7ag/#/spec) references "outboxes" but does not define them clearly. AOS (being the first module implemented on AO) uses this terminology to refer to the object (Lua table) that is returned when handling an AO message. This seems like something we may adopt as convention._

## Introduction

The outbox (or at least the fields defined on it) is eventually returned by the CU to whomever requested the evaluation result. If you request the `GET /result/<messageId>?process-id=<processId>` HTTP endpoint from a CU, you will see this shape. _What is actually returned be the CU may include additional metadata fields, such as `GasUsed`._ When a MU receives this response, it can see if there are any additional assignments, messages, or spawns that it needs to continue pushing through the network. _Pushing is sometimes called cranking._

When the CU is evaluating a message to a process, it invokes the `handle` function exported by the process's WASM module. Exactly what is being "handled" is the AO Message which is incoming to the AO Process. [See here for a complete description of the `handle` function.](./HANDLE.md) Critically, the modules's `handle` function is expected to return a JSON-encoded object, which includes an Outbox.

## In AOS

In AOS, the outbox is managed via the `ao` Lua module, available globally via the `ao` variable, or (more explicitly) via `local ao = require('.ao')`. The outbox is available as the `ao.outbox` table.

The `ao` library module provides the `ao.assign()`, `ao.send()`, and `ao.spawn()` functions for pushing new values into the outbox structure, though you can do so manually. [Source code here.](https://github.com/permaweb/aos/blob/main/process/ao.lua)

AOS provides the globally-defined convenience methods `Assign()`, `Send()`, and `Spawn()` which wrap and provide higher-level abstractions to the correpsonding library functions. [Source code here.](https://github.com/permaweb/aos/blob/main/process/process.lua)

If you are writing a custom AO module, you may or may not choose to follow the design decision/pattern of AOS.

## Outbox Object Type Definition

_I am using TypeScript below and in [this file](./OUTBOX.ts) for expository purposes only._

```TypeScript
type ArweaveWallet = string // 43 base64url characters
type ArweaveTxId   = string // 43 base64url characters

type AoModuleId    = ArweaveTxId
type AoProcessId   = ArweaveTxId
type AoMessageId   = ArweaveTxId

type Tag = { name: string, value: string }

type Assignment = {
    Message: AoMessageId | ArweaveTxId // can be any Arweave transaction
    Processes: Array<AoProcessId>      // preferably valid process ids
}

type Message = {
    Anchor: string             // MUST be 32 bytes
    Target: string | undefined // technically optional
    Data: string | undefined   // MU will coalesce `undefined` to ' '
    Tags: Array<Tag>
    // Tags MUST include { name: 'Data-Protocol', value: 'ao'                 }
    // Tags MUST include { name: 'Type'         , value: 'Message'            }
}

type Spawn = {
    Anchor: string             // MUST be 32 bytes
    Target: string | undefined // probably SHOULD NOT be defined
    Data: string | undefined   // MAY contain data for the new process to use
    Tags: Array<Tag>
    // Tags MUST include { name: 'Data-Protocol', value: 'ao'                 }
    // Tags MUST include { name: 'Type'         , value: 'Process'            }
    // Tags MUST include { name: 'Module'       , value: AoModuleId           }
    // Tags MAY  include { name: 'Scheduler'    , value: ArweaveWallet        }
    // Tags MAY  include { name: 'On-Boot'      , value: 'Data' | ArweaveTxId }
}

type Outbox = {
    Assignments: Array<Assignment>
    Error: string | undefined
    Messages: Array<Message>
    Output: any | undefined
    Patches: Array<unknown> // this is novel and not well understood
    Spawns: Array<Spawn>
}
```
