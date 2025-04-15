#!/usr/bin/env node --experimental-wasm-memory64

import { randomBytes } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { before, describe, it, skip } from 'node:test'

import { default as AoLoader } from '@permaweb/ao-loader'

const FEATURES = {
  ALL:   'all',   // the process implements all features:
  ECHO:  'echo',  // the process is expected to echo Data sent to it
  HELLO: 'hello', // the process is expected to output `Hello, world!`
  PING:  'ping',  // the process is expected to reply to `Ping` messages
  OTHER: 'other', // the process is expected to error for any other action
}
const ALL_FEATURES = [
  FEATURES.ECHO,
  FEATURES.HELLO,
  FEATURES.PING,
  FEATURES.OTHER,
]

// Args passed into this script are triples of WASM module files,
// their module format (to use for loading with AoLoader), and
// their supported features (e.g. `echo,hello,ping,other`).
const modules_and_formats = process.argv.slice(2)

for ( let i = 0 ; i < modules_and_formats.length ; i += 3) {
  const wasmFile = modules_and_formats[i]
  const moduleFormat = modules_and_formats[i+1]
  let features = modules_and_formats[i+2]
  if (features === FEATURES.ALL) {
    features = ALL_FEATURES
  } else {
    features = features.split(',')
    for (const feature of features) {
      if (feature === FEATURES.ALL) {
        throw new Error(`Do not specify '${FEATURES.ALL}' with other features: ${features.join(',')}`)
      }
      if (!ALL_FEATURES.includes(feature)) {
        throw new Error(`Unknown feature '${feature}'!\nValid features: 'all' or a combination of '${ALL_FEATURES.join(',')}'`)
      }
    }
  }
  describeWasmModule(wasmFile, moduleFormat, features)
}

function describeWasmModule (wasmFile, moduleFormat, features) {

  describe(wasmFile, () => {

    let handle
    const memory = null

    // We can compile/instantiate the module one time.
    // Each invocation uses empty (null) initial memory.
    before(async () => {
      const binary = await readFile(wasmFile)
      const options = { format: moduleFormat }
      handle = await AoLoader(binary, options)
    })

    // If the `Action` tag is not defined,
    // the process should output 'Hello, world!'.
    ;(features.includes('hello') ? it : skip)
    (`outputs hello world`, async (t) => {
      const result = await handle(memory, makeMsg(), makeEnv())

      t.assert.strictEqual(result.Output, 'Hello, world!',
        'The output is not `Hello, world!`!')
    })

    // If the `Action` tag is `Echo`,
    // the process should output the Data sent to it.
    ;(features.includes('echo') ? it : skip)
    (`echoes random data`, async (t) => {
      const randomHex = randomBytes(8).toString('hex')

      const msg = makeMsg()
      msg.Data = randomHex
      msg.Tags.push({ name: 'Action', value: 'Echo' })

      const result = await handle(memory, msg, makeEnv())

      t.assert.strictEqual(result.Output, randomHex,
        'The process did not echo back the correct data!')
    })

    // If the `Action` tag is `Ping`,
    // the process should reply to sender with a `Pong` message.
    ;(features.includes('ping') ? it : skip)
    (`replies to pings`, async (t) => {
      const msg = makeMsg()
      msg.Tags.push({ name: 'Action', value: 'Ping' })

      const result = await handle(memory, msg, makeEnv())

      t.assert.ok(result.Messages?.[0],
        'The process did not add any messages to its outbox!')
      t.assert.strictEqual(result.Messages[0].Target, msg.From,
        'The process did not target the sender with its reply!')
      t.assert.strictEqual(result.Messages[0].Anchor?.length, 32,
        'The `Pong` reply message must have a 32 byte `Anchor`!')
      t.assert.ok(result.Messages[0].Tags?.length,
        'The `Pong` reply message has no `Tags`!')
      t.assert.ok(result.Messages[0].Tags.find(x => x.name === 'Action'),
        'The `Pong` reply message has no `Action` tag!')
      t.assert.strictEqual(result.Messages[0].Tags.find(x => x.name === 'Action').value, 'Pong',
        'The `Action` of the reply message should be `Pong`!')
      // TODO: check more data or tags?
    })

    // If the `Action` tag is neither `Echo` nor `Ping`,
    // the process should error out.
    ;(features.includes('other') ? it : skip)
    (`errors on unsupported actions`, async (t) => {
      const msg = makeMsg()
      msg.Tags.push({ name: 'Action', value: 'Other' })

      const result = await handle(memory, msg, makeEnv())

      t.assert.ok(result.Error,
        'The process did not set an Error in the outbox!')
    })

  })

}

function makeMsg () {
  // TODO: make this more realistic
  return {
    From: randomBytes(32).toString('base64url'),
    Data: '1234',
    Tags: [],
  }
}

function makeEnv () {
  // TODO: make this more realistic
  return {
    Module: {},
    Process: {},
  }
}
