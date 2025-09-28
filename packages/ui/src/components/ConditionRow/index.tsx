import { useMemo } from "react";

import {
  FieldSchema,
  ConditionNode,
  FieldType,
  ConditionOperator,
} from "@types";
import ValueInput from "@components/ValueInput";
import { useT } from "@context/TranslationContext";

type ConditionRowProps = {
  condition: ConditionNode;
  schema: FieldSchema[];
  operatorsByType: Partial<Record<FieldType, readonly ConditionOperator[]>>;
  onChange: (node: ConditionNode) => void;
  classNames?: Partial<Record<string, string>>;
};
export default function ConditionRow({
  condition,
  schema,
  operatorsByType,
  onChange,
  classNames = {},
}: ConditionRowProps) {
  const t = useT();

  const field = useMemo(
    () =>
      schema.find((s: FieldSchema) => s.name === condition.field) || schema[0],
    [condition.field, schema]
  );
  const ops = operatorsByType[field.type] ||
    operatorsByType["string"] || ["eq"];

  const setField = (name: string) => {
    const f = schema.find((s: FieldSchema) => s.name === name)!;
    onChange({
      ...condition,
      field: name,
      type: f.type,
      operator: (operatorsByType[f.type] || ["eq"])[0],
      value: undefined,
    });
  };

  return (
    <div className={classNames.conditionRow || "flex gap-2 items-center"}>
      <select
        aria-label={t("aria.field")}
        value={condition.field}
        onChange={(e) => setField(e.target.value)}
        className={classNames.fieldSelect}
      >
        {schema.map((s: FieldSchema) => (
          <option key={s.name} value={s.name}>
            {s.label || s.name}
          </option>
        ))}
      </select>

      <select
        aria-label={t("aria.operator")}
        value={condition.operator}
        onChange={(e) =>
          onChange({
            ...condition,
            operator: e.target.value as ConditionOperator,
            value: undefined,
          })
        }
        className={classNames.operatorSelect}
      >
        {ops.map((o: string) => (
          <option key={o} value={o}>
            {t(`operators.${o}`) || o}
          </option>
        ))}
      </select>

      <ValueInput
        field={field}
        operator={condition.operator}
        value={condition.value}
        onChange={(v: ConditionNode["value"]) =>
          onChange({ ...condition, value: v })
        }
        className={classNames.valueInput}
      />
    </div>
  );
}
