import type { Observable } from "rxjs";
import { map } from "rxjs";
import { decompressFromBase64 } from "lz-string";

export const maybeDecompressAndParseJson = <T = unknown>(observable: Observable<string>) => {
  const json = observable.pipe(map((data) => {
    if (data.startsWith("{") || data.startsWith("[")) {
      const json = JSON.parse(data);
      return json as T;
    }

    const decompressed = decompressFromBase64(data);
    const json = JSON.parse(decompressed);
    return json as T;
  }));

  return json;
}