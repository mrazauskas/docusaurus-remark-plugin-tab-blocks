import fs from "node:fs";
import path from "node:path";
import remark from "remark";
import remarkMdx from "remark-mdx";

afterEach(() => {
  jest.resetModules();
});

async function processFixture(fixture, options) {
  const tabBlocksPlugin = (await import("../")).default;

  const filePath = path.join(__dirname, "__fixtures__", `${fixture}.md`);
  const file = fs.readFileSync(filePath);

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

  test("supports custom labels", async () => {
    const result = await processFixture("label", {
      labels: [
        ["js", "javascript"],
        ["py", "Python"],
      ],
    });

    expect(result).toMatchSnapshot();
  });

  test("supports span meta", async () => {
    const result = await processFixture("span");

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
