import { TranslationTypes } from "@types";

export const enTranslations: TranslationTypes.FilterBuilderTranslations = {
  operators: {
    // Logical operators
    and: "AND",
    or: "OR",

    // Condition operators
    eq: "equals",
    neq: "not equals",
    gt: "greater than",
    lt: "less than",
    contains: "contains",
    starts_with: "starts with",
    ends_with: "ends with",
    in: "in",
    between: "between",
    is_null: "is null",
    is_not_null: "is not null",
    before: "before",
    after: "after",
  },
  buttons: {
    send: "Send",
    addCondition: "Add Condition",
    addGroup: "Add Group",
    remove: "Remove",
    removeGroup: "Remove group",
  },
  values: {
    true: "True",
    false: "False",
    empty: "—",
    placeholderArray: "a, b, c",
  },
  aria: {
    field: "field",
    operator: "operator",
    value: "value",
    from: "from",
    to: "to",
    number: "number",
    text: "text",
    date: "date",
    dateFrom: "date-from",
    dateTo: "date-to",
    bool: "bool",
    select: "select",
    array: "array",
  },
};
