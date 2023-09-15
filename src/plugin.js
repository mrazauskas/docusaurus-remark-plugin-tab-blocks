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

function parseMeta(nodeMeta) {
  const parsedMeta = { span: 1 };
  const tabTag = nodeMeta.match(/tab(={.+})?/g);

  if (tabTag == null) {
    return null;
  }

  const tabMeta = tabTag[0].split("=")[1];

  if (tabMeta == null) {
    return parsedMeta;
  }

  return { ...parsedMeta, ...JSON.parse(tabMeta) };
}

function formatTabs(tabNodes, { groupId, labels, sync }) {
  function formatTabItem(nodes, meta) {
    const lang = nodes[0].lang;
    const label = meta.label ?? labels.get(lang);
    const value = meta.label?.toLowerCase().replace(" ", "-") ?? lang;

    return [
      {
        type: "jsx",
        value: `<TabItem value="${value}"${label ? ` label="${label}"` : ""}>`,
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
    ...tabNodes.map(([nodes, meta]) => formatTabItem(nodes, meta)),
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
      const meta = parseMeta(node.meta);
      if (!meta) break;

      const nodes = parent.children.slice(nodeIndex, nodeIndex + meta.span);

      if (
        nodes.length === meta.span &&
        nodes.every((node) => is(node, "code"))
      ) {
        tabNodes.push([nodes, meta]);
        nodeIndex += meta.span;
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
      const replacedCount = tabNodes.map(([nodes]) => nodes).flat().length;

      parent.children.splice(index, replacedCount, ...tabs);

      return index + tabs.length;
    });

    if (hasTabs && !includesImportTabs) {
      tree.children.unshift(...importNodes);
    }
  };
}

module.exports = { plugin };
