#!/bin/bash
RUNTIMES=${RUNTIMES:-"stub minimal incremental"}
JITS=${JITS:-"ignition sparkplug liftoff turbofan"}
for file in ./assembly/__benches__/*.bench.ts; do
    file_js="${file%.ts}"
    filename=$(basename -- "$file")

    npx tsc $file --outFile ./build/$file_js

    for runtime in $RUNTIMES; do
        output="./build/${filename%.ts}.${runtime}.wasm"

        npx asc "$file" --transform ./transform -o "$output" --optimizeLevel 3 --shrinkLevel 0 --converge --noAssert --uncheckedBehavior always --runtime $runtime --enable simd --enable bulk-memory --exportStart start || {
            echo "Build failed"
            exit 1
        }

        for jit in $JITS; do
            echo -e "$filename (asc/$runtime/$jit)\n"

            arg="${filename%.ts}.${runtime}.wasm"
            if [[ "$jit" == "ignition" ]]; then
                v8 --no-opt --module ./bench/runners/assemblyscript.js -- $arg
            fi

            if [[ "$jit" == "sparkplug" ]]; then
                v8 --sparkplug --always-sparkplug --no-opt --module ./bench/runners/assemblyscript.js -- $arg
            fi

            if [[ "$jit" == "liftoff" ]]; then
                v8 --liftoff-only --no-opt --module ./bench/runners/assemblyscript.js -- $arg
            fi

            if [[ "$jit" == "turbofan" ]]; then
                v8 --no-liftoff --no-wasm-tier-up --module ./bench/runners/assemblyscript.js -- $arg
            fi

            echo -e "$filename (js/$jit)\n"

            arg="${filename%.ts}.${runtime}.wasm"
            if [[ "$jit" == "ignition" ]]; then
                v8 --no-opt --module ./bench/$file_js
            fi

            if [[ "$jit" == "sparkplug" ]]; then
                v8 --sparkplug --always-sparkplug --no-opt --module ./build/$file_js
            fi

            if [[ "$jit" == "liftoff" ]]; then
                v8 --liftoff-only --no-opt --module ./build/$file_js
            fi

            if [[ "$jit" == "turbofan" ]]; then
                v8 --no-liftoff --no-wasm-tier-up --module ./build/$file_js
            fi
        done
    done
done

echo "Finished benchmarks"
