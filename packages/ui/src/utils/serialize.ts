import { GroupNode, ConditionNode, Tree, TreeNode } from "@types";

const isGroup = (n: any): n is GroupNode => !!n.children;

export function serializeNode(node: GroupNode | ConditionNode): TreeNode {
  if (isGroup(node)) {
    const arr = node.children.map((childNode) =>
      serializeNode(childNode as GroupNode | ConditionNode)
    );
    return { [node.operator]: arr } as Tree;
  }

  const conditionNode = node as ConditionNode;
  const conditionValue = conditionNode?.value as
    | string
    | number
    | (string | number)[]
    | undefined;
  return {
    field: conditionNode.field,
    operator: conditionNode.operator,
    ...(conditionNode.value !== undefined ? { value: conditionValue } : {}),
  };
}

export function serialize(tree: GroupNode): Tree {
  return serializeNode(tree) as Tree;
}
