import { describe, it, expect } from "vitest";
import { incluye } from "./utils";

describe("incluye", () => {
  it("devuelve true si el elemento está en el array", () => {
    expect(incluye([1, 2, 3], 2)).toBe(true);
  });

  it("devuelve false si el elemento no está en el array", () => {
    expect(incluye([1, 2, 3], 4)).toBe(false);
  });

  it("funciona con strings", () => {
    expect(incluye(["a", "b", "c"], "b")).toBe(true);
  });

  it("devuelve false con array vacío", () => {
    expect(incluye([], "algo")).toBe(false);
  });
});
