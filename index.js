import AoLoader from '@permaweb/ao-loader'
import fs from 'fs'
import * as assert from 'node:assert'
const wasm = fs.readFileSync("./process.wasm")

const env = {
  Process: {
    Id: '1',
    Owner: 'OWNER',
    Module: 'MODULE',
    Tags: [
      { name: 'Data-Protocol', value: 'ao'},
      { name: 'Type', value: 'Process' }
    ],
    Data: '1984'
  },
  Module: {
    Id: '2',
    Owner: 'MODULE',
    Tags: [
      { name: 'Data-Protocol', value: 'ao' },
      { name: 'Type', value: 'Module'}
    ]
  }
}
let memory = null

async function main() {
  const handle = await AoLoader(wasm, { format: 'wasm64-unknown-emscripten-draft_2024_02_15' })
  const doHandle = async function () {
    console.time('compute')
    const result = await handle(memory, {
      Id: '3',
      Target: '1',
      Owner: 'USER',
      Module: 'MODULE',
      From: 'USER',
      "Block-Height": '1000',
      Timestamp: Date.now(),
      Tags: [
        { name: 'Data-Protocol', value: 'ao'},
        { name: "Type", value: "Message"},
        { name: 'Action', value: 'Eval'}
      ],
      Data: '1 + 1'
    }, env)
    console.timeEnd('compute')
    memory = result.Memory
    return result 
  }
  for(var i=0; i < 100000; i++) {
    await doHandle()
  }
     

}

main()
