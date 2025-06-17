export interface TreeNode<T> {
  parent: TreeNode<T> | null;
  children?: TreeNode<T>[];
  value: T;
}

export interface Tree<T> {
  root: TreeNode<T>;
}
