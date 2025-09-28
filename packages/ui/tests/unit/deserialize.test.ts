import { describe, it, expect } from "vitest";
import { deserialize } from "@utils/deserialize";
import { GroupNode, ConditionNode, TreeNode } from "@types";

describe("deserialize", () => {
  it("should deserialize a simple condition object", () => {
    const obj = {
      field: "name",
      operator: "eq",
      value: "John",
    } as TreeNode;

    const result = deserialize(obj);

    expect(result.operator).toBe("and");
    expect(result.children).toHaveLength(1);
    expect(result.children[0]).toMatchObject({
      field: "name",
      operator: "eq",
      value: "John",
    });
    expect(result.id).toBeDefined();
    expect((result.children[0] as ConditionNode).id).toBeDefined();
  });

  it("should deserialize a condition without value", () => {
    const obj = {
      field: "name",
      operator: "is_null",
    } as TreeNode;

    const result = deserialize(obj);

    expect(result.operator).toBe("and");
    expect(result.children).toHaveLength(1);
    expect(result.children[0]).toMatchObject({
      field: "name",
      operator: "is_null",
      value: undefined,
    });
    expect(result.id).toBeDefined();
    expect((result.children[0] as ConditionNode).id).toBeDefined();
  });

  it("should preserve condition with explicit undefined value", () => {
    const obj = {
      field: "name",
      operator: "is_not_null",
      value: undefined,
    } as TreeNode;

    const result = deserialize(obj);

    const condition = result.children[0] as ConditionNode;
    expect(condition.value).toBeUndefined();
    expect(condition).toHaveProperty("value");
  });

  it("should preserve condition with zero value", () => {
    const obj = {
      field: "count",
      operator: "eq",
      value: 0,
    } as TreeNode;

    const result = deserialize(obj);

    const condition = result.children[0] as ConditionNode;
    expect(condition.value).toBe(0);
  });

  it("should preserve condition with empty string value", () => {
    const obj = {
      field: "description",
      operator: "eq",
      value: "",
    } as TreeNode;

    const result = deserialize(obj);

    const condition = result.children[0] as ConditionNode;
    expect(condition.value).toBe("");
  });

  it("should preserve condition with false value", () => {
    const obj = {
      field: "active",
      operator: "eq",
      value: false,
    } as TreeNode;

    const result = deserialize(obj);

    const condition = result.children[0] as ConditionNode;
    expect(condition.value).toBe(false);
  });

  it("should deserialize an AND group", () => {
    const obj = {
      and: [
        {
          field: "name",
          operator: "eq",
          value: "John",
        },
        {
          field: "age",
          operator: "gt",
          value: 18,
        },
      ],
    } as TreeNode;

    const result = deserialize(obj);

    expect(result.operator).toBe("and");
    expect(result.children).toHaveLength(2);
    expect(result.children[0]).toMatchObject({
      field: "name",
      operator: "eq",
      value: "John",
    });
    expect(result.children[1]).toMatchObject({
      field: "age",
      operator: "gt",
      value: 18,
    });
    expect(result.id).toBeDefined();
    expect((result.children[0] as ConditionNode).id).toBeDefined();
    expect((result.children[1] as ConditionNode).id).toBeDefined();
  });

  it("should deserialize an OR group", () => {
    const obj = {
      or: [
        {
          field: "name",
          operator: "eq",
          value: "John",
        },
        {
          field: "name",
          operator: "eq",
          value: "Jane",
        },
      ],
    } as TreeNode;

    const result = deserialize(obj);

    expect(result.operator).toBe("or");
    expect(result.children).toHaveLength(2);
    expect(result.children[0]).toMatchObject({
      field: "name",
      operator: "eq",
      value: "John",
    });
    expect(result.children[1]).toMatchObject({
      field: "name",
      operator: "eq",
      value: "Jane",
    });
  });

  it("should deserialize nested groups", () => {
    const obj = {
      and: [
        {
          field: "active",
          operator: "eq",
          value: true,
        },
        {
          or: [
            {
              field: "role",
              operator: "eq",
              value: "admin",
            },
            {
              field: "role",
              operator: "eq",
              value: "moderator",
            },
          ],
        },
      ],
    } as TreeNode;

    const result = deserialize(obj);

    expect(result.operator).toBe("and");
    expect(result.children).toHaveLength(2);

    // First child should be a condition
    expect(result.children[0]).toMatchObject({
      field: "active",
      operator: "eq",
      value: true,
    });

    // Second child should be a group
    const nestedGroup = result.children[1] as GroupNode;
    expect(nestedGroup.operator).toBe("or");
    expect(nestedGroup.children).toHaveLength(2);
    expect(nestedGroup.children[0]).toMatchObject({
      field: "role",
      operator: "eq",
      value: "admin",
    });
    expect(nestedGroup.children[1]).toMatchObject({
      field: "role",
      operator: "eq",
      value: "moderator",
    });
  });

  it("should deserialize deeply nested groups", () => {
    const obj = {
      and: [
        {
          or: [
            {
              and: [
                {
                  field: "name",
                  operator: "contains",
                  value: "test",
                },
                {
                  field: "age",
                  operator: "gt",
                  value: 21,
                },
              ],
            },
            {
              field: "role",
              operator: "eq",
              value: "admin",
            },
          ],
        },
      ],
    } as TreeNode;

    const result = deserialize(obj);

    expect(result.operator).toBe("and");
    expect(result.children).toHaveLength(1);

    const level1Group = result.children[0] as GroupNode;
    expect(level1Group.operator).toBe("or");
    expect(level1Group.children).toHaveLength(2);

    const level2Group = level1Group.children[0] as GroupNode;
    expect(level2Group.operator).toBe("and");
    expect(level2Group.children).toHaveLength(2);
    expect(level2Group.children[0]).toMatchObject({
      field: "name",
      operator: "contains",
      value: "test",
    });
    expect(level2Group.children[1]).toMatchObject({
      field: "age",
      operator: "gt",
      value: 21,
    });

    expect(level1Group.children[1]).toMatchObject({
      field: "role",
      operator: "eq",
      value: "admin",
    });
  });

  it("should deserialize empty AND group", () => {
    const obj = {
      and: [],
    };

    const result = deserialize(obj);

    expect(result.operator).toBe("and");
    expect(result.children).toHaveLength(0);
    expect(result.id).toBeDefined();
  });

  it("should deserialize empty OR group", () => {
    const obj = {
      or: [],
    };

    const result = deserialize(obj);

    expect(result.operator).toBe("or");
    expect(result.children).toHaveLength(0);
    expect(result.id).toBeDefined();
  });

  it("should handle array values in conditions", () => {
    const obj = {
      and: [
        {
          field: "age",
          operator: "between",
          value: [18, 65],
        },
        {
          field: "role",
          operator: "in",
          value: ["admin", "moderator", "user"],
        },
      ],
    } as TreeNode;

    const result = deserialize(obj);

    expect(result.children[0]).toMatchObject({
      field: "age",
      operator: "between",
      value: [18, 65],
    });
    expect(result.children[1]).toMatchObject({
      field: "role",
      operator: "in",
      value: ["admin", "moderator", "user"],
    });
  });

  it("should generate unique IDs for each node", () => {
    const obj = {
      and: [
        {
          field: "name",
          operator: "eq",
          value: "John",
        },
        {
          or: [
            {
              field: "age",
              operator: "gt",
              value: 18,
            },
            {
              field: "role",
              operator: "eq",
              value: "admin",
            },
          ],
        },
      ],
    } as TreeNode;

    const result = deserialize(obj);

    const ids = new Set();
    const collectIds = (node: GroupNode | ConditionNode) => {
      ids.add(node.id);
      if ("children" in node) {
        node.children.forEach(collectIds);
      }
    };

    collectIds(result);

    // Should have 5 unique IDs: root group, condition, nested group, 2 conditions in nested group
    expect(ids.size).toBe(5);
  });

  it("should handle mixed logical operators in same object (should prioritize AND)", () => {
    const obj = {
      and: [
        {
          field: "name",
          operator: "eq",
          value: "John",
        },
      ],
      or: [
        {
          field: "age",
          operator: "gt",
          value: 18,
        },
      ],
    } as TreeNode;

    const result = deserialize(obj);

    // Should prioritize 'and' operator
    expect(result.operator).toBe("and");
    expect(result.children).toHaveLength(1);
    expect(result.children[0]).toMatchObject({
      field: "name",
      operator: "eq",
      value: "John",
    });
  });
});
