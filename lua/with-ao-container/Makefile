
.PHONY: wasm test clean realclean

wasm: src/process.wasm
src/process.wasm: src/config.yml src/process.lua
	docker container run \
		--rm \
		--platform linux/amd64 \
		--volume "$$(pwd)/src":/src \
		--env DEBUG=true \
		p3rmaw3b/ao:0.1.5 \
		ao-build-module

test: wasm
	@$(MAKE) -C ../.. test-deps
	../../test.mjs src/process.wasm wasm64-unknown-emscripten-draft_2024_02_15 all

clean realclean:
	rm -f src/process.wasm
