import { bs } from "../../../lib/as-bs";
import { dtoa_buffered } from "util/number";

// @ts-ignore: inline
@inline export function serializeFloat<T extends number>(data: T): void {
  bs.ensureSize(64);
  bs.offset += dtoa_buffered(bs.offset, data) << 1;
}
