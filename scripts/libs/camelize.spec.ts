import { camelize } from "./camelize";

describe("camelize", () => {
  it("1 単語のとき、そのまま返す", () => {
    expect(camelize("space")).toBe("space");
  });

  it("2 単語のとき、キャメルケースに変換する", () => {
    expect(camelize("space-traders")).toBe("spaceTraders");
  });

  it("3 単語のとき、キャメルケースに変換する", () => {
    expect(camelize("space-traders-api")).toBe("spaceTradersApi");
  });
});
