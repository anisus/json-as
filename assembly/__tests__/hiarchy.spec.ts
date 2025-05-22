import { OBJECT, TOTAL_OVERHEAD } from "rt/common";
import { JSON } from "..";
import { describe, expect } from "./lib";

@json
class Foo {
  a: i32 = 0;
}

@json
class Bar extends Foo {
  b: i32 = 0;

  @serializer
  serialize(self: Bar): string {
    return `"bar"`;
  }
}

describe("should use custom serializer for subclasses", () => {
  const bar = new Bar();
  bar.a = 1;
  bar.b = 2;
  const data = JSON.stringify(bar);
  expect(data).toBe('"bar"');
});

describe("should use custom serializer for subclasses when type is the parent", () => {
  const bar = new Bar();
  bar.a = 1;
  bar.b = 2;
  const data = JSON.stringify<Foo>(bar);
  expect(data).toBe('"bar"');
});