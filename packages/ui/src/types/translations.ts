export interface OperatorTranslations {
  and: string;
  or: string;
  eq: string;
  neq: string;
  gt: string;
  lt: string;
  contains: string;
  starts_with: string;
  ends_with: string;
  in: string;
  between: string;
  is_null: string;
  is_not_null: string;
  before: string;
  after: string;
}

export interface ButtonTranslations {
  send: string;
  addCondition: string;
  addGroup: string;
  remove: string;
  removeGroup: string;
}

export interface ValueTranslations {
  true: string;
  false: string;
  empty: string; // for "—"
  placeholderArray: string; // for "a, b, c"
}

export interface AriaTranslations {
  field: string;
  operator: string;
  value: string;
  from: string;
  to: string;
  number: string;
  text: string;
  date: string;
  dateFrom: string;
  dateTo: string;
  bool: string;
  select: string;
  array: string;
}

export interface FilterBuilderTranslations {
  operators?: OperatorTranslations;
  buttons?: ButtonTranslations;
  values?: ValueTranslations;
  aria?: AriaTranslations;
}

export type Language = "en" | "de" | string;

export type TranslationFunction = (key: string, fallback?: string) => string;

export interface TranslationContext {
  language: Language;
  translations: FilterBuilderTranslations;
  t: TranslationFunction;
  setLanguage: (language: Language) => void;
}
