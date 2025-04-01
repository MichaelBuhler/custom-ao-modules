
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

export type Outbox = {
    Assignments: Array<Assignment>
    Error: string | undefined
    Messages: Array<Message>
    Output: any | undefined
    Patches: Array<unknown> // this is novel and not well understood
    Spawns: Array<Spawn>
}
