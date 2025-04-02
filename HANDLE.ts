
import type { Outbox } from './OUTBOX.ts'

type ArweaveWallet = string //  43 base64url characters
type ArweaveTxId   = string //  43 base64url characters
type HashChainHash          = string //  43 base64url characters
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

export type HandleFunction = (msgJson: JsonStringified<Message>, envJson: JsonStringified<Environment>) => JsonStringified<HandleResult>
