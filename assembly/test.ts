import { JSON } from ".";
import { bytes } from "./util";
@json
class GenericEnum<T> {
  private tag: string = ""
  private value: T | null = null

  constructor() {
    this.tag = ""
    this.value = null
  }

  static create<T>(tag: string, value: T): GenericEnum<T> {
    const item = new GenericEnum<T>()
    item.tag = tag
    item.value = value
    return item
  }

  getTag(): string {
    return this.tag
  }

  getValue(): T | null {
    return this.value
  }

  @serializer
  serialize(self: GenericEnum<T>): string {
    const tagJson = JSON.stringify(self.tag)
    const valueJson = JSON.stringify(self.value)
    return `{"tag":${tagJson},"value":${valueJson}}`
  }

  @deserializer
  deserialize(data: string): GenericEnum<T> {
    const parsed = JSON.parse<Map<string, JSON.Raw>>(data);
    const result = new GenericEnum<T>();

    if (parsed.has("tag")) {
      result.tag = JSON.parse<string>(parsed.get("tag").data);
    }

    if (parsed.has("value")) {
      result.value = JSON.parse<T>(parsed.get("value").data);
    }

    return result;
  }
}

export function test(): void {
  const myEnum = GenericEnum.create<string>("test_tag", "test_value");
  // Serialize it
  const serialized = JSON.stringify<GenericEnum<string>>(myEnum);
  console.log("=== Serialized ===");
  console.log(serialized);
  console.log("=== Attempting to deserialize (this will crash) ===");

  // This line crashes
  const parsed = JSON.parse<GenericEnum<string>>(serialized);
  console.log("=== Deserialized ===");
  console.log(JSON.stringify(parsed))
}

test();