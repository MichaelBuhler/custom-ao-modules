import binaryen from 'assemblyscript/lib/binaryen.js'
const { createType, i32, none } = binaryen

import { Transform } from 'assemblyscript/transform'

export default class MockEmscripten extends Transform {
  afterCompile (module) {

    ////////////////////////////////////////////////////////////////////////////
    // Add Functions

    module.addFunction(
      '__fflush',
      i32,
      i32,
      [],
      module.i32.const(0),
    )

    module.addFunction(
      '__get_heap_base',
      none,
      i32,
      [],
      module.global.get('~lib/memory/__heap_base', i32),
    )

    module.addFunction(
      '__get_stack_pointer',
      none,
      i32,
      [],
      module.global.get('~lib/memory/__stack_pointer', i32),
    )

    module.addFunction(
      '__main',
      createType([i32, i32]),
      i32,
      [],
      module.i32.const(0),
    )

    module.addFunction(
      '__noop',
      none,
      none,
      [],
      module.nop(),
    )

    module.addFunction(
      '__push',
      i32,
      i32,
      [i32, i32],
      module.block(null, [
        module.global.set('~lib/memory/__stack_pointer', module.local.tee(
          1,
          module.i32.and(
            module.i32.sub(
              module.global.get('~lib/memory/__stack_pointer', i32),
              module.local.get(0, i32),
            ),
            module.i32.const(-16)
          ),
          i32,
        )),
        module.local.get(1, i32),
      ], i32),
    )

    module.addFunction(
      '__set_stack_pointer',
      i32,
      none,
      [],
      module.global.set('~lib/memory/__stack_pointer', module.local.get(0, i32)),
    )

    ////////////////////////////////////////////////////////////////////////////
    // Define Exports

    ////////////////////////////////////
    // memory

    module.addMemoryExport('0', 'memory')

    ////////////////////////////////////
    // __wasm_call_ctors

    
    module.addFunctionExport('__noop', '__wasm_call_ctors')

    /////////////////////////////////////
    // handle

    module.removeExport('handle')
    module.addFunctionExport('export:src/process/handle', 'handle')

    /////////////////////////////////////
    // main

    module.addFunctionExport('__main', 'main')

    /////////////////////////////////////
    // __indirect_function_table

    module.addTableExport('0', '__indirect_function_table')

    /////////////////////////////////////
    // malloc

    /////////////////////////////////////
    // saveSetjmp

    /////////////////////////////////////
    // free

    /////////////////////////////////////
    // __errno_location

    /////////////////////////////////////
    // fflush

    module.addFunctionExport('__fflush', 'fflush')

    /////////////////////////////////////
    // sbrk

    /////////////////////////////////////
    // setThrew

    /////////////////////////////////////
    // emscripten_stack_init
    
    module.addFunctionExport('__noop', 'emscripten_stack_init')

    /////////////////////////////////////
    // emscripten_stack_get_free

    /////////////////////////////////////
    // emscripten_stack_get_base

    /////////////////////////////////////
    // emscripten_stack_get_end
    
    module.addFunctionExport('__get_heap_base', 'emscripten_stack_get_end')

    /////////////////////////////////////
    // stackSave

    module.addFunctionExport('__get_stack_pointer', 'stackSave')

    /////////////////////////////////////
    // stackRestore

    module.addFunctionExport('__set_stack_pointer', 'stackRestore')

    /////////////////////////////////////
    // stackAlloc

    module.addFunctionExport('__push', 'stackAlloc')

    /////////////////////////////////////
    // dynCall_*
  }
}
