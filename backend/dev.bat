@echo off
set NODE_OPTIONS=--loader ts-node/esm --experimental-specifier-resolution=node --no-warnings
nodemon src/index.ts 