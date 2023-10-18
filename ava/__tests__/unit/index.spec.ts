import { expect, test } from "vitest";
import { Auto, autolib } from "../../src";

test("g2-extension-ava should export expected marks", () => {
  expect(Auto).toBeDefined();
});

test("autolib should export expected marks", () => {
  expect(autolib()).toEqual({
    "mark.auto": Auto,
  });
});
