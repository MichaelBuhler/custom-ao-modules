ARG EMSDK_VERSION=4.0.6
FROM emscripten/emsdk:${EMSDK_VERSION}
ARG RUST_TOOLCHAIN
ARG RUST_TARGET

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs > /rustup.sh
RUN chmod u+x /rustup.sh
RUN /rustup.sh -y --default-toolchain ${RUST_TOOLCHAIN} --target ${RUST_TARGET} --component rust-src

RUN mkdir -p /dummy/src
RUN echo '[package]\nname = "dummy"\n\n[lib]\ncrate-type = ["staticlib"]' > /dummy/Cargo.toml
RUN echo 'fn lib_func() {}' > /dummy/src/lib.rs
RUN cd /dummy && . /root/.cargo/env && RUSTFLAGS="-C panic=abort -Z emscripten-wasm-eh=yes" cargo build -Z build-std=std,panic_abort --target ${RUST_TARGET} --release

ENV RUST_TOOLCHAIN=${RUST_TOOLCHAIN}
ENV RUST_TARGET=${RUST_TARGET}

COPY build-wasm.sh /build-wasm.sh
CMD ["/build-wasm.sh"]
