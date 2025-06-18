import { OriginalTreeNode, TreeNode } from "./interface";

export const transformTreeNode = <T>(
  root: OriginalTreeNode<T>
): TreeNode<T> => {
  const tree: TreeNode<T> = {
    parent: null,
    nextSibling: null,
    prevSibling: null,
    value: root.value,
  };

  return tree;
};
