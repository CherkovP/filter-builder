import base64 from "base64-js";
import { Encoding } from "@types";

const Encodings = {
  uri: (json: Record<string, any>) => encodeURIComponent(JSON.stringify(json)),
  b64: (json: Record<string, any>) => {
    const jsonString = JSON.stringify(json);
    const bytes = new TextEncoder().encode(jsonString);
    return base64.fromByteArray(bytes);
  },
};

export function encodeFilter(
  value: Record<string, any>,
  mode: Encoding = "uri"
) {
  return Encodings[mode](value);
}
