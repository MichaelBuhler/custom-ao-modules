
projects = with-emsdk-container

.PHONY: wasm test clean realclean

wasm clean realclean:
	@for proj in "$(projects)"; do \
		$(MAKE) -C $$proj $@ 2>&1 | awk -v prefix="$$proj: " '{print prefix $$0}'; \
	done

test: wasm
	@$(MAKE) -C .. test-deps
	../test.mjs with-emsdk-container/src/process.wasm wasm32-unknown-emscripten4 hello
