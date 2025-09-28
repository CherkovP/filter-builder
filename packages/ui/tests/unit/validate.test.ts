import { describe, it, expect } from "vitest";
import { validateTree } from "../../src/utils/validate";
import { FilterTree, GroupNode, ConditionNode } from "../../src/types";

describe("validateTree", () => {
  it("should return valid for empty group", () => {
    const tree: FilterTree = {
      id: "1",
      operator: "and",
      children: [],
    };

    const result = validateTree(tree);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should return valid for simple condition with proper value", () => {
    const tree: FilterTree = {
      id: "1",
      operator: "and",
      children: [
        {
          id: "2",
          field: "name",
          operator: "eq",
          value: "John",
        },
      ],
    };

    const result = validateTree(tree);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  describe("between operator validation", () => {
    it("should return valid for between with exactly two values", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "age",
            operator: "between",
            value: [18, 65],
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return invalid for between with no array value", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "age",
            operator: "between",
            value: 25,
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        id: "2",
        message: "'between' requires exactly two values",
      });
    });

    it("should return invalid for between with one value", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "age",
            operator: "between",
            value: [18],
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        id: "2",
        message: "'between' requires exactly two values",
      });
    });

    it("should return invalid for between with three values", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "age",
            operator: "between",
            value: [18, 25, 65],
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        id: "2",
        message: "'between' requires exactly two values",
      });
    });

    it("should return invalid for between with empty array", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "age",
            operator: "between",
            value: [],
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        id: "2",
        message: "'between' requires exactly two values",
      });
    });

    it("should return invalid for between with null value", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "age",
            operator: "between",
            value: null as any,
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        id: "2",
        message: "'between' requires exactly two values",
      });
    });

    it("should return invalid for between with undefined value", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "age",
            operator: "between",
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        id: "2",
        message: "'between' requires exactly two values",
      });
    });
  });

  describe("in operator validation", () => {
    it("should return valid for in with array of values", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "role",
            operator: "in",
            value: ["admin", "moderator", "user"],
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return valid for in with single-item array", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "role",
            operator: "in",
            value: ["admin"],
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return invalid for in with empty array", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "role",
            operator: "in",
            value: [],
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        id: "2",
        message: "'in' requires an array of values",
      });
    });

    it("should return invalid for in with non-array value", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "role",
            operator: "in",
            value: "admin",
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        id: "2",
        message: "'in' requires an array of values",
      });
    });

    it("should return invalid for in with null value", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "role",
            operator: "in",
            value: null as any,
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        id: "2",
        message: "'in' requires an array of values",
      });
    });

    it("should return invalid for in with undefined value", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "role",
            operator: "in",
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        id: "2",
        message: "'in' requires an array of values",
      });
    });
  });

  describe("is_null operator validation", () => {
    it("should return valid for is_null without value", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "optional_field",
            operator: "is_null",
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return invalid for is_null with any value", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "optional_field",
            operator: "is_null",
            value: "some_value",
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        id: "2",
        message: "is_null should not have a value",
      });
    });

    it("should return invalid for is_null with null value", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "optional_field",
            operator: "is_null",
            value: null as any,
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        id: "2",
        message: "is_null should not have a value",
      });
    });

    it("should return invalid for is_null with empty string value", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "optional_field",
            operator: "is_null",
            value: "",
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        id: "2",
        message: "is_null should not have a value",
      });
    });

    it("should return invalid for is_null with zero value", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "optional_field",
            operator: "is_null",
            value: 0,
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        id: "2",
        message: "is_null should not have a value",
      });
    });

    it("should return invalid for is_null with false value", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "optional_field",
            operator: "is_null",
            value: false,
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        id: "2",
        message: "is_null should not have a value",
      });
    });
  });

  describe("is_not_null operator validation", () => {
    it("should return valid for is_not_null without value", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "required_field",
            operator: "is_not_null",
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return invalid for is_not_null with any value", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "required_field",
            operator: "is_not_null",
            value: "some_value",
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        id: "2",
        message: "is_not_null should not have a value",
      });
    });
  });

  describe("nested groups validation", () => {
    it("should validate nested groups correctly", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "active",
            operator: "eq",
            value: true,
          },
          {
            id: "3",
            operator: "or",
            children: [
              {
                id: "4",
                field: "age",
                operator: "between",
                value: [18, 65],
              },
              {
                id: "5",
                field: "role",
                operator: "in",
                value: ["admin", "user"],
              },
            ],
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should collect multiple validation errors from nested groups", () => {
      const tree: FilterTree = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "name",
            operator: "is_null",
            value: "should_not_have_value",
          },
          {
            id: "3",
            operator: "or",
            children: [
              {
                id: "4",
                field: "age",
                operator: "between",
                value: [18],
              },
              {
                id: "5",
                field: "role",
                operator: "in",
                value: [],
              },
            ],
          },
        ],
      };

      const result = validateTree(tree);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(3);

      expect(result.errors).toContainEqual({
        id: "2",
        message: "is_null should not have a value",
      });
      expect(result.errors).toContainEqual({
        id: "4",
        message: "'between' requires exactly two values",
      });
      expect(result.errors).toContainEqual({
        id: "5",
        message: "'in' requires an array of values",
      });
    });
  });

  describe("operators not requiring validation", () => {
    const standardOperators = [
      "eq",
      "neq",
      "gt",
      "lt",
      "contains",
      "starts_with",
      "ends_with",
      "before",
      "after",
    ];

    standardOperators.forEach((operator) => {
      it(`should not validate ${operator} operator`, () => {
        const tree: FilterTree = {
          id: "1",
          operator: "and",
          children: [
            {
              id: "2",
              field: "field",
              operator: operator as any,
              value: "any_value",
            },
          ],
        };

        const result = validateTree(tree);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });
  });

  it("should handle deeply nested groups with mixed validation errors", () => {
    const tree: FilterTree = {
      id: "1",
      operator: "and",
      children: [
        {
          id: "2",
          operator: "or",
          children: [
            {
              id: "3",
              operator: "and",
              children: [
                {
                  id: "4",
                  field: "name",
                  operator: "between",
                  value: [1, 2, 3],
                },
                {
                  id: "5",
                  field: "age",
                  operator: "is_null",
                  value: null as any,
                },
              ],
            },
            {
              id: "6",
              field: "role",
              operator: "in",
              value: "not_an_array",
            },
          ],
        },
      ],
    };

    const result = validateTree(tree);

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(3);

    expect(result.errors).toContainEqual({
      id: "4",
      message: "'between' requires exactly two values",
    });
    expect(result.errors).toContainEqual({
      id: "5",
      message: "is_null should not have a value",
    });
    expect(result.errors).toContainEqual({
      id: "6",
      message: "'in' requires an array of values",
    });
  });
});
