#!/bin/bash

mkdir -p ./build

for file in ./bench/*.bench.ts; do
  filename=$(basename -- "$file")

  echo -e "$filename\n"
  npx tsx "$file" || { echo "Benchmark failed."; exit 1; }
done

echo "Finished benchmarks."
