import { Tree } from "@acme/ui/filter-builder";

const applyFilters = (data: any[], tree: Tree): any[] => {
  if (!tree || Object.keys(tree).length === 0) return data;
  const evaluateCondition = (item: any, condition: any): boolean => {
    if (
      condition.field &&
      condition.operator &&
      condition.value !== undefined
    ) {
      const value = item[condition.field];
      console.log("Evaluating condition:", condition);
      console.log("Item value:", value);

      switch (condition.operator) {
        case "eq":
          return value === condition.value;
        case "neq":
          return value !== condition.value;
        case "gt":
          return Number(value) > Number(condition.value);
        case "lt":
          return Number(value) < Number(condition.value);
        case "contains":
          return String(value)
            .toLowerCase()
            .includes(String(condition.value).toLowerCase());
        case "starts_with":
          return String(value)
            .toLowerCase()
            .startsWith(String(condition.value).toLowerCase());
        case "ends_with":
          return String(value)
            .toLowerCase()
            .endsWith(String(condition.value).toLowerCase());
        case "in":
          return (
            Array.isArray(condition.value) && condition.value.includes(value)
          );
        case "between":
          return (
            Array.isArray(condition.value) &&
            Number(value) >= Number(condition.value[0]) &&
            Number(value) <= Number(condition.value[1])
          );
        case "before":
          return new Date(value) < new Date(condition.value);
        case "after":
          return new Date(value) > new Date(condition.value);
        case "is_null":
          return value === null || value === undefined || value === "";
        case "is_not_null":
          return value !== null && value !== undefined && value !== "";
        default:
          return true;
      }
    }

    return true;
  };

  const evaluateGroup = (item: any, group: any): boolean => {
    if (group.and) {
      return group.and.every((condition: any) =>
        condition.field
          ? evaluateCondition(item, condition)
          : evaluateGroup(item, condition)
      );
    }
    if (group.or) {
      return group.or.some((condition: any) =>
        condition.field
          ? evaluateCondition(item, condition)
          : evaluateGroup(item, condition)
      );
    }
    return true;
  };

  return data.filter((item) => evaluateGroup(item, tree));
};

export default applyFilters;
