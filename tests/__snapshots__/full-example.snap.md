import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

***

id: configuration
title: Configuring Jest
-----------------------

The configuration file should simply export an object:

<Tabs groupId="code-examples">
  <TabItem value="js" label="JavaScript">
    ```js tab
    /** @type {import("jest").Config} */
    const config = {
      verbose: true,
    };

    module.exports = config;
    ```
  </TabItem>

  <TabItem value="ts" label="TypeScript">
    ```ts tab
    import type { Config } from "jest";

    const config: Config = {
      verbose: true,
    };

    export default config;
    ```
  </TabItem>

  <TabItem value="json" label="JSON">
    ```json tab={"label":"JSON"}
    {
      "name": "my-project",
      "jest": {
        "verbose": true
      }
    }
    ```
  </TabItem>
</Tabs>

### `displayName` \[string, object]

Default: `undefined`

Allows for a label to be printed alongside a test while it is running. This becomes more useful in multi-project repositories where there can be many jest configuration files. This visually tells which project a test belongs to.

<Tabs groupId="code-examples">
  <TabItem value="js" label="JavaScript">
    ```js tab
    /** @type {import('jest').Config} */
    const config = {
      displayName: "CLIENT",
    };

    module.exports = config;
    ```
  </TabItem>

  <TabItem value="ts" label="TypeScript">
    ```ts tab
    import type { Config } from "jest";

    const config: Config = {
      displayName: "CLIENT",
    };

    export default config;
    ```
  </TabItem>
</Tabs>

Alternatively, an object with the properties `name` and `color` can be passed.

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

`.mockImplementation()` can also be used to mock class constructors:

<Tabs groupId="code-examples">
  <TabItem value="js" label="JavaScript">
    ```js tab={"span":2} title="SomeClass.js"
    module.exports = class SomeClass {
      method(a, b) {}
    };
    ```

    ```js title="SomeClass.test.js"
    const SomeClass = require("./SomeClass");

    jest.mock("./SomeClass"); // this happens automatically with automocking

    const mockMethod = jest.fn();
    SomeClass.mockImplementation(() => {
      return {
        method: mockMethod,
      };
    });

    const some = new SomeClass();
    some.method("a", "b");

    console.log("Calls to method: ", mockMethod.mock.calls);
    ```
  </TabItem>

  <TabItem value="ts" label="TypeScript">
    ```ts tab={"span":2} title="SomeClass.ts"
    export class SomeClass {
      method(a: string, b: string): void {}
    }
    ```

    ```ts title="SomeClass.test.ts"
    import { SomeClass } from "./SomeClass";

    jest.mock("./SomeClass"); // this happens automatically with automocking

    const mockMethod = jest.fn<(a: string, b: string) => void>();
    SomeClass.mockImplementation(() => {
      return {
        method: mockMethod,
      };
    });

    const some = new SomeClass();
    some.method("a", "b");

    console.log("Calls to method: ", mockMethod.mock.calls);
    ```
  </TabItem>
</Tabs>

A single item tab group also works:

<Tabs groupId="code-examples">
  <TabItem value="js" label="JavaScript">
    ```js tab
    console.log("Why not?");
    ```
  </TabItem>
</Tabs>
