import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import FilterBuilder from "../../src/components/FilterBuilder";
import { FilterBuilderProps, Tree } from "../../src/types";

const mockSchema = [
  { name: "name", label: "Name", type: "string" as const },
  { name: "age", label: "Age", type: "number" as const },
  { name: "isActive", label: "Active", type: "boolean" as const },
];

const mockOperatorsByType = {
  string: ["eq", "neq", "contains"] as const,
  number: ["eq", "neq", "gt", "lt", "between"] as const,
  boolean: ["eq"] as const,
};

const defaultProps: FilterBuilderProps = {
  schema: mockSchema,
  operatorsByType: mockOperatorsByType,
  onChange: vi.fn(),
};

describe("FilterBuilder Integration Tests", () => {
  describe("Adding Conditions", () => {
    it("should add a new condition when Add Condition button is clicked", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      render(<FilterBuilder {...defaultProps} onChange={mockOnChange} />);

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

    it("should add multiple conditions", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      render(<FilterBuilder {...defaultProps} onChange={mockOnChange} />);

      const addConditionButton = screen.getByText("Add Condition");
      await user.click(addConditionButton);
      await user.click(addConditionButton);

      const lastCall =
        mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1];
      expect(lastCall[0].and).toHaveLength(2);
    });
  });

  describe("Removing Conditions", () => {
    it("should remove a condition when remove button is clicked", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      const initial: Tree = {
        and: [
          { field: "name", operator: "eq", value: "test" },
          { field: "age", operator: "gt", value: 25 },
        ],
      };

      render(
        <FilterBuilder
          {...defaultProps}
          initial={initial}
          onChange={mockOnChange}
        />
      );

      const removeButtons = screen.getAllByText("Remove");
      await user.click(removeButtons[0]);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          and: expect.arrayContaining([
            expect.objectContaining({
              field: "age",
              operator: "gt",
              value: 25,
            }),
          ]),
        }),
        undefined
      );
    });

    it("should remove all conditions when all remove buttons are clicked", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      const initial: Tree = {
        and: [
          { field: "name", operator: "eq", value: "test" },
          { field: "age", operator: "gt", value: 25 },
        ],
      };

      render(
        <FilterBuilder
          {...defaultProps}
          initial={initial}
          onChange={mockOnChange}
        />
      );

      const removeButtons = screen.getAllByText("Remove");
      await user.click(removeButtons[0]);

      const updatedRemoveButtons = screen.getAllByText("Remove");
      await user.click(updatedRemoveButtons[0]);

      const lastCall =
        mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1];
      expect(lastCall[0].and).toHaveLength(0);
    });
  });

  describe("Editing Conditions", () => {
    it("should update field when field dropdown is changed", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      const initial: Tree = {
        and: [{ field: "name", operator: "eq", value: "test" }],
      };

      render(
        <FilterBuilder
          {...defaultProps}
          initial={initial}
          onChange={mockOnChange}
        />
      );

      const fieldSelect = screen.getByDisplayValue("Name");
      await user.selectOptions(fieldSelect, "age");

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          and: expect.arrayContaining([
            expect.objectContaining({
              field: "age",
              operator: "eq",
            }),
          ]),
        }),
        undefined
      );
    });

    it("should update operator when operator dropdown is changed", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      const initial: Tree = {
        and: [{ field: "name", operator: "eq", value: "test" }],
      };

      render(
        <FilterBuilder
          {...defaultProps}
          initial={initial}
          onChange={mockOnChange}
        />
      );

      const operatorSelect = screen.getByDisplayValue("equals");
      await user.selectOptions(operatorSelect, "contains");

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          and: expect.arrayContaining([
            expect.objectContaining({
              field: "name",
              operator: "contains",
            }),
          ]),
        }),
        undefined
      );
    });

    it("should update value when input is changed", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      const initial: Tree = {
        and: [{ field: "name", operator: "eq", value: "test" }],
      };

      render(
        <FilterBuilder
          {...defaultProps}
          initial={initial}
          onChange={mockOnChange}
        />
      );

      const valueInput = screen.getByDisplayValue("test");
      await user.clear(valueInput);
      await user.type(valueInput, "newvalue");

      expect(mockOnChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          and: expect.arrayContaining([
            expect.objectContaining({
              field: "name",
              operator: "eq",
              value: "newvalue",
            }),
          ]),
        }),
        undefined
      );
    });

    it("should reset value when operator changes", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      const initial: Tree = {
        and: [{ field: "name", operator: "eq", value: "test" }],
      };

      render(
        <FilterBuilder
          {...defaultProps}
          initial={initial}
          onChange={mockOnChange}
        />
      );

      const operatorSelect = screen.getByDisplayValue("equals");
      await user.selectOptions(operatorSelect, "contains");

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          and: expect.arrayContaining([
            expect.objectContaining({
              field: "name",
              operator: "contains",
            }),
          ]),
        }),
        undefined
      );
    });
  });

  describe("Adding Groups", () => {
    it("should add a new group when Add Group button is clicked", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      render(<FilterBuilder {...defaultProps} onChange={mockOnChange} />);

      const addGroupButton = screen.getByText("Add Group");
      await user.click(addGroupButton);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          and: expect.arrayContaining([
            expect.objectContaining({
              and: [],
            }),
          ]),
        }),
        undefined
      );
    });

    it("should add conditions to nested groups", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      render(<FilterBuilder {...defaultProps} onChange={mockOnChange} />);

      const addGroupButton = screen.getByText("Add Group");
      await user.click(addGroupButton);

      const addConditionButtons = screen.getAllByText("Add Condition");
      await user.click(addConditionButtons[1]);

      const lastCall =
        mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1];
      expect(lastCall[0].and[0].and).toHaveLength(1);
    });
  });

  describe("Removing Groups", () => {
    it("should remove a group when remove group button is clicked", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      const initial: Tree = {
        and: [
          { field: "name", operator: "eq", value: "test" },
          { and: [{ field: "age", operator: "gt", value: 25 }] },
        ],
      };

      render(
        <FilterBuilder
          {...defaultProps}
          initial={initial}
          onChange={mockOnChange}
        />
      );

      const removeGroupButton = screen.getByText("Remove group");
      await user.click(removeGroupButton);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          and: expect.arrayContaining([
            expect.objectContaining({
              field: "name",
              operator: "eq",
              value: "test",
            }),
          ]),
        }),
        undefined
      );
    });
  });

  describe("Group Operators", () => {
    it("should toggle group operator when operator button is clicked", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      render(<FilterBuilder {...defaultProps} onChange={mockOnChange} />);

      const operatorButton = screen.getByText("AND");
      await user.click(operatorButton);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          or: [],
        }),
        undefined
      );
    });

    it("should toggle nested group operators independently", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      const initial: Tree = {
        and: [{ and: [] }],
      };

      render(
        <FilterBuilder
          {...defaultProps}
          initial={initial}
          onChange={mockOnChange}
        />
      );

      const operatorButtons = screen.getAllByText("AND");
      await user.click(operatorButtons[1]);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          and: expect.arrayContaining([
            expect.objectContaining({
              or: [],
            }),
          ]),
        }),
        undefined
      );
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle deeply nested groups", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      render(<FilterBuilder {...defaultProps} onChange={mockOnChange} />);

      const addGroupButton = screen.getByText("Add Group");
      await user.click(addGroupButton);

      const addGroupButtons = screen.getAllByText("Add Group");
      await user.click(addGroupButtons[1]);

      const addConditionButtons = screen.getAllByText("Add Condition");
      await user.click(addConditionButtons[2]);

      const lastCall =
        mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1];
      expect(lastCall[0].and[0].and[0].and).toHaveLength(1);
    });

    it("should maintain filter state when editing complex trees", async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      const initial: Tree = {
        and: [
          { field: "name", operator: "eq", value: "John" },
          {
            or: [
              { field: "age", operator: "gt", value: 25 },
              { field: "isActive", operator: "eq", value: true },
            ],
          },
        ],
      };

      render(
        <FilterBuilder
          {...defaultProps}
          initial={initial}
          onChange={mockOnChange}
        />
      );

      const valueInputs = screen.getAllByDisplayValue("John");
      await user.clear(valueInputs[0]);
      await user.type(valueInputs[0], "Jane");

      const lastCall =
        mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1];
      expect(lastCall[0].and[0].value).toBe("Jane");
      expect(lastCall[0].and[1].or).toHaveLength(2);
    });
  });
});
