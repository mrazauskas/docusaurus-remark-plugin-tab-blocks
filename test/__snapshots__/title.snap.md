import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`.mockImplementation()` can also be used to mock class constructors:

<Tabs groupId="code-examples">
  <TabItem value="js" label="JavaScript">
    ```js tab title="SomeClass.js"
    module.exports = class SomeClass {
      method(a, b) {}
    };
    ```
  </TabItem>

  <TabItem value="ts" label="TypeScript">
    ```ts tab title="SomeClass.ts"
    export class SomeClass {
      method(a: string, b: string): void {}
    }
    ```
  </TabItem>
</Tabs>

### `mockFn.mockImplementationOnce(fn)`

Accepts a function that will be used as an implementation of the mock for one call to the mocked function. Can be chained so that multiple function calls produce different results.
