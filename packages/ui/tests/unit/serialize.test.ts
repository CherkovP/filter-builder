import { describe, it, expect } from "vitest";
import { serialize, serializeNode } from "../../src/utils/serialize";
import { GroupNode, ConditionNode } from "../../src/types";

describe("serialize", () => {
  describe("serializeNode", () => {
    it("should serialize a simple condition node", () => {
      const conditionNode: ConditionNode = {
        id: "1",
        field: "name",
        operator: "eq",
        value: "John",
      };

      const result = serializeNode(conditionNode);

      expect(result).toEqual({
        field: "name",
        operator: "eq",
        value: "John",
      });
    });

    it("should serialize a condition node without value", () => {
      const conditionNode: ConditionNode = {
        id: "1",
        field: "name",
        operator: "is_null",
      };

      const result = serializeNode(conditionNode);

      expect(result).toEqual({
        field: "name",
        operator: "is_null",
      });
    });

    it("should serialize a condition node with undefined value", () => {
      const conditionNode: ConditionNode = {
        id: "1",
        field: "name",
        operator: "is_not_null",
        value: undefined,
      };

      const result = serializeNode(conditionNode);

      expect(result).toEqual({
        field: "name",
        operator: "is_not_null",
      });
    });

    it("should serialize a condition node with array value", () => {
      const conditionNode: ConditionNode = {
        id: "1",
        field: "age",
        operator: "between",
        value: [18, 65],
      };

      const result = serializeNode(conditionNode);

      expect(result).toEqual({
        field: "age",
        operator: "between",
        value: [18, 65],
      });
    });

    it("should serialize a simple group node with AND operator", () => {
      const groupNode: GroupNode = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "name",
            operator: "eq",
            value: "John",
          },
          {
            id: "3",
            field: "age",
            operator: "gt",
            value: 18,
          },
        ],
      };

      const result = serializeNode(groupNode);

      expect(result).toEqual({
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
      });
    });

    it("should serialize a simple group node with OR operator", () => {
      const groupNode: GroupNode = {
        id: "1",
        operator: "or",
        children: [
          {
            id: "2",
            field: "name",
            operator: "eq",
            value: "John",
          },
          {
            id: "3",
            field: "name",
            operator: "eq",
            value: "Jane",
          },
        ],
      };

      const result = serializeNode(groupNode);

      expect(result).toEqual({
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
      });
    });

    it("should serialize nested group nodes", () => {
      const nestedGroupNode: GroupNode = {
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
                field: "role",
                operator: "eq",
                value: "admin",
              },
              {
                id: "5",
                field: "role",
                operator: "eq",
                value: "moderator",
              },
            ],
          },
        ],
      };

      const result = serializeNode(nestedGroupNode);

      expect(result).toEqual({
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
      });
    });

    it("should serialize deeply nested group nodes", () => {
      const deeplyNestedGroup: GroupNode = {
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
                    operator: "contains",
                    value: "test",
                  },
                  {
                    id: "5",
                    field: "age",
                    operator: "gt",
                    value: 21,
                  },
                ],
              },
              {
                id: "6",
                field: "role",
                operator: "eq",
                value: "admin",
              },
            ],
          },
        ],
      };

      const result = serializeNode(deeplyNestedGroup);

      expect(result).toEqual({
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
      });
    });

    it("should serialize empty group node", () => {
      const emptyGroup: GroupNode = {
        id: "1",
        operator: "and",
        children: [],
      };

      const result = serializeNode(emptyGroup);

      expect(result).toEqual({
        and: [],
      });
    });

    it("should handle condition with zero value", () => {
      const conditionNode: ConditionNode = {
        id: "1",
        field: "count",
        operator: "eq",
        value: 0,
      };

      const result = serializeNode(conditionNode);

      expect(result).toEqual({
        field: "count",
        operator: "eq",
        value: 0,
      });
    });

    it("should handle condition with empty string value", () => {
      const conditionNode: ConditionNode = {
        id: "1",
        field: "description",
        operator: "eq",
        value: "",
      };

      const result = serializeNode(conditionNode);

      expect(result).toEqual({
        field: "description",
        operator: "eq",
        value: "",
      });
    });

    it("should handle condition with false value", () => {
      const conditionNode: ConditionNode = {
        id: "1",
        field: "active",
        operator: "eq",
        value: false,
      };

      const result = serializeNode(conditionNode);

      expect(result).toEqual({
        field: "active",
        operator: "eq",
        value: false,
      });
    });
  });

  describe("serialize", () => {
    it("should serialize a complete filter tree", () => {
      const tree: GroupNode = {
        id: "1",
        operator: "and",
        children: [
          {
            id: "2",
            field: "name",
            operator: "contains",
            value: "John",
          },
          {
            id: "3",
            operator: "or",
            children: [
              {
                id: "4",
                field: "age",
                operator: "gt",
                value: 18,
              },
              {
                id: "5",
                field: "role",
                operator: "eq",
                value: "admin",
              },
            ],
          },
        ],
      };

      const result = serialize(tree);

      expect(result).toEqual({
        and: [
          {
            field: "name",
            operator: "contains",
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
      });
    });
  });
});
