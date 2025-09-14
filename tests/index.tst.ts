import tabBlocks, { type Options } from "docusaurus-remark-plugin-tab-blocks";
import { expect, test } from "tstyche";

test("tabBlocks()", () => {
  const options: Options = {};

  expect(tabBlocks()).type.toBe<void>();
  expect(tabBlocks(options)).type.toBe<void>();
});

test("Options", () => {
  expect<Options>().type.toBeAssignableFrom({});

  expect<Options>().type.toBeAssignableFrom({ groupId: "code-examples" });
  expect<Options>().type.toBeAssignableFrom({
    labels: [
      ["js", "JavaScript"] as [string, string],
      ["ts", "TypeScript"] as [string, string],
    ],
  });
  expect<Options>().type.toBeAssignableFrom({ sync: true });
});
