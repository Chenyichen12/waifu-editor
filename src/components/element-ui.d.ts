import { TreeNodeData } from 'element-ui/types/tree';

declare module 'element-ui/types/tree' {
  interface Tree<T = TreeNodeData> {
    filterNodeMethod?(value: string, data: T, node: any): boolean;
  }
}
