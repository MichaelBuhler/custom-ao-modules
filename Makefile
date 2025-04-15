
languages = assemblyscript lua

.PHONY: wasm test clean realclean

wasm clean:
	@for lang in $(languages); do \
		$(MAKE) -C $$lang $@ 2>&1 | awk -v prefix="$$lang/" '{print prefix $$0}'; \
	done

test: wasm test-deps
	@./test.mjs \
		assemblyscript/mock-emscripten/src/process.wasm   wasm32-unknown-emscripten3                   hello \
		lua/with-ao-container/src/process.wasm            wasm64-unknown-emscripten-draft_2024_02_15   all
.PHONY: test-deps
test-deps: node_modules/@permaweb/ao-loader
node_modules/@permaweb/ao-loader:
	npm install --no-package-lock --no-save @permaweb/ao-loader

realclean:
	@for lang in $(languages); do \
		$(MAKE) -C $$lang realclean 2>&1 | awk -v prefix="$$lang/" '{print prefix $$0}'; \
	done
	rm -fr node_modules
