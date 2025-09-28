import {
  ConditionNode,
  ConditionOperator,
  FieldSchema,
  FieldType,
  GroupNode,
} from "@types";
import ConditionRow from "@components/ConditionRow/index";
import { useT } from "@context/TranslationContext";
import useGroupEditor from "./useGroupEditor";

export default function GroupEditor({
  node,
  schema,
  operatorsByType,
  onChange,
  classNames = {},
}: {
  node: GroupNode;
  schema: FieldSchema[];
  operatorsByType: Partial<Record<FieldType, readonly ConditionOperator[]>>;
  onChange: (node: GroupNode) => void;
  classNames?: Partial<Record<string, string>>;
}) {
  const t = useT();

  const { updateChild, addCondition, addGroup, remove, toggleOp } =
    useGroupEditor(node, onChange, operatorsByType, schema);

  return (
    <div
      data-testid="group"
      className={classNames.group || "border p-3 rounded"}
    >
      <div className={classNames.controls || "flex gap-2 mb-2 items-center"}>
        <button
          onClick={toggleOp}
          aria-pressed={node.operator === "or"}
          className={classNames.button || "px-2 py-1 border rounded"}
        >
          {t(`operators.${node.operator}`)}
        </button>
        <button
          onClick={addCondition}
          className={classNames.button || "px-2 py-1 border rounded"}
        >
          {t("buttons.addCondition")}
        </button>
        <button
          onClick={addGroup}
          className={classNames.button || "px-2 py-1 border rounded"}
        >
          {t("buttons.addGroup")}
        </button>
      </div>

      <div className={classNames.children || "flex flex-col gap-2"}>
        {node.children.map((child: ConditionNode | GroupNode, idx: number) => (
          <div key={child.id} className={classNames.childWrapper || ""}>
            {"children" in child ? (
              <div>
                <GroupEditor
                  node={child}
                  schema={schema}
                  operatorsByType={operatorsByType}
                  onChange={(n: GroupNode) => updateChild(idx, n)}
                  classNames={classNames}
                />
                <div className="mt-1">
                  <button
                    onClick={() => remove(idx)}
                    className={classNames.button || "text-sm text-red-600"}
                  >
                    {t("buttons.removeGroup")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ConditionRow
                  condition={child}
                  schema={schema}
                  operatorsByType={operatorsByType}
                  onChange={(c: ConditionNode) => updateChild(idx, c)}
                  classNames={classNames}
                />
                <button
                  onClick={() => remove(idx)}
                  className={classNames.button || "text-sm text-red-600"}
                >
                  {t("buttons.remove")}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
