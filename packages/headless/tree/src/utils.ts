import { createTree } from "./index";

const transformJsonToTreeNode = (json: Record<string, any>) => {
  Object.entries(json).map(([key, value]) => {
    if (typeof value === "object") {
      return {
        value: {
          [key]: transformJsonToTreeNode(value),
        },
      };
    }
    return {
      value: {
        [key]: value,
      },
    };
  });
};

export const createTreeFromJson = (json: Record<string, any>) => {
  const tree = transformJsonToTreeNode(json);

  return createTree(tree);
};
