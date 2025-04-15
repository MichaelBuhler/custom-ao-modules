
EMSDK_VERSION=4.0.6
RUST_TOOLCHAIN=nightly
RUST_TARGET=wasm32-unknown-emscripten

DOCKER_TAG=emsdk-$(EMSDK_VERSION)-rust-$(RUST_TOOLCHAIN):$(RUST_TARGET)

.PHONY: wasm test clean realclean

wasm: src/process.wasm
src/process.wasm: src/process.c src/process.rs container/.container
	docker container run \
		--rm \
		--volume "$$(pwd)":/src \
		$(DOCKER_TAG)
	@rm src/process.mjs
container/.container: container/build-wasm.sh container/Dockerfile
	docker image build \
		--tag $(DOCKER_TAG) \
		--build-arg EMSDK_VERSION=$(EMSDK_VERSION) \
		--build-arg RUST_TOOLCHAIN=$(RUST_TOOLCHAIN)  \
		--build-arg RUST_TARGET=$(RUST_TARGET)  \
		./container
	docker image ls --quiet $(DOCKER_TAG) > container/.container

test: wasm
	@$(MAKE) -C ../.. test-deps
	../../test.mjs src/process.wasm wasm32-unknown-emscripten4 hello

clean:
	rm -f src/process.wasm

realclean: clean
	rm -r container/.container
	rm -fr target
	docker image remove $(DOCKER_TAG)
