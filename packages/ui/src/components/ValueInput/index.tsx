import { useT } from "@context/TranslationContext";
import { ConditionOperator, FieldSchema, FieldType } from "@types";
import NoInput from "./NoInput";
import Input from "./Input";

export default function ValueInput({
  field,
  operator,
  value,
  onChange,
  className,
}: {
  field: FieldSchema;
  operator: ConditionOperator;
  value?: any;
  onChange: (value: any) => void;
  className?: string;
}) {
  const t = useT();

  const InputsByTypeAndOperator: Record<
    FieldType | "default",
    { default: Function; between?: Function; in?: Function }
  > = {
    number: {
      default: () => {
        return (
          <Input
            ariaLabel={t("aria.number")}
            type="number"
            value={value ?? ""}
            onChange={(value) => onChange(value ? Number(value) : "")}
            className={className}
          />
        );
      },
      between: () => {
        const arr = Array.isArray(value) ? value : [null, null];
        return (
          <div className={className + " flex gap-2"}>
            <Input
              ariaLabel={t("aria.from")}
              type="number"
              value={arr[0] ?? ""}
              onChange={(value) =>
                onChange([value ? Number(value) : null, arr[1]])
              }
            />
            <Input
              ariaLabel={t("aria.to")}
              type="number"
              value={arr[1] ?? ""}
              onChange={(value) =>
                onChange([arr[0], value ? Number(value) : null])
              }
            />
          </div>
        );
      },
      in: () => {
        return (
          <Input
            value={value ? value : field.options ? field.options.join(",") : ""}
            onChange={(value) => {
              onChange(value.split(",").map((v) => Number(v)));
            }}
            onBlur={(value) => {
              onChange(
                value
                  .split(",")
                  .map((v) => Number(v.trim()))
                  .filter(Boolean)
              );
            }}
            className={className}
            ariaLabel={t("aria.dates")}
            placeholder={t("values.placeholderArray")}
            type="text"
          />
        );
      },
    },
    date: {
      default: () => {
        return (
          <Input
            ariaLabel={t("aria.date")}
            type="date"
            value={value ?? ""}
            onChange={(value) => onChange(value)}
            className={className}
          />
        );
      },
      between: () => {
        const arr = Array.isArray(value) ? value : ["", ""];
        return (
          <div className={className + " flex gap-2"}>
            <Input
              ariaLabel={t("aria.dateFrom")}
              type="date"
              value={arr[0] ?? ""}
              onChange={(value) => onChange([value, arr[1]])}
            />
            <Input
              ariaLabel={t("aria.dateTo")}
              type="date"
              value={arr[1] ?? ""}
              onChange={(value) => onChange([arr[0], value])}
            />
          </div>
        );
      },
      in: () => (
        <Input
          value={value ? value : field.options ? field.options.join(",") : ""}
          onChange={(value) => {
            onChange(value.split(","));
          }}
          onBlur={(value) => {
            onChange(
              value
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean)
            );
          }}
          className={className}
          ariaLabel={t("aria.dates")}
          placeholder={t("values.placeholderArray")}
          type="text"
        />
      ),
    },
    boolean: {
      default: () => {
        return (
          <select
            aria-label={t("aria.bool")}
            value={value === undefined ? "" : String(value)}
            onChange={(e) => onChange(e.target.value === "true")}
            className={className}
          >
            <option value="">{t("values.empty")}</option>
            <option value="true">{t("values.true")}</option>
            <option value="false">{t("values.false")}</option>
          </select>
        );
      },
      in: () => null,
    },
    select: {
      default: () => {
        return (
          <select
            aria-label={t("aria.select")}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={className}
          >
            <option value="">{t("values.empty")}</option>
            {(field.options || []).map((o: any) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        );
      },
      in: () => null,
    },
    array: {
      default: () => {
        return (
          <Input
            type="text"
            ariaLabel={t("aria.array")}
            value={Array.isArray(value) ? value.join(",") : value ?? ""}
            onChange={(value) =>
              onChange(
                value
                  .split(",")
                  .map((s: string) => s.trim())
                  .filter(Boolean)
              )
            }
            className={className}
            placeholder={t("values.placeholderArray")}
          />
        );
      },
    },
    string: {
      between: () => {
        const arr = Array.isArray(value) ? value : ["", ""];
        return (
          <div className={className + " flex gap-2"}>
            <Input
              ariaLabel={t("aria.from")}
              type="text"
              value={arr[0] ?? ""}
              onChange={(value) => onChange([value, arr[1]])}
            />
            <Input
              ariaLabel={t("aria.to")}
              type="text"
              value={arr[1] ?? ""}
              onChange={(value) => onChange([arr[0], value])}
            />
          </div>
        );
      },
      in: () => {
        return (
          <Input
            value={value ? value : field.options ? field.options.join(",") : ""}
            onChange={(value) => {
              onChange(value.split(","));
            }}
            onBlur={(value) => {
              onChange(
                value
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean)
              );
            }}
            className={className}
            ariaLabel={t("aria.dates")}
            placeholder={t("values.placeholderArray")}
            type="text"
          />
        );
      },
      default: () => {
        return (
          <Input
            ariaLabel={t("aria.text")}
            type="text"
            value={value ?? ""}
            onChange={(value) => onChange(value)}
            className={className}
          />
        );
      },
    },
    default: {
      between: () => {
        const arr = Array.isArray(value) ? value : ["", ""];
        return (
          <div className={className + " flex gap-2"}>
            <input
              aria-label={t("aria.from")}
              value={arr[0] ?? ""}
              onChange={(e) => onChange([e.target.value, arr[1]])}
            />
            <input
              aria-label={t("aria.to")}
              value={arr[1] ?? ""}
              onChange={(e) => onChange([arr[0], e.target.value])}
            />
          </div>
        );
      },
      default: () => {
        return (
          <Input
            type="text"
            ariaLabel={t("aria.text")}
            value={value ?? ""}
            onChange={(value) => onChange(value)}
            className={className}
          />
        );
      },
    },
  };

  if (operator === "is_null" || operator === "is_not_null")
    return <NoInput className={className}>{t("values.empty")}</NoInput>;

  if (field.type && InputsByTypeAndOperator[field.type]) {
    if (operator !== "between" && operator !== "in") {
      return InputsByTypeAndOperator[field.type].default({ t, value });
    }
    if (operator === "between") {
      return InputsByTypeAndOperator[field.type].between
        ? InputsByTypeAndOperator[field.type].between!({ t, value })
        : null;
    }
    if (operator === "in") {
      return InputsByTypeAndOperator[field.type].in
        ? InputsByTypeAndOperator[field.type].in!({ t, value })
        : null;
    }
  }
  return InputsByTypeAndOperator["default"].default({ t, value });
}
