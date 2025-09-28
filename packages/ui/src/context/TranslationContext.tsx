import { createContext, useContext, useState, ReactNode } from "react";
import { TranslationTypes } from "@types";
import { enTranslations } from "../translations/en";
import {
  createTranslationFunction,
  mergeTranslations,
} from "../utils/translations";

const defaultContext: TranslationTypes.TranslationContext = {
  language: "en",
  translations: enTranslations,
  t: createTranslationFunction(enTranslations),
  setLanguage: () => {},
};

const FilterBuilderTranslationContext =
  createContext<TranslationTypes.TranslationContext>(defaultContext);

export interface TranslationProviderProps {
  children: ReactNode;
  language?: TranslationTypes.Language;
  translations?: Partial<TranslationTypes.FilterBuilderTranslations>;
  availableTranslations?: Record<
    TranslationTypes.Language,
    TranslationTypes.FilterBuilderTranslations
  >;
}

export function FilterBuilderTranslationProvider({
  children,
  language: initialLanguage = "en",
  translations: customTranslations,
  availableTranslations = { en: enTranslations },
}: TranslationProviderProps) {
  const [language, setLanguage] =
    useState<TranslationTypes.Language>(initialLanguage);

  const baseTranslations = availableTranslations[language] || enTranslations;

  const finalTranslations = customTranslations
    ? mergeTranslations(baseTranslations, customTranslations)
    : baseTranslations;

  const t = createTranslationFunction(finalTranslations);

  const contextValue: TranslationTypes.TranslationContext = {
    language,
    translations: finalTranslations,
    t,
    setLanguage,
  };

  return (
    <FilterBuilderTranslationContext.Provider value={contextValue}>
      {children}
    </FilterBuilderTranslationContext.Provider>
  );
}

export function useTranslations(): TranslationTypes.TranslationContext {
  const context = useContext(FilterBuilderTranslationContext);

  if (!context) {
    return defaultContext;
  }

  return context;
}

export function useT(): TranslationTypes.TranslationFunction {
  return useTranslations().t;
}
