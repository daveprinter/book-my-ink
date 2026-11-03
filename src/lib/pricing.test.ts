import { describe, expect, it } from "vitest";
import { quote } from "./pricing";

describe("quote", () => {
  it("applies the 20% discount", () => {
    expect(quote(180).final).toBe(144);
  });
  it("charges a $50 deposit and leaves the rest for the appointment day", () => {
    const q = quote(180);
    expect(q.deposit).toBe(50);
    expect(q.balance).toBe(94);
  });
});
