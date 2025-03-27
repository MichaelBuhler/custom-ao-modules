
projects = mock-emscripten

.PHONY: all wasm test clean realclean

all wasm clean realclean:
	@for proj in "$(projects)"; do \
		$(MAKE) -C $$proj $@; \
	done

test: wasm test-deps
	node ../test.mjs mock-emscripten/src/process.wasm wasm32-unknown-emscripten3
.PHONY: test-deps
test-deps: ../node_modules/@permaweb/ao-loader
../node_modules/@permaweb/ao-loader:
	$(MAKE) -C .. test-deps
