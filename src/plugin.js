const visit = require("unist-util-visit");
const is = require("unist-util-is");

const importNodes = {
  data: {
    estree: {
      body: [
        {
          source: {
            raw: "'@theme/Tabs'",
            type: "Literal",
            value: "@theme/Tabs",
          },
          specifiers: [
            {
              local: { name: "Tabs", type: "Identifier" },
              type: "ImportDefaultSpecifier",
            },
          ],
          type: "ImportDeclaration",
        },
        {
          source: {
            raw: "'@theme/TabItem'",
            type: "Literal",
            value: "@theme/TabItem",
          },
          specifiers: [
            {
              local: { name: "TabItem", type: "Identifier" },
              type: "ImportDefaultSpecifier",
            },
          ],
          type: "ImportDeclaration",
        },
      ],
      type: "Program",
    },
  },
  type: "mdxjsEsm",
  value:
    "import Tabs from '@theme/Tabs';\nimport TabItem from '@theme/TabItem';",
};

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

function createTabs(tabNodes, { groupId, labels, sync }) {
  const attributes = [];

  if (sync) {
    attributes.push({
      name: "groupId",
      type: "mdxJsxAttribute",
      value: groupId,
    });
  }

  const children = tabNodes.map(([nodes, meta]) => {
    const lang = nodes[0].lang;
    const label = meta.label ?? labels.get(lang);
    const value = meta.label?.toLowerCase().replace(" ", "-") ?? lang;

    const attributes = [{ name: "value", type: "mdxJsxAttribute", value }];

    if (label != null) {
      attributes.push({ name: "label", type: "mdxJsxAttribute", value: label });
    }

    return {
      attributes,
      children: nodes,
      name: "TabItem",
      type: "mdxJsxFlowElement",
    };
  });

  return { attributes, children, name: "Tabs", type: "mdxJsxFlowElement" };
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

    visit(tree, ["code", "mdxjsEsm"], (node, index, parent) => {
      if (is(node, "mdxjsEsm") && node.value.includes("@theme/Tabs")) {
        includesImportTabs = true;

        return;
      }

      const tabNodes = collectTabNodes(parent, index);
      if (!tabNodes) return;

      hasTabs = true;
      const tabs = createTabs(tabNodes, config);

      const replacedCount = tabNodes.reduce(
        (nodesCount, [nodes]) => nodesCount + nodes.length,
        0,
      );

      parent.children.splice(index, replacedCount, tabs);
    });

    if (hasTabs && !includesImportTabs) {
      tree.children.unshift(importNodes);
    }
  };
}

module.exports = { plugin };
