import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import FilterResultsUser, { mockUsers } from "./UsersExample";
import FilterResultsProduct, { mockProducts } from "./ProductsExample";
import {
  FilterBuilder,
  FilterBuilderProps,
  OperatorsByType,
  Tree,
  validateTree,
  deserialize,
} from "@acme/ui/filter-builder";
import applyFilters from "../src/utils/applyFilters";
const operatorsByType: OperatorsByType = {
  string: [
    "eq",
    "neq",
    "contains",
    "starts_with",
    "ends_with",
    "in",
    "is_null",
    "is_not_null",
  ],
  number: ["eq", "neq", "gt", "lt", "between", "in"],
  boolean: ["eq", "neq", "is_null", "is_not_null"],
  date: ["eq", "before", "after", "between", "in"],
};

const meta: Meta<typeof FilterBuilder> = {
  title: "FilterBuilder",
  component: FilterBuilder,
};
export default meta;
type Story = StoryObj<FilterBuilderProps>;

export const UsersExample: Story = {
  render: (args) => {
    const [currentTree, setCurrentTree] = useState<Tree>({ and: [] });
    const [filteredData, setFilteredData] = useState<any[]>(mockUsers);
    const [isLoading, setIsLoading] = useState(false);

    const handleFilterChange = (tree: Tree, query?: string) => {
      setCurrentTree(tree);
      console.log("Filter tree:", tree);
      console.log("Generated query:", query);
    };

    const handleSendRequest = async () => {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 800));

      const filtered = applyFilters(mockUsers, currentTree);
      setFilteredData(filtered);
      setIsLoading(false);

      console.log(`Found ${filtered.length} matching records`);
    };

    return (
      <div>
        <FilterBuilder {...args} onChange={handleFilterChange} />

        <div style={{ marginTop: "16px" }}>
          <button
            onClick={handleSendRequest}
            disabled={isLoading}
            style={{
              padding: "10px 20px",
              backgroundColor: isLoading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {isLoading ? "🔄 Filtering..." : "🔍 Apply Filters"}
          </button>
        </div>

        <FilterResultsUser data={filteredData} />
      </div>
    );
  },
  args: {
    initial: {
      and: [
        {
          or: [
            { field: "age", operator: "between", value: [25, 35] },
            { field: "age", operator: "gt", value: 45 },
          ],
        },
        { field: "isActive", operator: "eq", value: true },
        {
          and: [
            { field: "role", operator: "in", value: ["developer", "designer"] },
            { field: "createdAt", operator: "after", value: "2022-01-01" },
          ],
        },
      ],
    },
    schema: [
      { name: "age", label: "Age", type: "number" },
      {
        name: "role",
        label: "Role",
        type: "string",
        options: ["developer", "designer"],
      },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "createdAt", label: "Created", type: "date" },
    ],
    operatorsByType,
    language: "en",
  },
};

