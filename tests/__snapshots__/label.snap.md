import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="code-examples">
  <TabItem value="js" label="javascript">
    ```js tab
    console.log("custom javascript instead of default JavaScript label");
    ```
  </TabItem>

  <TabItem value="typescript">
    ```typescript tab
    console.log("fallback typescript label");
    ```
  </TabItem>

  <TabItem value="ts" label="TypeScript">
    ```ts tab
    console.log("default TypeScript label");
    ```
  </TabItem>

  <TabItem value="python">
    ```python tab
    print('fallback python label');
    ```
  </TabItem>

  <TabItem value="py" label="Python">
    ```py tab
    print('custom Python label');
    ```
  </TabItem>

  <TabItem value="macos" label="macOS">
    ```bash tab={"label":"macOS"}
    custom macOS label
    ```
  </TabItem>

  <TabItem value="windows" label="Windows">
    ```bash tab={"label":"Windows"}
    custom Windows label
    ```
  </TabItem>

  <TabItem value="chrome-headless" label="Chrome headless">
    ```json title="spec/config.json" tab={"label":"Chrome headless"}
    { "failFast": true }
    ```
  </TabItem>

  <TabItem value="chrome-non-headless" label="Chrome non-headless">
    ```json title="spec/config.json" tab={"label":"Chrome non-headless"}
    { "failFast": true }
    ```
  </TabItem>

  <TabItem value="firefox" label="Firefox">
    ```json title="spec/config.json" tab={"label":"Firefox"}
    { "failFast": true }
    ```
  </TabItem>
</Tabs>
