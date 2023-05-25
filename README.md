# docusaurus-remark-plugin-tab-blocks

> Turn Docusaurus code blocks into tab blocks.

[![version](https://img.shields.io/npm/v/docusaurus-remark-plugin-tab-blocks)](https://npmjs.com/package/docusaurus-remark-plugin-tab-blocks)
[![license](https://img.shields.io/github/license/mrazauskas/docusaurus-remark-plugin-tab-blocks)](https://github.com/mrazauskas/docusaurus-remark-plugin-tab-blocks/blob/main/LICENSE.md)
[![node-ci](https://img.shields.io/github/actions/workflow/status/mrazauskas/docusaurus-remark-plugin-tab-blocks/node-ci.yml?label=CI)](https://github.com/mrazauskas/docusaurus-remark-plugin-tab-blocks/actions/workflows/node-ci.yml)
[![coverage](https://img.shields.io/codecov/c/github/mrazauskas/docusaurus-remark-plugin-tab-blocks/main)](https://app.codecov.io/gh/mrazauskas/docusaurus-remark-plugin-tab-blocks)

This Docusaurus plugin transforms markdown [code blocks](https://docusaurus.io/docs/next/markdown-features/code-blocks) into [tabs](https://docusaurus.io/docs/next/markdown-features/tabs). Just add the `tab` key to the language meta string:

    ```js tab
    console.log("Hello JavaScript tab!");
    ```

    ```ts tab
    console.log("Ahoy TypeScript tab!");
    ```

And you have:

<img src="https://github.com/mrazauskas/docusaurus-remark-plugin-tab-blocks/blob/main/.github/readme/quick-example.gif" width="640" />

> **Note** A Docusaurus theme with the `Tabs` and `TabItems` components is required.

## Install

```bash
npm install docusaurus-remark-plugin-tab-blocks
# or
yarn add docusaurus-remark-plugin-tab-blocks
```

> **Note** To use the plugin with the latest [canary releases](https://docusaurus.io/community/canary) of Docusaurus, install `docusaurus-remark-plugin-tab-blocks@next`.

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
              // optional plugin configuration
              {
                labels: [
                  ["json", "JSON"],
                  ["jsx", "JSX"],
                  ["tsx", "TSX"],
                ],
              },
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

#### `groupId`

- Type: `string`
- Default: `"code-examples"`

The [`groupId`](https://docusaurus.io/docs/markdown-features/tabs#syncing-tab-choices) property for all instances of `Tabs` component created by this plugin. Applicable only if `sync` option is set to `true`.

#### `labels`

- Type: `Array<[string, string]>`
- Default: `[["js", "JavaScript"], ["ts", "TypeScript"]]`

List with tuples with code block language attribute and tab label text.

#### `sync`

- Type: `boolean`
- Default: `true`

Whether tab choices should be [synced](https://docusaurus.io/docs/markdown-features/tabs#syncing-tab-choices) between all tabs created by this plugin.

### `tab` options

Each tab can be customized separately by assign a configuration object to the `tab` key. Keep in mind that the object must be parsable JSON.

#### `label`

- Type: `string`

Sets custom tab label text.

    ```bash tab={"label":"npm"}
    npm install docusaurus-remark-plugin-tab-blocks
    ```

    ```bash tab={"label":"yarn"}
    yarn add docusaurus-remark-plugin-tab-blocks
    ```

#### `span`

- Type: `number`

Makes a single tab wrap two or more code blocks.

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

## License

[MIT](https://github.com/mrazauskas/docusaurus-remark-plugin-tab-blocks/blob/main/LICENSE.md)
