import { expect, test } from "tstyche";
import tabBlocks, { type Options } from "../";

const options: Options = {};

test("tabBlocks()", () => {
  expect(tabBlocks()).type.toBeVoid();
  expect(tabBlocks(options)).type.toBeVoid();
});

test("Options", () => {
  expect(options).type.toBeAssignable({ groupId: "code-examples" });
  expect(options).type.toBeAssignable({
    labels: [
      ["js", "JavaScript"] as [string, string],
      ["ts", "TypeScript"] as [string, string],
    ],
  });
  expect(options).type.toBeAssignable({ sync: true });
});
