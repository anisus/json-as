import { bench } from "./bench";
const vec = {
    x: 1,
    y: 2,
    z: 3,
};
bench("Serialize Vector3", () => {
    JSON.stringify(vec);
}, 25_000_000);
bench("Deserialize Vector3", () => {
    JSON.parse('{"x":1,"y":2,"z":3}');
}, 25_000_000);
//# sourceMappingURL=string.bench.js.map