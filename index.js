const visit = require("unist-util-visit");
const is = require("unist-util-is");

let tabLabel = [
  ["js", "JavaScript"],
  ["ts", "TypeScript"],
];

const importNodes = [
  {
    type: "import",
    value: "import Tabs from '@theme/Tabs';",
  },
  {
    type: "import",
    value: "import TabItem from '@theme/TabItem';",
  },
];

function parseTabMeta(nodeMeta) {
  const tabTag = nodeMeta.split(" ").filter((tag) => tag.startsWith("tab"));
  if (tabTag.length < 1) return null;

  const tabMeta = tabTag[0].split("=")[1] || "{}";

  return { span: 1, ...JSON.parse(tabMeta) };
}

function formatTabItem(nodes) {
  const lang = nodes[0].lang;

  return [
    {
      type: "jsx",
      value: `<TabItem value="${lang}" label="${tabLabel.get(lang) || lang}">`,
    },
    ...nodes,
    {
      type: "jsx",
      value: "</TabItem>",
    },
  ];
}

function formatTabs(tabNodes) {
  return [
    {
      type: "jsx",
      value: '<Tabs groupId="code-examples">',
    },
    ...tabNodes.map((node) => formatTabItem(node)),
    {
      type: "jsx",
      value: "</Tabs>",
    },
  ].flat();
}

function collectTabNodes(parent, index) {
  let nodeIndex = index;
  const tabNodes = [];

  do {
    const node = parent.children[nodeIndex];

    if (is(node, "code") && typeof node.meta === "string") {
      const tabMeta = parseTabMeta(node.meta);
      if (!tabMeta) break;

      const nodes = parent.children.slice(nodeIndex, nodeIndex + tabMeta.span);

      if (
        nodes.length === tabMeta.span &&
        nodes.every((node) => is(node, "code"))
      ) {
        tabNodes.push(nodes);
        nodeIndex += tabMeta.span;
      } else {
        break;
      }
    } else {
      break;
    }
  } while (nodeIndex <= parent.children.length);

  if (tabNodes.length <= 1) return null;

  return tabNodes;
}

module.exports = function plugin({ labels = [] } = {}) {
  tabLabel = new Map([...tabLabel, ...labels]);

  return function transformer(tree) {
    let hasTabs = false;
    let includesImportTabs = false;

    visit(tree, ["code", "import"], (node, index, parent) => {
      if (is(node, "import") && node.value.includes("@theme/Tabs")) {
        includesImportTabs = true;

        return;
      }

      const tabNodes = collectTabNodes(parent, index);
      if (!tabNodes) return;

      hasTabs = true;
      const tabs = formatTabs(tabNodes);

      parent.children.splice(index, tabNodes.flat().length, ...tabs);

      return index + tabs.length;
    });

    if (hasTabs && !includesImportTabs) {
      tree.children.unshift(...importNodes);
    }
  };
};
