import { TranslationTypes } from "@types";

export function createTranslationFunction(
  translations: TranslationTypes.FilterBuilderTranslations
): TranslationTypes.TranslationFunction {
  return function t(key: string, fallback?: string): string {
    const keys = key.split(".");
    let current: any = translations;

    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k] as string | object;
      } else {
        return fallback || key;
      }
    }

    return typeof current === "string" ? current : fallback || key;
  };
}

export function mergeTranslations(
  defaultTranslations: TranslationTypes.FilterBuilderTranslations,
  userTranslations: Partial<TranslationTypes.FilterBuilderTranslations>
): TranslationTypes.FilterBuilderTranslations {
  const filterUndefined = (obj: any) => {
    const filtered: any = {};
    for (const [key, value] of Object.entries(obj || {})) {
      if (value !== undefined) {
        filtered[key] = value;
      }
    }
    return filtered;
  };

  return {
    operators: {
      ...defaultTranslations.operators,
      ...filterUndefined(userTranslations.operators),
    },
    buttons: {
      ...defaultTranslations.buttons,
      ...filterUndefined(userTranslations.buttons),
    },
    values: {
      ...defaultTranslations.values,
      ...filterUndefined(userTranslations.values),
    },
    aria: {
      ...defaultTranslations.aria,
      ...filterUndefined(userTranslations.aria),
    },
  };
}

export function getOperatorTranslation(
  translations: TranslationTypes.FilterBuilderTranslations,
  operator: string
): string {
  const operatorKey =
    operator as keyof TranslationTypes.FilterBuilderTranslations["operators"];
  return translations.operators?.[operatorKey] || operator;
}
