import fs from "node:fs";
import path from "node:path";
import { remark } from "remark";
import remarkMdx from "remark-mdx";
import { plugin as tabBlocksPlugin } from "../plugin";

async function processFixture(fixture, options) {
  const fileURL = new URL(
    path.join("__fixtures__", `${fixture}.md`),
    import.meta.url,
  );
  const file = fs.readFileSync(fileURL);

  const result = await remark()
    .use(remarkMdx)
    .use(tabBlocksPlugin, options)
    .process(file);

  return result.toString();
}

describe("tab blocks plugin", () => {
  test("base example", async () => {
    const result = await processFixture("base");

    expect(result).toMatchSnapshot();
  });

  test("full example", async () => {
    const result = await processFixture("full-example");

    expect(result).toMatchSnapshot();
  });

  test("can be nested inside an admonition", async () => {
    const result = await processFixture("inside-admonition");

    expect(result).toMatchSnapshot();
  });

  test("respects title meta", async () => {
    const result = await processFixture("title");

    expect(result).toMatchSnapshot();
  });

  test("supports `labels` option", async () => {
    const result = await processFixture("label", {
      labels: [
        ["js", "javascript"],
        ["py", "Python"],
      ],
    });

    expect(result).toMatchSnapshot();
  });

  test("supports `groupId` option", async () => {
    const result = await processFixture("base", { groupId: "some-test-group" });

    expect(result).toMatchSnapshot();
  });

  test("supports `span` meta", async () => {
    const result = await processFixture("span");

    expect(result).toMatchSnapshot();
  });

  test("supports `sync` option", async () => {
    const result = await processFixture("base", { sync: false });

    expect(result).toMatchSnapshot();
  });

  test("ignores incomplete spans", async () => {
    const result = await processFixture("span-incomplete");

    expect(result).toMatchSnapshot();
  });

  test("does not re-import tabs components when already imported above", async () => {
    const result = await processFixture("import-tabs-above");

    expect(result).toMatchSnapshot();
  });

  test("does not re-import tabs components when already imported below", async () => {
    const result = await processFixture("import-tabs-below");

    expect(result).toMatchSnapshot();
  });
});
