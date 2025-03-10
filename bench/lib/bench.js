export function bench(description, routine, ops = 1_000_000) {
    console.log(" - Benchmarking " + description);
    const start = Date.now();
    let count = ops;
    while (count !== 0) {
        routine();
        count--;
    }
    const elapsed = Date.now() - start;
    const opsPerSecond = Math.round((ops * 1000) / elapsed);
    const format = new Intl.NumberFormat("en-US");
    console.log(`   Completed benchmark in ${format.format(elapsed)}ms at ${format.format(opsPerSecond)} ops/s\n`);
}
//# sourceMappingURL=bench.js.map