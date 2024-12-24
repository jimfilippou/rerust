import { describe, it, expect } from "vitest";
import { ok, err, isOk, isErr } from "./index";

describe("practical examples", () => {
  // Simulating a database query
  const findUser = (id: number) => {
    if (id === 1) return ok({ id: 1, name: "John" });
    return err("User not found");
  };

  it("should handle successful database query", () => {
    const result = findUser(1);
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.name).toBe("John");
    }
  });

  it("should handle failed database query", () => {
    const result = findUser(999);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.value).toBe("User not found");
    }
  });
});
