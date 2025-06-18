export interface TreeNode<T> {
  parent: TreeNode<T> | null;
  children?: TreeNode<T>[];
  value: T;
}

export type Tree<T> = TreeNode<T> | TreeNode<T>[];
