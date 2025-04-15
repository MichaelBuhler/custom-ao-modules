
projects = with-ao-container

.PHONY: wasm test clean realclean

wasm clean realclean:
	@for proj in "$(projects)"; do \
		$(MAKE) -C $$proj $@ 2>&1 | awk -v prefix="$$proj: " '{print prefix $$0}'; \
	done

test: wasm
	@$(MAKE) -C .. test-deps
	../test.mjs with-ao-container/src/process.wasm wasm64-unknown-emscripten-draft_2024_02_15 all
