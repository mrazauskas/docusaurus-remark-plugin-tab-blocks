# docusaurus-remark-plugin-tab-blocks

> Turn Docusaurus code blocks into tab blocks.

[![version](https://img.shields.io/npm/v/docusaurus-remark-plugin-tab-blocks.svg)](https://npmjs.com/package/docusaurus-remark-plugin-tab-blocks)
[![license](https://img.shields.io/github/license/mrazauskas/docusaurus-remark-plugin-tab-blocks.svg)](https://github.com/mrazauskas/docusaurus-remark-plugin-tab-blocks/blob/main/LICENSE.md)

This Docusaurus plugin transforms markdown [code blocks](https://docusaurus.io/docs/next/markdown-features/code-blocks) into [tabs](https://docusaurus.io/docs/next/markdown-features/tabs). Just add the `tab` key to the language meta string:

    ```js tab
    console.log("Hello JavaScript tab!");
    ```

    ```ts tab
    console.log("Ahoy TypeScript tab!");
    ```

And you have:

<img src="https://github.com/mrazauskas/docusaurus-remark-plugin-tab-blocks/blob/main/.github/readme/quick-example.gif" width="640" />

**Note:** A Docusaurus theme with the `Tabs` and `TabItems` components is required.

## Install

```bash
yarn add docusaurus-remark-plugin-tab-blocks
# or
npm install docusaurus-remark-plugin-tab-blocks
```

## Usage

Add the plugin to the `remarkPlugins` list of your [Docusaurus configuration](https://docusaurus.io/docs/configuration):

```js
module.exports = {
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        blog: {
          remarkPlugins: [require("docusaurus-remark-plugin-tab-blocks")],
        },
        docs: {
          remarkPlugins: [
            [
              require("docusaurus-remark-plugin-tab-blocks"),
              { labels: [["py", "Python"]] }, // optional plugin configuration
            ],
          ],
        },
        pages: {
          remarkPlugins: [require("docusaurus-remark-plugin-tab-blocks")],
        },
      },
    ],
  ],
};
```

## API Reference

### Plugin configuration

Configuration options can be passed to the plugin using the tuple form. See usage example above.

#### `labels`

- Type: `Array<[string, string]>`
- Default: `[["js", "JavaScript"], ["ts", "TypeScript"]]`

List with tuples with code block language attribute and tab label text.

### `tab` options

Each tab can be customized separately by assign a configuration object to the `tab` key. Keep in mind that the object must be parsable JSON.

#### `span`

- Type: `number`

Use `span` option to make a tab span two or more code blocks.

    ```js tab={"span":2} title="SomeClass.js"
    module.exports = class SomeClass {
      method(a, b) {}
    };
    ```

    ```js title="SomeClass.test.js"
    const SomeClass = require("./SomeClass");

    // this and previous code blocks live in a single tab
    ```

    ```ts tab={"span":2} title="SomeClass.ts"
    export class SomeClass {
      method(a: string, b: string): void {}
    }
    ```

    ```ts title="SomeClass.test.ts"
    import { SomeClass } from "./SomeClass";

    // this and previous code blocks live in a single tab
    ```

The example above will be rendered like this:

<img src="https://github.com/mrazauskas/docusaurus-remark-plugin-tab-blocks/blob/main/.github/readme/span-example.gif" width="640" />

## Road Map

This is a young library. More features are on the way:

- [ ] custom `label` for each tab
- [ ] custom `groupId`

If you have an idea or see a missing feature, just open an issue or send a PR.

## License

[MIT](https://github.com/mrazauskas/docusaurus-remark-plugin-tab-blocks/blob/main/LICENSE.md)
