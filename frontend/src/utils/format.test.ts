import { describe, expect, it } from "vitest";
import { formatSecondsToMMSS, formatSeconds } from "./format";

describe("formatSecondsToMMSS", () => {
  it("formats 270 seconds as 04:30", () => {
    expect(formatSecondsToMMSS(270)).toBe("04:30");
  });

  it("formats 0 seconds as 00:00", () => {
    expect(formatSecondsToMMSS(0)).toBe("00:00");
  });

  it("formats 59 seconds as 00:59", () => {
    expect(formatSecondsToMMSS(59)).toBe("00:59");
  });

  it("formats 3661 seconds as 61:01", () => {
    expect(formatSecondsToMMSS(3661)).toBe("61:01");
  });
});

describe("formatSeconds", () => {
  it("formats 12.5 as 13s", () => {
    expect(formatSeconds(12.5)).toBe("13s");
  });

  it("formats 5 as 5s", () => {
    expect(formatSeconds(5)).toBe("5s");
  });
});
