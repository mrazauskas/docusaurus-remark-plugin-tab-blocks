import { expect, test } from "tstyche";

import tabBlocks, { type Options } from "docusaurus-remark-plugin-tab-blocks";

const options: Options = {};

test("tabBlocks()", () => {
  expect(tabBlocks()).type.toBe<void>();
  expect(tabBlocks(options)).type.toBe<void>();
});

test("Options", () => {
  expect(options).type.toBeAssignableWith({ groupId: "code-examples" });
  expect(options).type.toBeAssignableWith({
    labels: [
      ["js", "JavaScript"] as [string, string],
      ["ts", "TypeScript"] as [string, string],
    ],
  });
  expect(options).type.toBeAssignableWith({ sync: true });
});
