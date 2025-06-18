import { OriginalTreeNode, Tree, TreeNode } from "./interface";

export * from "./utils";

export const transformTreeNode = <T>(
  root: OriginalTreeNode<T>,
  parent?: TreeNode<T>
): TreeNode<T> => {
  const tree: TreeNode<T> = {
    parent,
    value: root.value,
  };

  const children = root.children
    ?.map((child) => {
      return transformTreeNode(child, tree);
    })
    .map((child, index, array) => {
      const nextSibling =
        index + 1 === array.length ? undefined : array[index + 1];
      const prevSibling = index === 0 ? undefined : array[index - 1];

      return {
        ...child,
        nextSibling,
        prevSibling,
      };
    });

  tree.children = children;

  return tree;
};

export const createTree = <T>(roots: OriginalTreeNode<T>[]): Tree<T> => {
  return roots.map((root) => transformTreeNode(root));
};
