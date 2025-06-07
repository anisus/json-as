import { JSON } from "..";
import { expect } from "../__tests__/lib";
import { bench } from "./lib/bench";

const v1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const v2 = '"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"';

expect(JSON.stringify(v1)).toBe(v2);

bench(
  "Serialize Alphabet",
  () => {
    inline.always(JSON.stringify(v1));
  },
  64_000_00,
);

bench(
  "Deserialize Alphabet",
  () => {
    inline.always(JSON.parse<string>(v2));
  },
  64_000_00,
);
