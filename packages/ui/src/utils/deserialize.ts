import {
  GroupNode,
  ConditionNode,
  LogicalOperator,
  Tree,
  TreeNode,
  ConditionTreeNode,
} from "@types";
import { uid } from "@utils/id";

function isConditionTreeNode(o: TreeNode): o is ConditionTreeNode {
  return o && !o.hasOwnProperty("and") && !o.hasOwnProperty("or");
}

export function deserialize(tree: TreeNode): GroupNode {
  if (isConditionTreeNode(tree)) {
    return {
      id: uid(),
      operator: "and",
      children: [deserializeCondition(tree)],
    };
  }
  const key = Object.keys(tree)[0] as LogicalOperator;
  const arr = Object.values(tree)[0];
  const children = arr.map((it) =>
    isConditionTreeNode(it) ? deserializeCondition(it) : deserialize(it)
  );
  return { id: uid(), operator: key, children };
}

function deserializeCondition(o: ConditionTreeNode): ConditionNode {
  return {
    id: uid(),
    field: o.field,
    operator: o.operator,
    value: o.hasOwnProperty("value") ? o.value : undefined,
  };
}
