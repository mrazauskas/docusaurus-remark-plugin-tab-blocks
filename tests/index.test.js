import assert from "node:assert";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import test from "node:test";
import tabBlocks from "docusaurus-remark-plugin-tab-blocks";
import { remark } from "remark";
import remarkMdx from "remark-mdx";

/**
 * @param {string} source
 * @param {string} fixtureName
 */
async function matchFile(source, fixtureName) {
  const fileUrl = new URL(
    `__snapshots__/${fixtureName}.snap.md`,
    import.meta.url,
  );

  if (existsSync(fileUrl)) {
    const target = await fs.readFile(fileUrl, { encoding: "utf8" });

    assert.strictEqual(
      source.replace(/\r\n/g, "\n"),
      target.replace(/\r\n/g, "\n"),
    );
  } else {
    if (process.env["CI"] != null) {
      throw new Error("Snapshots cannot be created in CI environment.");
    }

    fs.mkdir(new URL("__snapshots__", import.meta.url), { recursive: true });
    fs.writeFile(fileUrl, source);
  }
}

/**
 * @param {string} fixtureName
 * @param {import("docusaurus-remark-plugin-tab-blocks").Options} [options]
 */
async function processFixture(fixtureName, options) {
  const fileUrl = new URL(`__fixtures__/${fixtureName}.md`, import.meta.url);
  const fileContent = await fs.readFile(fileUrl);

  const result = await remark()
    .use(remarkMdx)
    .use(tabBlocks, options)
    .process(fileContent);

  return result.toString();
}

await test("base example", async () => {
  const fixtureName = "base";
  const result = await processFixture(fixtureName);

  await matchFile(result, fixtureName);
});

await test("full example", async () => {
  const fixtureName = "full-example";
  const result = await processFixture(fixtureName);

  await matchFile(result, fixtureName);
});

await test("can be nested inside an admonition", async () => {
  const fixtureName = "inside-admonition";
  const result = await processFixture(fixtureName);

  await matchFile(result, fixtureName);
});

await test("respects title meta", async () => {
  const fixtureName = "title";
  const result = await processFixture(fixtureName);

  await matchFile(result, fixtureName);
});

await test("supports 'labels' option", async () => {
  const fixtureName = "label";
  const result = await processFixture(fixtureName, {
    labels: [
      ["js", "javascript"],
      ["py", "Python"],
    ],
  });

  await matchFile(result, fixtureName);
});

await test("supports 'groupId' option", async () => {
  const fixtureName = "group-id";
  const result = await processFixture(fixtureName, {
    groupId: "some-test-group",
  });

  await matchFile(result, fixtureName);
});

await test("supports 'span' meta", async () => {
  const fixtureName = "span";
  const result = await processFixture(fixtureName);

  await matchFile(result, fixtureName);
});

await test("supports incomplete spans", async () => {
  const fixtureName = "span-incomplete";
  const result = await processFixture(fixtureName);

  await matchFile(result, fixtureName);
});

await test("supports 'sync' option", async () => {
  const fixtureName = "sync";
  const result = await processFixture(fixtureName, { sync: false });

  await matchFile(result, fixtureName);
});

await test("does not re-import tabs components when already imported above", async () => {
  const fixtureName = "import-tabs-above";
  const result = await processFixture(fixtureName);

  await matchFile(result, fixtureName);
});

await test("does not re-import tabs components when already imported below", async () => {
  const fixtureName = "import-tabs-below";
  const result = await processFixture(fixtureName);

  await matchFile(result, fixtureName);
});
