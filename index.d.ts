export interface Options {
  /**
   * The {@link https://docusaurus.io/docs/markdown-features/tabs#syncing-tab-choices | `groupId`}
   * property for all instances of `Tabs` component created by this plugin.
   */
  groupId?: string;
  /**
   * List with tuples with code block language attribute and tab label text.
   */
  labels?: Array<[string, string]>;
  /**
   * Whether tab choices should be {@link https://docusaurus.io/docs/markdown-features/tabs#syncing-tab-choices | synced}
   * between all tabs created by this plugin.
   */
  sync?: boolean;
}

/**
 * Turns Docusaurus {@link https://docusaurus.io/docs/next/markdown-features/code-blocks | code blocks}
 * into {@link https://docusaurus.io/docs/next/markdown-features/tabs | tabs}.
 */
declare function tabBlocks(options?: Options): void;

export default tabBlocks;