export const ProductsExample: Story = {
  render: (args) => {
    const [currentTree, setCurrentTree] = useState<Tree>({ and: [] });
    const [filteredData, setFilteredData] = useState<any[]>(mockProducts);
    const [isLoading, setIsLoading] = useState(false);

    const handleFilterChange = (tree: Tree, query?: string) => {
      setCurrentTree(tree);
      console.log("Filter tree:", tree);
      console.log("Generated query:", query);
    };

    const handleSendRequest = async () => {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 800));

      const filtered = applyFilters(mockProducts, currentTree);
      setFilteredData(filtered);
      setIsLoading(false);

      console.log(`Found ${filtered.length} matching records`);
    };

    return (
      <div>
        <FilterBuilder {...args} onChange={handleFilterChange} />

        <div style={{ marginTop: "16px" }}>
          <button
            onClick={handleSendRequest}
            disabled={isLoading}
            style={{
              padding: "10px 20px",
              backgroundColor: isLoading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {isLoading ? "🔄 Filtering..." : "🔍 Apply Filters"}
          </button>
        </div>

        <FilterResultsProduct data={filteredData} />
      </div>
    );
  },
  args: {
    initial: {
      and: [
        {
          or: [
            { field: "price", operator: "between", value: [100, 1000] },
            { field: "price", operator: "gt", value: 1500 },
          ],
        },
        { field: "inStock", operator: "eq", value: true },
        {
          and: [
            {
              or: [
                {
                  and: [
                    {
                      field: "category",
                      operator: "in",
                      value: ["electronics", "footwear"],
                    },
                    { field: "brand", operator: "eq", value: "Apple" },
                  ],
                },
                {
                  and: [
                    { field: "category", operator: "eq", value: "clothing" },
                    { field: "price", operator: "lt", value: 150 },
                  ],
                },
              ],
            },
            { field: "releaseDate", operator: "after", value: "2022-01-01" },
          ],
        },
      ],
    },
    schema: [
      { name: "id", label: "Product ID", type: "number" },
      { name: "name", label: "Product Name", type: "string" },
      { name: "price", label: "Price", type: "number" },
      {
        name: "category",
        label: "Category",
        type: "string",
        options: ["electronics", "footwear", "clothing"],
      },
      { name: "inStock", label: "In Stock", type: "boolean" },
      { name: "releaseDate", label: "Release Date", type: "date" },
      {
        name: "brand",
        label: "Brand",
        type: "string",
        options: ["Apple", "Nike", "Levi's", "Samsung", "Adidas"],
      },
    ],
    operatorsByType,
    language: "en",
  },
};
export const UsersDeutsch: Story = {
  args: {
    schema: [
      { name: "age", label: "Alter", type: "number" },
      { name: "role", label: "Rolle", type: "string" },
      { name: "isActive", label: "Aktiv", type: "boolean" },
      { name: "createdAt", label: "Erstellt", type: "date" },
    ],
    operatorsByType,
    onChange: (tree: Tree, query?: string) => {
      console.log(tree, query);
    },
    api: { mode: "GET", encode: "b64" },
    language: "de",
  },
};

export const UsersCustomTranslations: Story = {
  args: {
    initial: {
      and: [
        { field: "age", operator: "gt", value: 30 },
        { field: "isActive", operator: "eq", value: true },
      ],
    },
    schema: [
      { name: "age", label: "Age", type: "number" },
      { name: "role", label: "Role", type: "string" },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "createdAt", label: "Created", type: "date" },
    ],
    api: { mode: "GET" },
    operatorsByType,
    language: "en",
    translations: {
      buttons: {
        send: "Submit Query",
        addCondition: "➕ Add Rule",
        addGroup: "📁 Add Group",
        remove: "❌ Delete",
        removeGroup: "🗂️ Delete Group",
      },
      operators: {
        and: "ALL OF",
        or: "ANY OF",
        eq: "is equal to",
        neq: "is not equal to",
        gt: "is greater than",
        lt: "is less than",
        contains: "contains text",
        starts_with: "starts with text",
        ends_with: "ends with text",
        in: "is one of",
        between: "is between",
        is_null: "is empty",
        is_not_null: "is not empty",
        before: "is before date",
        after: "is after date",
      },
    },
    onChange: (tree: Tree, query?: string) => {
      console.log(tree, query);
    },
  },
};

