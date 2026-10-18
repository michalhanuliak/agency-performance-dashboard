import { describe, it, expect } from "vitest";
import { computeInsertionIndex } from "./edgeBasedCollision";

describe("computeInsertionIndex", () => {
  const rect = (left: number, top: number, width: number, height: number) => ({
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
  });

  const items = [
    { id: "a", rect: rect(0, 0, 100, 80), colSpan: 1 as const },
    { id: "b", rect: rect(100, 0, 100, 80), colSpan: 1 as const },
    { id: "c", rect: rect(200, 0, 200, 80), colSpan: 2 as const },
    { id: "d", rect: rect(0, 80, 400, 80), colSpan: 4 as const },
  ];

  it("returns null when pointer is not over any widget", () => {
    const result = computeInsertionIndex(items, { x: 500, y: 500 }, "a");
    expect(result).toBeNull();
  });

  it("returns before when pointer is on left half of colSpan-1 widget", () => {
    const result = computeInsertionIndex(items, { x: 120, y: 40 }, "a");
    expect(result).toEqual({ overId: "b", side: "before" });
  });

  it("returns after when pointer is on right half of colSpan-1 widget", () => {
    const result = computeInsertionIndex(items, { x: 180, y: 40 }, "a");
    expect(result).toEqual({ overId: "b", side: "after" });
  });

  it("returns before when pointer is on left half of colSpan-2 widget", () => {
    const result = computeInsertionIndex(items, { x: 250, y: 40 }, "a");
    expect(result).toEqual({ overId: "c", side: "before" });
  });

  it("returns after when pointer is on right half of colSpan-2 widget", () => {
    const result = computeInsertionIndex(items, { x: 350, y: 40 }, "a");
    expect(result).toEqual({ overId: "c", side: "after" });
  });

  it("returns before when pointer is on top half of colSpan-4 (full-width) widget", () => {
    const result = computeInsertionIndex(items, { x: 200, y: 100 }, "a");
    expect(result).toEqual({ overId: "d", side: "before" });
  });

  it("returns after when pointer is on bottom half of colSpan-4 (full-width) widget", () => {
    const result = computeInsertionIndex(items, { x: 200, y: 140 }, "a");
    expect(result).toEqual({ overId: "d", side: "after" });
  });

  it("skips the actively dragged widget", () => {
    const result = computeInsertionIndex(items, { x: 50, y: 40 }, "a");
    expect(result).toBeNull();
  });
});
