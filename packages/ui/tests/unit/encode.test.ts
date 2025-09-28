import { describe, it, expect } from "vitest";
import { encodeFilter } from "../../src/utils/encode";
import base64 from "base64-js";

function decodeBase64Unicode(base64String: string): string {
  const bytes = base64.toByteArray(base64String);
  return new TextDecoder().decode(bytes);
}

describe("encode", () => {
  describe("encodeFilter", () => {
    describe("URI encoding (default)", () => {
      it("should encode simple object to URI format", () => {
        const obj = { name: "John", age: 30 };
        const result = encodeFilter(obj);
        const expected = encodeURIComponent(JSON.stringify(obj));

        expect(result).toBe(expected);
      });

      it("should encode object with array values", () => {
        const obj = { roles: ["admin", "user"], active: true };
        const result = encodeFilter(obj);
        const expected = encodeURIComponent(JSON.stringify(obj));

        expect(result).toBe(expected);
      });

      it("should encode object with nested objects", () => {
        const obj = {
          user: { name: "John", age: 30 },
          active: true,
        };
        const result = encodeFilter(obj);
        const expected = encodeURIComponent(JSON.stringify(obj));

        expect(result).toBe(expected);
      });

      it("should handle empty object", () => {
        const obj = {};
        const result = encodeFilter(obj);
        const expected = encodeURIComponent(JSON.stringify(obj));

        expect(result).toBe(expected);
      });

      it("should handle null and undefined values", () => {
        const obj = {
          nullValue: null,
          undefinedValue: undefined,
          name: "John",
        };
        const result = encodeFilter(obj);
        const expected = encodeURIComponent(JSON.stringify(obj));

        expect(result).toBe(expected);
      });

      it("should handle special characters", () => {
        const obj = {
          query: "hello world",
          special: "a+b=c&d",
          email: "user@example.com",
        };
        const result = encodeFilter(obj);
        const expected = encodeURIComponent(JSON.stringify(obj));

        expect(result).toBe(expected);
      });

      it("should handle boolean values", () => {
        const obj = { active: true, disabled: false };
        const result = encodeFilter(obj);
        const expected = encodeURIComponent(JSON.stringify(obj));

        expect(result).toBe(expected);
      });

      it("should handle numeric values including zero", () => {
        const obj = { count: 0, age: 25, score: -10 };
        const result = encodeFilter(obj);
        const expected = encodeURIComponent(JSON.stringify(obj));

        expect(result).toBe(expected);
      });

      it("should explicitly use uri mode", () => {
        const obj = { name: "John", age: 30 };
        const result = encodeFilter(obj, "uri");
        const expected = encodeURIComponent(JSON.stringify(obj));

        expect(result).toBe(expected);
      });
    });

    describe("Base64 encoding", () => {
      it("should encode simple object to base64 format", () => {
        const obj = { name: "John", age: 30 };
        const result = encodeFilter(obj, "b64");

        // Verify it's a valid base64 string that can be decoded
        const decoded = JSON.parse(decodeBase64Unicode(result));
        expect(decoded).toEqual(obj);
      });

      it("should encode complex nested object to base64", () => {
        const obj = {
          and: [
            { field: "name", operator: "eq", value: "John" },
            { field: "age", operator: "gt", value: 18 },
          ],
        };
        const result = encodeFilter(obj, "b64");

        const decoded = JSON.parse(decodeBase64Unicode(result));
        expect(decoded).toEqual(obj);
      });

      it("should encode array values correctly in base64", () => {
        const obj = {
          roles: ["admin", "user"],
          permissions: ["read", "write", "delete"],
        };
        const result = encodeFilter(obj, "b64");

        const decoded = JSON.parse(decodeBase64Unicode(result));
        expect(decoded).toEqual(obj);
      });

      it("should handle special characters in base64", () => {
        const obj = {
          query: "hello world + special chars!",
          unicode: "🔍 search",
          newlines: "line1\nline2",
        };
        const result = encodeFilter(obj, "b64");

        const decoded = JSON.parse(decodeBase64Unicode(result));
        expect(decoded.query).toBe(obj.query);
        expect(decoded.newlines).toBe(obj.newlines);
        expect(decoded.unicode).toBe(obj.unicode);
      });

      it("should handle empty object in base64", () => {
        const obj = {};
        const result = encodeFilter(obj, "b64");

        const decoded = JSON.parse(decodeBase64Unicode(result));
        expect(decoded).toEqual(obj);
      });

      it("should preserve null values in base64", () => {
        const obj = {
          nullValue: null,
          name: "John",
        };
        const result = encodeFilter(obj, "b64");

        const decoded = JSON.parse(decodeBase64Unicode(result));
        expect(decoded).toEqual(obj);
      });

      it("should return a valid base64 string", () => {
        const obj = { name: "John", age: 30 };
        const result = encodeFilter(obj, "b64");

        // Check that result is a string
        expect(typeof result).toBe("string");

        // Check that it's valid base64 by trying to decode it
        expect(() => base64.toByteArray(result)).not.toThrow();
      });
    });
  });

  describe("edge cases", () => {
    it("should handle objects with circular references gracefully", () => {
      const obj: any = { name: "test" };
      obj.circular = obj;

      expect(() => {
        encodeFilter(obj, "b64");
      }).toThrow();

      expect(() => {
        encodeFilter(obj, "uri");
      }).toThrow();
    });

    it("should handle undefined encoding mode gracefully", () => {
      const obj = { name: "John" };

      const result = encodeFilter(obj, undefined as any);
      const expected = encodeURIComponent(JSON.stringify(obj));
      expect(result).toBe(expected);
    });

    it("should handle unsupported encoding mode", () => {
      const obj = { name: "John" };

      expect(() => {
        encodeFilter(obj, "unsupported" as any);
      }).toThrow();
    });
  });
});
