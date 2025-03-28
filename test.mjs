#!/usr/bin/env node --experimental-wasm-memory64

import * as assert from 'node:assert'
import { readFile } from 'node:fs/promises'
import { before, describe, it } from 'node:test'

import { default as AoLoader } from '@permaweb/ao-loader'

// Args passed into this script are pairs of WASM module files,
// and their module format to use for loading with AoLoader
const modules_and_formats = process.argv.slice(2)

for ( let i = 0 ; i < modules_and_formats.length ; i += 2) {
  const wasmFile = modules_and_formats[i]
  const moduleFormat = modules_and_formats[i+1]
  describeWasmModule(wasmFile, moduleFormat)
}

function describeWasmModule (wasmFile, moduleFormat) {

  describe(wasmFile, () => {

    let handle
    const memory = null
    const msg = {}
    const env = {}

    //
    // We can compile the module one time.
    // Each invocation uses empty (null) initial memory.
    //
    before(async () => {
      const binary = await readFile(wasmFile)
      const options = { format: moduleFormat }
      handle = await AoLoader(binary, options)
    })

    //
    // Each module is expected to output `Hello, world!`
    //
    const HELLO_WORLD = 'Hello, world!'
    it(`outputs "${HELLO_WORLD}"`, async () => {
      const result = await handle(memory, msg, env)
      assert.equal(result.Output, HELLO_WORLD)
    })

  })

}