export const Styling: Story = {
  render: (args) => {
    const [selectedTheme, setSelectedTheme] = useState<string>("modern");

    // Define different styling themes
    const themes = {
      modern: {
        name: "🎨 Modern",
        classNames: {
          root: "bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg",
          group:
            "bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg p-4 shadow-sm",
          controls: "flex gap-3 mb-4 items-center flex-wrap",
          button:
            "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg",
          children: "flex flex-col gap-3",
          childWrapper:
            "bg-white rounded-lg p-3 border border-gray-200 shadow-sm",
          conditionRow: "flex gap-3 items-center flex-wrap",
          fieldSelect:
            "px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-gray-700",
          operatorSelect:
            "px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-gray-700",
          valueInput:
            "px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-gray-700",
        },
      },
      classic: {
        name: "📰 Classic",
        classNames: {
          root: "bg-gray-50 border border-gray-400 p-4 font-serif",
          group: "bg-white border border-gray-600 p-3 mb-2",
          controls:
            "flex gap-2 mb-3 items-center border-b border-gray-300 pb-2",
          button:
            "px-3 py-1 bg-gray-200 border border-gray-400 hover:bg-gray-300 text-gray-800 font-medium",
          children: "flex flex-col gap-2 pl-4 border-l-2 border-gray-300",
          childWrapper: "bg-gray-50 p-2 border border-gray-300",
          conditionRow: "flex gap-2 items-center",
          fieldSelect:
            "px-2 py-1 border border-gray-500 bg-white text-gray-800",
          operatorSelect:
            "px-2 py-1 border border-gray-500 bg-white text-gray-800",
          valueInput: "px-2 py-1 border border-gray-500 bg-white text-gray-800",
        },
      },
      dark: {
        name: "🌙 Dark",
        classNames: {
          root: "bg-gray-900 border border-gray-700 rounded-lg p-6 text-white",
          group: "bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-lg",
          controls: "flex gap-3 mb-4 items-center",
          button:
            "px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium",
          children: "flex flex-col gap-3",
          childWrapper: "bg-gray-750 rounded-md p-3 border border-gray-600",
          conditionRow: "flex gap-3 items-center",
          fieldSelect:
            "px-3 py-2 border border-gray-600 rounded-md focus:border-purple-500 focus:outline-none bg-gray-700 text-white",
          operatorSelect:
            "px-3 py-2 border border-gray-600 rounded-md focus:border-purple-500 focus:outline-none bg-gray-700 text-white",
          valueInput:
            "px-3 py-2 border border-gray-600 rounded-md focus:border-purple-500 focus:outline-none bg-gray-700 text-white",
        },
      },
      colorful: {
        name: "🌈 Colorful",
        classNames: {
          root: "bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 border-4 border-gradient-to-r from-pink-500 to-indigo-500 rounded-2xl p-6",
          group:
            "bg-white/80 backdrop-blur border-2 border-purple-300 rounded-xl p-4 shadow-lg",
          controls: "flex gap-3 mb-4 items-center flex-wrap",
          button:
            "px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105",
          children: "flex flex-col gap-4",
          childWrapper:
            "bg-gradient-to-r from-white to-purple-50 rounded-lg p-3 border-2 border-purple-200 shadow-md",
          conditionRow: "flex gap-3 items-center flex-wrap",
          fieldSelect:
            "px-3 py-2 border-2 border-pink-300 rounded-xl focus:border-purple-500 focus:outline-none bg-white text-gray-700 shadow-sm",
          operatorSelect:
            "px-3 py-2 border-2 border-purple-300 rounded-xl focus:border-pink-500 focus:outline-none bg-white text-gray-700 shadow-sm",
          valueInput:
            "px-3 py-2 border-2 border-indigo-300 rounded-xl focus:border-purple-500 focus:outline-none bg-white text-gray-700 shadow-sm",
        },
      },
      minimal: {
        name: "✨ Minimal",
        classNames: {
          root: "bg-white p-6",
          group: "border-l-4 border-gray-300 pl-4 py-2",
          controls: "flex gap-4 mb-3 items-center",
          button: "text-blue-600 hover:text-blue-800 underline font-medium",
          children: "flex flex-col gap-2 ml-4",
          childWrapper: "py-1",
          conditionRow: "flex gap-3 items-center",
          fieldSelect:
            "border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent py-1",
          operatorSelect:
            "border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent py-1",
          valueInput:
            "border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent py-1",
        },
      },
      corporate: {
        name: "💼 Corporate",
        classNames: {
          root: "bg-blue-50 border-2 border-blue-200 p-8 rounded-sm",
          group: "bg-white border border-blue-300 p-6 shadow-sm",
          controls:
            "flex gap-3 mb-4 items-center border-b border-blue-200 pb-3",
          button:
            "px-6 py-2 bg-blue-700 text-white font-semibold uppercase text-xs tracking-wider hover:bg-blue-800 transition-colors",
          children: "flex flex-col gap-4 mt-4",
          childWrapper: "bg-blue-50 border border-blue-200 p-4",
          conditionRow: "flex gap-4 items-center",
          fieldSelect:
            "px-4 py-3 border border-blue-300 bg-white text-blue-900 font-medium focus:border-blue-600 focus:outline-none",
          operatorSelect:
            "px-4 py-3 border border-blue-300 bg-white text-blue-900 font-medium focus:border-blue-600 focus:outline-none",
          valueInput:
            "px-4 py-3 border border-blue-300 bg-white text-blue-900 font-medium focus:border-blue-600 focus:outline-none",
        },
      },
    };

    const currentTheme = themes[selectedTheme as keyof typeof themes];

    return (
      <div>
        <div style={{ marginBottom: "24px" }}>
          <h3
            style={{
              marginBottom: "16px",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            🎨 Filter Builder Styling Showcase
          </h3>
          <p style={{ marginBottom: "20px", color: "#666" }}>
            Choose different visual themes to see how the filter builder can be
            styled using the `classNames` prop.
          </p>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Select Theme:
            </label>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTheme(key)}
                  style={{
                    padding: "10px 16px",
                    backgroundColor:
                      selectedTheme === key ? "#3b82f6" : "#f3f4f6",
                    color: selectedTheme === key ? "white" : "#374151",
                    border: "2px solid",
                    borderColor: selectedTheme === key ? "#3b82f6" : "#d1d5db",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedTheme !== key) {
                      e.currentTarget.style.backgroundColor = "#e5e7eb";
                      e.currentTarget.style.borderColor = "#9ca3af";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedTheme !== key) {
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                      e.currentTarget.style.borderColor = "#d1d5db";
                    }
                  }}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              marginBottom: "24px",
            }}
          >
            <h4
              style={{
                marginBottom: "12px",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Current Theme: {currentTheme.name}
            </h4>
            <details>
              <summary
                style={{
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#4f46e5",
                }}
              >
                📋 View Theme Configuration
              </summary>
              <pre
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  backgroundColor: "#1f2937",
                  color: "#f9fafb",
                  borderRadius: "6px",
                  fontSize: "12px",
                  overflow: "auto",
                  maxHeight: "300px",
                }}
              >
                {JSON.stringify(currentTheme.classNames, null, 2)}
              </pre>
            </details>
          </div>
        </div>

        <FilterBuilder {...args} classNames={currentTheme.classNames} />
      </div>
    );
  },
  args: {
    initial: {
      and: [
        {
          or: [
            { field: "age", operator: "between", value: [25, 35] },
            { field: "age", operator: "gt", value: 45 },
          ],
        },
        { field: "isActive", operator: "eq", value: true },
        {
          and: [
            { field: "role", operator: "in", value: ["developer", "designer"] },
            { field: "createdAt", operator: "after", value: "2022-01-01" },
          ],
        },
      ],
    },
    schema: [
      { name: "age", label: "Age", type: "number" },
      {
        name: "role",
        label: "Role",
        type: "string",
        options: ["developer", "designer", "manager", "analyst"],
      },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "createdAt", label: "Created", type: "date" },
      { name: "salary", label: "Salary", type: "number" },
      {
        name: "department",
        label: "Department",
        type: "string",
        options: ["engineering", "design", "marketing", "sales"],
      },
    ],
    operatorsByType,
    language: "en",
    onChange: (tree: Tree, query?: string) => {
      console.log("Filter tree:", tree);
      console.log("Generated query:", query);
    },
  },
};

