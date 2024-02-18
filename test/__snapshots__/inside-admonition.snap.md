import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

### `fakeTimers` \[object]

Default: `{}`

The fake timers may be useful when a piece of code sets a long timeout that we don't want to wait for in a test.

:::tip

Instead of including `jest.useFakeTimers()` in each test file, you can enable fake timers globally for all tests in your Jest configuration:

<Tabs groupId="code-examples">
  <TabItem value="js" label="JavaScript">
    ```js tab
    /** @type {import('jest').Config} */
    const config = {
      fakeTimers: {
        enableGlobally: true,
      },
    };

    module.exports = config;
    ```
  </TabItem>

  <TabItem value="ts" label="TypeScript">
    ```ts tab
    import type { Config } from "jest";

    const config: Config = {
      fakeTimers: {
        enableGlobally: true,
      },
    };

    export default config;
    ```
  </TabItem>
</Tabs>

:::

Configuration options:
