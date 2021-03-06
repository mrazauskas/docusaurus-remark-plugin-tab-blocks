const visit = require("unist-util-visit");
const is = require("unist-util-is");

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

function formatTabs(tabNodes, { groupId, labels, sync }) {
  function formatTabItem(nodes) {
    const lang = nodes[0].lang;
    const label = labels.get(lang);

    return [
      {
        type: "jsx",
        value: `<TabItem value="${lang}"${label ? ` label="${label}"` : ""}>`,
      },
      ...nodes,
      {
        type: "jsx",
        value: "</TabItem>",
      },
    ];
  }

  return [
    {
      type: "jsx",
      value: `<Tabs${sync ? ` groupId="${groupId}"` : ""}>`,
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

function resolveConfig(options) {
  return {
    groupId: options.groupId || "code-examples",
    labels: new Map([
      ["js", "JavaScript"],
      ["ts", "TypeScript"],
      ...(options.labels || []),
    ]),
    sync: options.sync ?? true,
  };
}

function plugin(options = {}) {
  const config = resolveConfig(options);

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
      const tabs = formatTabs(tabNodes, config);

      parent.children.splice(index, tabNodes.flat().length, ...tabs);

      return index + tabs.length;
    });

    if (hasTabs && !includesImportTabs) {
      tree.children.unshift(...importNodes);
    }
  };
}

module.exports = { plugin };
