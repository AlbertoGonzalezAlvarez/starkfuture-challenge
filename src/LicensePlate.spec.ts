import { describe, expect, it } from "vitest";
import { getLicensePlate } from "./LicensePlate";

describe("LicensePlate", () => {
  it("should handle transition from all digits to first letter", () => {
    expect(getLicensePlate(999999)).toBe("999999");
    expect(getLicensePlate(1000000)).toBe("00000A");
    expect(getLicensePlate(1000001)).toBe("00001A");
  });

  it("should handle multiple letters with correct ordering", () => {
    expect(getLicensePlate(3600000)).toBe("0000AA");
    expect(getLicensePlate(3610000)).toBe("0000AB");
    expect(getLicensePlate(3860000)).toBe("0000BA");
  });

  it("should handle edge case with all letters (no digits)", () => {
    let total = 0;
    for (let letters = 0; letters <= 6; letters++) {
      const digits = 6 - letters;
      total += Math.pow(10, digits) * Math.pow(26, letters);
    }

    expect(getLicensePlate(total - 1)).toBe("ZZZZZZ");
  });

  it("should throw error for negative index", () => {
    expect(() => getLicensePlate(-1)).toThrow();
  });

  it("should throw error for invalid length", () => {
    expect(() => getLicensePlate(0, -1)).toThrow();
  });

  it("should throw error for index exceeding maximum", () => {
    let maxIndex = 0;
    for (let letters = 0; letters <= 6; letters++) {
      const digits = 6 - letters;
      maxIndex += Math.pow(10, digits) * Math.pow(26, letters);
    }

    expect(() => getLicensePlate(maxIndex)).toThrow();
  });
});
