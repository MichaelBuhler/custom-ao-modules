
languages = assemblyscript

.PHONY: all wasm test clean realclean

all wasm clean realclean:
	@for lang in "$(languages)"; do \
		$(MAKE) -C $$lang $@; \
	done
	@if [ "$@" = "realclean" ]; then \
		rm -fr node_modules; \
	fi

test: wasm test-deps
	node test.mjs assemblyscript/mock-emscripten/src/process.wasm wasm32-unknown-emscripten3
.PHONY: test-deps
test-deps: node_modules/@permaweb/ao-loader
node_modules/@permaweb/ao-loader:
	npm install --no-save --no-package-lock @permaweb/ao-loader
