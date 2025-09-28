import { FilterTree } from "../types";

export function validateTree(tree: FilterTree) {
  const errors: { id: string; message: string }[] = [];
  function walk(node: any) {
    if (node.children) {
      node.children.forEach(walk);
      return;
    }
    const c = node;
    if (c.operator === "between") {
      if (!Array.isArray(c.value) || c.value.length !== 2)
        errors.push({
          id: c.id,
          message: "'between' requires exactly two values",
        });
    }
    if (c.operator === "in") {
      if (!Array.isArray(c.value) || c.value.length === 0)
        errors.push({ id: c.id, message: "'in' requires an array of values" });
    }
    if (["is_null", "is_not_null"].includes(c.operator)) {
      if (c.value !== undefined)
        errors.push({
          id: c.id,
          message: `${c.operator} should not have a value`,
        });
    }
  }
  walk(tree);
  return { valid: errors.length === 0, errors };
}
