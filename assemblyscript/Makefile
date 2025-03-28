
projects = mock-emscripten

.PHONY: all wasm test clean realclean

all wasm clean realclean:
	@for proj in "$(projects)"; do \
		$(MAKE) -C $$proj $@ 2>&1 | awk -v prefix="$$proj: " '{print prefix $$0}'; \
	done

test: wasm
	@$(MAKE) -C .. test-deps
	../test.mjs mock-emscripten/src/process.wasm wasm32-unknown-emscripten3
