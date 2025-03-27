
.PHONY: all wasm test clean realclean

all: wasm

wasm: src/process.wasm
src/process.wasm: node-deps asconfig.json src/mock-emscripten.js src/process.ts
	npx asc --transform ./src/mock-emscripten.js
.PHONY: node-deps
node-deps: node_modules/assemblyscript/package.json
node_modules/assemblyscript/package.json:
	npm install

test: wasm test-deps
	node ../../test.mjs src/process.wasm wasm32-unknown-emscripten3
.PHONY: test-deps
test-deps: ../../node_modules/@permaweb/ao-loader
../../node_modules/@permaweb/ao-loader:
	$(MAKE) -C ../.. test-deps

clean:
	@rm -frv src/process.wasm

realclean: clean
	@rm -fr node_modules