export const BrokenTreeValidation: Story = {
  render: (args) => {
    const [currentTree, setCurrentTree] = useState<Tree>({ and: [] });
    const [validationResult, setValidationResult] = useState<{
      valid: boolean;
      errors: Array<{ id: string; message: string }>;
    }>({ valid: true, errors: [] });

    const brokenTrees = [
      {
        name: "Between operator with wrong values",
        tree: {
          and: [
            { field: "age", operator: "between", value: [25] }, // Should have 2 values
            { field: "price", operator: "between", value: "not-an-array" }, // Should be array
          ],
        },
      },
      {
        name: "In operator with invalid values",
        tree: {
          and: [
            { field: "role", operator: "in", value: [] }, // Empty array
            { field: "category", operator: "in", value: "single-value" }, // Should be array
          ],
        },
      },
      {
        name: "Null operators with values",
        tree: {
          and: [
            {
              field: "optional",
              operator: "is_null",
              value: "should-not-have-value",
            },
            { field: "required", operator: "is_not_null", value: null },
          ],
        },
      },
      {
        name: "Mixed validation errors",
        tree: {
          and: [
            { field: "age", operator: "between", value: [18, 25, 35] }, // Too many values
            { field: "role", operator: "in", value: [] }, // Empty array
            { field: "optional", operator: "is_null", value: "has-value" }, // Should not have value
            {
              or: [
                { field: "price", operator: "between", value: "not-array" }, // Wrong type
                { field: "status", operator: "is_not_null", value: false }, // Should not have value
              ],
            },
          ],
        },
      },
    ];

    const handleTreeSelect = (treeExample: any) => {
      const deserializedTree = deserialize(treeExample.tree);
      const validation = validateTree(deserializedTree);

      setCurrentTree(treeExample.tree);
      setValidationResult(validation);

      console.log("Selected broken tree:", treeExample.tree);
      console.log("Validation result:", validation);
    };

    const handleFilterChange = (tree: Tree) => {
      setCurrentTree(tree);

      const deserializedTree = deserialize(tree);
      const validation = validateTree(deserializedTree);
      setValidationResult(validation);

      console.log("Filter tree changed:", tree);
      console.log("Validation result:", validation);
    };

    return (
      <div>
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "16px" }}>🔍 Tree Validation Demo</h3>
          <p style={{ marginBottom: "16px", color: "#666" }}>
            Click on any broken tree example below to load it into the
            FilterBuilder and see the validation errors.
          </p>

          <div style={{ marginBottom: "20px" }}>
            <h4>Broken Tree Examples:</h4>
            {brokenTrees.map((example, index) => (
              <button
                key={index}
                onClick={() => handleTreeSelect(example)}
                style={{
                  display: "block",
                  margin: "8px 0",
                  padding: "10px 16px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  textAlign: "left",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e9ecef";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                }}
              >
                📋 {example.name}
              </button>
            ))}
          </div>

          <div
            style={{
              padding: "16px",
              border: `2px solid ${validationResult.valid ? "#28a745" : "#dc3545"}`,
              borderRadius: "8px",
              backgroundColor: validationResult.valid ? "#d4edda" : "#f8d7da",
              marginBottom: "20px",
            }}
          >
            <h4
              style={{
                color: validationResult.valid ? "#155724" : "#721c24",
                margin: "0 0 12px 0",
                fontSize: "16px",
              }}
            >
              {validationResult.valid
                ? "✅ Tree is Valid"
                : "❌ Tree has Validation Errors"}
            </h4>

            {!validationResult.valid && validationResult.errors.length > 0 && (
              <div>
                <p
                  style={{
                    margin: "0 0 12px 0",
                    color: "#721c24",
                    fontSize: "14px",
                  }}
                >
                  Found {validationResult.errors.length} validation error
                  {validationResult.errors.length > 1 ? "s" : ""}:
                </p>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "20px",
                    color: "#721c24",
                  }}
                >
                  {validationResult.errors.map((error, index) => (
                    <li
                      key={index}
                      style={{ marginBottom: "4px", fontSize: "14px" }}
                    >
                      <strong>ID: {error.id}</strong> - {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult.valid && (
              <p
                style={{
                  margin: 0,
                  color: "#155724",
                  fontSize: "14px",
                }}
              >
                All validation rules passed successfully!
              </p>
            )}
          </div>

          {/* Current Tree JSON Display */}
          <details style={{ marginBottom: "20px" }}>
            <summary
              style={{
                cursor: "pointer",
                padding: "8px",
                backgroundColor: "#f8f9fa",
                border: "1px solid #dee2e6",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            >
              📄 View Current Tree JSON
            </summary>
            <pre
              style={{
                marginTop: "8px",
                padding: "12px",
                backgroundColor: "#f8f9fa",
                border: "1px solid #dee2e6",
                borderRadius: "4px",
                fontSize: "12px",
                overflow: "auto",
                maxHeight: "200px",
              }}
            >
              {JSON.stringify(currentTree, null, 2)}
            </pre>
          </details>
        </div>

        <FilterBuilder
          {...args}
          initial={currentTree}
          onChange={handleFilterChange}
        />
      </div>
    );
  },
  args: {
    schema: [
      { name: "age", label: "Age", type: "number" },
      { name: "price", label: "Price", type: "number" },
      {
        name: "role",
        label: "Role",
        type: "string",
        options: ["admin", "user", "moderator"],
      },
      {
        name: "category",
        label: "Category",
        type: "string",
        options: ["electronics", "clothing", "books"],
      },
      { name: "optional", label: "Optional Field", type: "string" },
      { name: "required", label: "Required Field", type: "string" },
      { name: "status", label: "Status", type: "boolean" },
    ],
    operatorsByType,
    language: "en",
  },
};
