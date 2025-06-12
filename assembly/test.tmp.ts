import {
  bs
} from "../lib/as-bs";
import {
  JSON
} from ".";
@json
class ByteArray extends Uint8Array {
  constructor(length: i32) {
    (length);
  }
  @serializer
  @inline
  serialize(): string {
    return `"${toHexString(this.buffer)}"`;
  }
  @deserializer
  @inline
  deserialize(data: string): ByteArray {
    if (data.charCodeAt(0) != 34 || data.charCodeAt(data.length - 1) != 34) throw new Error("Expected Address to be of type string but found otherwise!");
;
    const out = new ByteArray((data.length / 2) - i32(data.startsWith("0x")));
    store<ArrayBuffer>(changetype<usize>(out), fromHexString(data), offsetof<ByteArray>("buffer"));
    return out;
  }
  static wrap(buffer: ArrayBuffer, byteOffset: i32 = 0, length: i32 = -1): ByteArray {
    return changetype<ByteArray>(Uint8Array.wrap(buffer, byteOffset, length));
  }
  __SERIALIZE(ptr: usize): void {
    const data = this.serialize();
    const dataSize = data.length << 1;
    memory.copy(bs.offset, changetype<usize>(data), dataSize);
    bs.offset += dataSize;
  }
  @inline
  __INITIALIZE(): this {
    return this;
  }
  __DESERIALIZE<__JSON_T>(srcStart: usize, srcEnd: usize, out: __JSON_T): __JSON_T {
    return inline.always(this.deserialize(JSON.Util.ptrToStr(srcStart, srcEnd)));
  }
}
function toHexString(buffer: ArrayBuffer): string {
  const view = Uint8Array.wrap(buffer);
  let hex = "0x";
  for (let i = 0; i < view.length; i++) {
    let byte = view[i];
    hex += byte.toString(16).padStart(2, "0");
  }
  return hex;
}
function fromHexString(data: string): ArrayBuffer {
  if (data.startsWith("\"0x") || data.startsWith("\"0X")) {
    data = data.slice(3, data.length - 1);
  } else {
    data = data.slice(1, data.length - 1);
  }
  const length = data.length >>> 1;
  const buffer = new ArrayBuffer(length);
  const view = Uint8Array.wrap(buffer);
  for (let i = 0; i < length; i++) {
    const hexByte = data.substr(i * 2, 2);
    view[i] = i8.parse(hexByte, 16);
  }
  return buffer;
}
const s1 = JSON.stringify(ByteArray.wrap(String.UTF8.encode("Hello there")));
console.log("s1: " + s1);
const s2 = JSON.parse<ByteArray>(s1);
console.log("s2: " + JSON.stringify(s2));
