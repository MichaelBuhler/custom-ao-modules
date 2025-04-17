
.PHONY: wasm test clean realclean

wasm: src/process.wasm
src/process.wasm: src/process.c
	docker container run \
		--rm \
		--volume "$$(pwd)/src":/src \
		emscripten/emsdk:4.0.6 \
		emcc \
			-s STACK_SIZE=50000 \
			-s INITIAL_MEMORY=65536 \
			process.c \
			-s EXPORTED_FUNCTIONS=_handle \
			-o process.mjs

test: wasm
	@$(MAKE) -C ../.. test-deps
	../../test.mjs src/process.wasm wasm32-unknown-emscripten4 hello

clean realclean:
	rm -f src/process.mjs src/process.wasm
