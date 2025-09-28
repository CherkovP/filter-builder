import { useState } from "react";
import { FilterBuilderProps, GroupNode } from "@types";
import { uid } from "@utils/id";
import GroupEditor from "@components/GroupEditor";
import { serialize } from "@utils/serialize";
import { deserialize } from "@utils/deserialize";
import { encodeFilter } from "@utils/encode";
import { FilterBuilderTranslationProvider } from "@context/TranslationContext";
import { enTranslations } from "@translations/en";
import { deTranslations } from "@translations/de";

const availableTranslations = {
  en: enTranslations,
  de: deTranslations,
};

function FilterBuilderInner({
  schema,
  operatorsByType,
  initial,
  api,
  onChange,
  classNames,
}: Omit<FilterBuilderProps, "language" | "translations">) {
  const [tree, setTree] = useState<GroupNode>(() =>
    initial
      ? deserialize(initial)
      : { id: uid(), operator: "and", children: [] }
  );

  const handleChange = (tree: GroupNode) => {
    const json = serialize(tree);
    const queryString =
      api?.mode === "GET"
        ? encodeFilter(json, api?.encode || "uri")
        : undefined;

    setTree(tree);
    onChange(json, queryString);
  };

  return (
    <div className={classNames?.root || "filter-builder"}>
      <GroupEditor
        node={tree}
        schema={schema}
        operatorsByType={operatorsByType}
        onChange={handleChange}
        classNames={classNames}
      />
    </div>
  );
}

export default function FilterBuilder({
  schema,
  operatorsByType,
  initial,
  api,
  onChange,
  classNames,
  language = "en",
  translations,
}: FilterBuilderProps) {
  return (
    <FilterBuilderTranslationProvider
      language={language}
      translations={translations}
      availableTranslations={availableTranslations}
    >
      <FilterBuilderInner
        schema={schema}
        operatorsByType={operatorsByType}
        initial={initial}
        api={api}
        onChange={onChange}
        classNames={classNames}
      />
    </FilterBuilderTranslationProvider>
  );
}
