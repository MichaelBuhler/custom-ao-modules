
.PHONY: wasm test clean realclean

wasm: src/process.wasm
src/process.wasm: asconfig.json src/mock-emscripten.js src/process.ts | npm-deps
	npm run build
.PHONY: npm-deps
npm-deps: node_modules/assemblyscript
node_modules/assemblyscript:
	npm install

test: wasm
	@$(MAKE) -C ../.. test-deps
	../../test.mjs src/process.wasm wasm32-unknown-emscripten3 hello

clean:
	rm -f src/process.wasm

realclean: clean
	rm -fr node_modules
