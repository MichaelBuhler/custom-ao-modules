
import * as assert from 'node:assert'
import { readFile } from 'node:fs/promises'
import { describe, it } from 'node:test'

import { default as AoLoader } from '@permaweb/ao-loader'

const wasmBinary = await readFile('build/process.wasm')
const format = 'wasm32-unknown-emscripten3'

const HELLO_WORLD = 'Hello, world!'

describe('process', () => {

  it(`outputs "${HELLO_WORLD}"`, async () => {
    const handle = await AoLoader(wasmBinary, { format })

    const result = await handle(null, {}, {})

    assert.equal(result.Output, HELLO_WORLD)
  })

})
