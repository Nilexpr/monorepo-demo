export interface TreeNode<T> {
  parent: TreeNode<T> | null;

  nextSibling: TreeNode<T> | null;
  prevSibling: TreeNode<T> | null;

  children?: TreeNode<T>[];
  value: T;
}

export type Tree<T> = TreeNode<T>[];

export interface OriginalTreeNode<T> {
  children?: OriginalTreeNode<T>[];
  value: T;
}
