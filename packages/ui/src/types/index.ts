import * as TranslationTypes from "./translations";

export type LogicalOperator = "and" | "or";

export type ConditionOperator =
  | "eq"
  | "neq"
  | "gt"
  | "lt"
  | "contains"
  | "starts_with"
  | "ends_with"
  | "in"
  | "between"
  | "is_null"
  | "is_not_null"
  | "before"
  | "after";

export type Encoding = "uri" | "b64";

export type Mode = "GET" | "POST";

export type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "select"
  | "array";

export type OperatorsByTypeMap = Partial<
  Record<FieldType, readonly ConditionOperator[]>
>;

export interface FieldSchema {
  name: string;
  label?: string;
  type: FieldType;
  options?: (string | number | boolean | Date)[];
}
export type OperatorsByType = Record<string, ConditionOperator[]>;

export interface ConditionNode {
  id: string;
  field: string;
  operator: ConditionOperator;
  value?: string | number | boolean | (string | number)[];
  type?: FieldType;
}

export interface GroupNode {
  id: string;
  operator: LogicalOperator;
  children: Array<ConditionNode | GroupNode>;
}

export type FilterTree = GroupNode;

export interface ApiConfig {
  mode: Mode;
  encode?: Encoding;
}

export type ConditionTreeNode = {
  field: string;
  operator: ConditionOperator;
  value?: string | number | (string | number)[] | boolean;
};

export type TreeNode =
  | {
      and: TreeNode[];
    }
  | {
      or: TreeNode[];
    }
  | ConditionTreeNode;

export type Tree = Exclude<TreeNode, ConditionTreeNode>;

export interface FilterBuilderProps<
  O extends OperatorsByTypeMap = OperatorsByTypeMap,
> {
  schema: FieldSchema[];
  operatorsByType: O;
  onChange: (tree: Tree, queryString?: string) => void;
  initial?: Tree;
  api?: ApiConfig;
  classNames?: Partial<Record<string, string>>;
  language?: string;
  translations?: TranslationTypes.FilterBuilderTranslations;
}
export { TranslationTypes };
