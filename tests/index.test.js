import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path, { dirname } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { remark } from "remark";
import remarkMdx from "remark-mdx";
import tabBlocks from "docusaurus-remark-plugin-tab-blocks";

function getFixtureFileURL(fixtureName) {
  return new URL(
    path.join("__fixtures__", `${fixtureName}.md`),
    import.meta.url,
  );
}

function getSnapshotFileURL(fixtureName) {
  return new URL(
    path.join("__snapshots__", `${fixtureName}.snap.md`),
    import.meta.url,
  );
}

async function matchFile(sourceContent, fixtureName) {
  const fileURL = getSnapshotFileURL(fixtureName);

  if (existsSync(fileURL)) {
    const fileContent = (await fs.readFile(fileURL)).toString();

    assert.equal(sourceContent.replaceAll("\r\n", "\n"), fileContent);
  } else {
    if (process.env.CI) {
      throw new Error("Snapshots cannot be created in CI environment.");
    }

    fs.mkdir(dirname(fileURLToPath(fileURL)), { recursive: true });
    fs.writeFile(fileURL, sourceContent);
  }
}

async function processFixture(fixtureName, options) {
  const fileURL = getFixtureFileURL(fixtureName);
  const fileContent = await fs.readFile(fileURL);

  const result = await remark()
    .use(remarkMdx)
    .use(tabBlocks, options)
    .process(fileContent);

  return result.toString();
}

test("base example", async () => {
  const fixtureName = "base";
  const result = await processFixture(fixtureName);

  await matchFile(result, fixtureName);
});

test("full example", async () => {
  const fixtureName = "full-example";
  const result = await processFixture(fixtureName);

  await matchFile(result, fixtureName);
});

test("can be nested inside an admonition", async () => {
  const fixtureName = "inside-admonition";
  const result = await processFixture(fixtureName);

  await matchFile(result, fixtureName);
});

test("respects title meta", async () => {
  const fixtureName = "title";
  const result = await processFixture(fixtureName);

  await matchFile(result, fixtureName);
});

test("supports 'labels' option", async () => {
  const fixtureName = "label";
  const result = await processFixture(fixtureName, {
    labels: [
      ["js", "javascript"],
      ["py", "Python"],
    ],
  });

  await matchFile(result, fixtureName);
});

test("supports 'groupId' option", async () => {
  const fixtureName = "group-id";
  const result = await processFixture(fixtureName, {
    groupId: "some-test-group",
  });

  await matchFile(result, fixtureName);
});

test("supports 'span' meta", async () => {
  const fixtureName = "span";
  const result = await processFixture(fixtureName);

  await matchFile(result, fixtureName);
});

test("supports incomplete spans", async () => {
  const fixtureName = "span-incomplete";
  const result = await processFixture(fixtureName);

  await matchFile(result, fixtureName);
});

test("supports 'sync' option", async () => {
  const fixtureName = "sync";
  const result = await processFixture(fixtureName, { sync: false });

  await matchFile(result, fixtureName);
});

test("does not re-import tabs components when already imported above", async () => {
  const fixtureName = "import-tabs-above";
  const result = await processFixture(fixtureName);

  await matchFile(result, fixtureName);
});

test("does not re-import tabs components when already imported below", async () => {
  const fixtureName = "import-tabs-below";
  const result = await processFixture(fixtureName);

  await matchFile(result, fixtureName);
});
