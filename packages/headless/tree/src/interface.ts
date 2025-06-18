export interface TreeNode<T> {
  parent?: TreeNode<T>;

  nextSibling?: TreeNode<T>;
  prevSibling?: TreeNode<T>;

  children?: TreeNode<T>[];
  value: T;
}

export type Tree<T> = TreeNode<T>[];

export interface OriginalTreeNode<T> {
  children?: OriginalTreeNode<T>[];
  value: T;
}
