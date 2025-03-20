# assemblyscript/mock-emscripten

This build process works by invoking the AssemblyScript compiler with a transformer that will rebind several of the exported functions, and mock the rest of the ones that the Emscripten runtime expects.

# pre-requisites

Node and npm.

# prepare

```sh
npm install
```

# build

```sh
npm run build
```

# test

```sh
npm run test
```
