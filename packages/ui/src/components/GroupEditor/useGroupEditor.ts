import {
  ConditionNode,
  ConditionOperator,
  FieldSchema,
  FieldType,
  GroupNode,
  OperatorsByType,
} from "@types";
import { uid } from "@utils/id";

const useGroupEditor = (
  node: GroupNode,
  onChange: (node: GroupNode) => void,
  operatorsByType: Partial<Record<FieldType, readonly ConditionOperator[]>>,
  schema: FieldSchema[]
) => {
  const updateChild = (i: number, child: GroupNode | ConditionNode) => {
    const next = { ...node, children: node.children.slice() };
    next.children[i] = child;
    onChange(next);
  };

  const addCondition = () => {
    const defField = schema[0];
    const cond: ConditionNode = {
      id: uid(),
      field: defField.name,
      operator: ((operatorsByType[
        defField.type as keyof typeof operatorsByType
      ] as ConditionOperator[]) || ["eq"])[0],
      value: undefined,
      type: defField.type,
    };
    onChange({ ...node, children: [...node.children, cond] });
  };

  const addGroup = () => {
    onChange({
      ...node,
      children: [
        ...node.children,
        { id: uid(), operator: "and", children: [] },
      ],
    });
  };

  const remove = (i: number) => {
    onChange({
      ...node,
      children: node.children.filter((_, index) => index !== i),
    });
  };

  const toggleOp = () => {
    onChange({
      ...node,
      operator: node.operator === "and" ? "or" : "and",
    });
  };

  return {
    updateChild,
    addCondition,
    addGroup,
    remove,
    toggleOp,
  };
};

export default useGroupEditor;
