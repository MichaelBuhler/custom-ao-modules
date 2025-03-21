# assemblyscript/mock-emscripten

This build process works by invoking the AssemblyScript compiler with a transformer that will rebind several of the exported functions, and mock the rest of the ones that the Emscripten runtime expects.

Modules built by code in this folder:

| AO Module ID | Size (bytes) | Published | View |
| --- | --: | --- | --- |
| `ACp1zT_Zvv7HL9Dv7iigyOad2R9oRfXip1GdqjAT91c` | 9,920 | 2025-03-21T10:39:37Z | [AO Link](https://www.ao.link/#/module/ACp1zT_Zvv7HL9Dv7iigyOad2R9oRfXip1GdqjAT91c) |

## pre-requisites

Node and npm.

## prepare

```sh
npm install
```

## build

```sh
npm run build
```

## test

```sh
npm run test
```
