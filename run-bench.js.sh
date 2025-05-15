#!/bin/bash
JITS=${JITS:-"ignition liftoff sparkplug turbofan"}
npx tsc -p ./bench
for file in ./bench/*.bench.ts; do
  filename=$(basename -- "$file")
  file_js="${filename%.ts}"

  output="./build/${filename%.ts}.wasm"

  for jit in $JITS; do
    echo -e "$filename (js/$jit)\n"

    arg="${filename%.ts}.${runtime}.wasm"
    if [[ "$jit" == "ignition" ]]; then
      v8 --no-opt --module ./build/$file_js
    fi

    if [[ "$jit" == "liftoff" ]]; then
      v8 --liftoff-only --no-opt --module ./build/$file_js
    fi
    
    if [[ "$jit" == "sparkplug" ]]; then
      v8 --sparkplug --always-sparkplug --no-opt --module ./build/$file_js
    fi

    if [[ "$jit" == "turbofan" ]]; then
      v8 --no-liftoff --no-wasm-tier-up --module ./build/$file_js
    fi
  done
done

echo "Finished benchmarks"
