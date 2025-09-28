import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import FilterBuilder from "../../src/components/FilterBuilder";
import { FilterBuilderProps, Tree } from "../../src/types";

const mockSchema = [
  { name: "name", label: "Name", type: "string" as const },
  { name: "age", label: "Age", type: "number" as const },
  {
    name: "category",
    label: "Category",
    type: "select" as const,
    options: ["tech", "finance", "health"],
  },
  { name: "tags", label: "Tags", type: "array" as const },
];

const mockOperatorsByType = {
  string: ["eq", "neq", "contains"] as const,
  number: ["eq", "neq", "gt", "lt", "between"] as const,
  select: ["eq", "neq", "in"] as const,
  array: ["contains", "in"] as const,
};

describe("API Request Generation Tests", () => {
  describe("GET Mode", () => {
    it("should generate query string for GET requests with URI encoding", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      const props: FilterBuilderProps = {
        schema: mockSchema,
        operatorsByType: mockOperatorsByType,
        onChange: mockOnChange,
        api: { mode: "GET", encode: "uri" },
      };

      render(<FilterBuilder {...props} />);

      const addConditionButton = screen.getByText("Add Condition");
      await user.click(addConditionButton);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          and: expect.arrayContaining([
            expect.objectContaining({
              field: "name",
              operator: "eq",
            }),
          ]),
        }),
        expect.any(String)
      );
    });

    it("should generate query string for GET requests with base64 encoding", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      const props: FilterBuilderProps = {
        schema: mockSchema,
        operatorsByType: mockOperatorsByType,
        onChange: mockOnChange,
        api: { mode: "GET", encode: "b64" },
      };

      render(<FilterBuilder {...props} />);

      const addConditionButton = screen.getByText("Add Condition");
      await user.click(addConditionButton);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          and: expect.arrayContaining([
            expect.objectContaining({
              field: "name",
              operator: "eq",
            }),
          ]),
        }),
        expect.any(String)
      );
    });
  });

  describe("POST Mode", () => {
    it("should not generate query string for POST requests", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      const props: FilterBuilderProps = {
        schema: mockSchema,
        operatorsByType: mockOperatorsByType,
        onChange: mockOnChange,
        api: { mode: "POST" },
      };

      render(<FilterBuilder {...props} />);

      const addConditionButton = screen.getByText("Add Condition");
      await user.click(addConditionButton);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          and: expect.arrayContaining([
            expect.objectContaining({
              field: "name",
              operator: "eq",
            }),
          ]),
        }),
        undefined
      );
    });
  });

  describe("No API Config", () => {
    it("should not generate query string when no API config is provided", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      const props: FilterBuilderProps = {
        schema: mockSchema,
        operatorsByType: mockOperatorsByType,
        onChange: mockOnChange,
      };

      render(<FilterBuilder {...props} />);

      const addConditionButton = screen.getByText("Add Condition");
      await user.click(addConditionButton);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          and: expect.arrayContaining([
            expect.objectContaining({
              field: "name",
              operator: "eq",
            }),
          ]),
        }),
        undefined
      );
    });
  });
});
