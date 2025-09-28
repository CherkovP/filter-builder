# FilterBuilder

A powerful, flexible React component library for building complex filter interfaces with visual query builders. Perfect for data tables, search interfaces, and advanced filtering requirements.

## Features

- 🎯 **Intuitive Visual Interface** - Drag-and-drop style filter building with nested groups
- 🔧 **Flexible Configuration** - Support for multiple field types (string, number, date, boolean, select)
- 🌐 **Internationalization** - Built-in i18n support with English and German translations
- � **Customizable Styling** - Complete control over appearance with CSS class customization
- � **API Ready** - Generate query strings for GET requests or JSON for POST requests
- ✅ **Type Safe** - Full TypeScript support with comprehensive type definitions
- � **Validation** - Built-in validation for filter tree consistency
- 📦 **Zero Dependencies** - Lightweight with minimal external dependencies

## Quick Start

```bash
# Install the package
npm install @acme/ui

# Import and use
import { FilterBuilder } from "@acme/ui/filter-builder";
import "@acme/ui/styles"; // Import styles
```

## Installation & Usage

### Prerequisites

- Node.js 18+
- pnpm (recommended package manager)

### Installation

```bash
# Using npm
npm install @acme/ui

# Using pnpm (recommended)
pnpm add @acme/ui

# Using yarn
yarn add @acme/ui
```

### Basic Usage

```tsx
import React, { useState } from "react";
import { FilterBuilder, Tree } from "@acme/ui/filter-builder";
import "@acme/ui/styles"; // Import styles

// Define your data schema
const schema = [
  { name: "age", label: "Age", type: "number" },
  { name: "name", label: "Name", type: "string" },
  {
    name: "role",
    label: "Role",
    type: "string",
    options: ["admin", "user", "moderator"],
  },
  { name: "isActive", label: "Active", type: "boolean" },
  { name: "createdAt", label: "Created Date", type: "date" },
];

// Configure which operators are available for each field type
const operatorsByType = {
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

function MyFilterComponent() {
  const [filterTree, setFilterTree] = useState<Tree>({ and: [] });

  const handleFilterChange = (tree: Tree, queryString?: string) => {
    setFilterTree(tree);
    console.log("Filter tree:", tree);
    console.log("Query string:", queryString); // For GET requests
  };

  return (
    <FilterBuilder
      schema={schema}
      operatorsByType={operatorsByType}
      onChange={handleFilterChange}
      api={{ mode: "GET", encode: "uri" }} // Generate URL query strings
    />
  );
}
```

### Advanced Usage

```tsx
import React, { useState } from "react";
import {
  FilterBuilder,
  Tree,
  validateTree,
  deserialize,
} from "@acme/ui/filter-builder";

function AdvancedFilterComponent() {
  const [filterTree, setFilterTree] = useState<Tree>({ and: [] });

  // Pre-populate with an initial filter
  const initialFilter: Tree = {
    and: [
      { field: "age", operator: "between", value: [25, 65] },
      {
        or: [
          { field: "role", operator: "in", value: ["admin", "moderator"] },
          { field: "isActive", operator: "eq", value: true },
        ],
      },
    ],
  };

  const handleFilterChange = (tree: Tree, queryString?: string) => {
    // Validate the filter tree
    const deserialized = deserialize(tree);
    const validation = validateTree(deserialized);

    if (!validation.valid) {
      console.error("Filter validation errors:", validation.errors);
      return;
    }

    setFilterTree(tree);

    // Use queryString for GET requests or tree for POST requests
    if (queryString) {
      // For GET: /api/users?filter=encoded_filter_string
      console.log("GET query:", queryString);
    } else {
      // For POST: { filter: tree }
      console.log("POST body:", { filter: tree });
    }
  };

  return (
    <FilterBuilder
      schema={[
        { name: "age", label: "Age", type: "number" },
        {
          name: "role",
          label: "Role",
          type: "string",
          options: ["admin", "user", "moderator"],
        },
        { name: "isActive", label: "Active", type: "boolean" },
      ]}
      operatorsByType={{
        string: ["eq", "neq", "contains", "in"],
        number: ["eq", "neq", "gt", "lt", "between"],
        boolean: ["eq", "neq"],
      }}
      initial={initialFilter} // Pre-populate filter
      onChange={handleFilterChange}
      api={{ mode: "POST" }} // Generate JSON for POST requests
      language="en" // Internationalization
      classNames={{
        // Custom styling
        root: "my-custom-filter-builder",
        group: "my-custom-group",
        button: "my-custom-button",
      }}
    />
  );
}
```

### Working with Filter Results

The FilterBuilder generates structured filter trees that can be applied to your data or sent to your API:

```tsx
// Example: Client-side filtering
import { applyFilters } from "./utils/applyFilters"; // Your filter utility

const data = [
  { id: 1, name: "John", age: 30, role: "admin", isActive: true },
  { id: 2, name: "Jane", age: 25, role: "user", isActive: false },
  // ... more data
];

const handleFilterChange = (tree: Tree) => {
  const filteredData = applyFilters(data, tree);
  setFilteredData(filteredData);
};

// Example: Server-side filtering with GET request
const handleFilterChange = (tree: Tree, queryString?: string) => {
  if (queryString) {
    // Send to server as query parameter
    fetch(`/api/users?filter=${queryString}`)
      .then((response) => response.json())
      .then((data) => setFilteredData(data));
  }
};

// Example: Server-side filtering with POST request
const handleFilterChange = (tree: Tree) => {
  fetch("/api/users/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filter: tree }),
  })
    .then((response) => response.json())
    .then((data) => setFilteredData(data));
};
```

## Configuration API

### FilterBuilderProps

The main component accepts the following props:

```tsx
interface FilterBuilderProps {
  schema: FieldSchema[]; // Field definitions
  operatorsByType: OperatorsByTypeMap; // Available operators per field type
  onChange: (tree: Tree, queryString?: string) => void; // Change handler
  initial?: Tree; // Initial filter state
  api?: ApiConfig; // API configuration
  classNames?: Partial<Record<string, string>>; // CSS class overrides
  language?: string; // Language code (en, de)
  translations?: FilterBuilderTranslations; // Custom translations
}
```

### Field Schema

Define your data fields using the `FieldSchema` interface:

```tsx
interface FieldSchema {
  name: string; // Field identifier (matches your data)
  label?: string; // Display label (defaults to name)
  type: FieldType; // Field data type
  options?: (string | number | boolean | Date)[]; // For select fields
}

// Supported field types
type FieldType = "string" | "number" | "boolean" | "date" | "select" | "array";
```

**Field Type Examples:**

```tsx
const schema = [
  // String field with all string operators
  { name: "email", label: "Email Address", type: "string" },

  // Number field for numeric operations
  { name: "price", label: "Price ($)", type: "number" },

  // Boolean field for true/false values
  { name: "isPublished", label: "Published", type: "boolean" },

  // Date field for temporal operations
  { name: "createdAt", label: "Created Date", type: "date" },

  // Select field with predefined options
  {
    name: "status",
    label: "Status",
    type: "string",
    options: ["draft", "published", "archived"],
  },

  // Array field for multi-value operations
  { name: "tags", label: "Tags", type: "array" },
];
```

### Operators Configuration

Configure which operators are available for each field type:

```tsx
const operatorsByType = {
  string: [
    "eq", // equals
    "neq", // not equals
    "contains", // contains text
    "starts_with", // starts with text
    "ends_with", // ends with text
    "in", // is one of (array)
    "is_null", // is empty/null
    "is_not_null", // is not empty/null
  ],
  number: [
    "eq", // equals
    "neq", // not equals
    "gt", // greater than
    "lt", // less than
    "between", // between two values
    "in", // is one of (array)
  ],
  boolean: [
    "eq", // equals
    "neq", // not equals
    "is_null", // is null
    "is_not_null", // is not null
  ],
  date: [
    "eq", // equals (same date)
    "before", // before date
    "after", // after date
    "between", // between two dates
    "in", // is one of (array)
  ],
};
```

### API Configuration

Control how filters are serialized for your backend:

```tsx
interface ApiConfig {
  mode: "GET" | "POST"; // Request method
  encode?: "uri" | "b64"; // Encoding for GET requests
}

// Examples:
const configs = {
  // Generate URL query strings (default: URI encoding)
  getWithUri: { mode: "GET", encode: "uri" },

  // Generate Base64 encoded query strings
  getWithB64: { mode: "GET", encode: "b64" },

  // Generate JSON for POST request body
  post: { mode: "POST" },
};
```

**GET Request Output:**

```
// URI encoded (default)
/api/users?filter=%7B%22and%22%3A%5B%7B%22field%22%3A%22age%22%7D%5D%7D

// Base64 encoded
/api/users?filter=eyJhbmQiOlt7ImZpZWxkIjoiYWdlIn1dfQ==
```

**POST Request Output:**

```json
{
  "and": [
    { "field": "age", "operator": "gt", "value": 25 },
    { "field": "role", "operator": "in", "value": ["admin", "moderator"] }
  ]
}
```

### Internationalization

Built-in support for multiple languages:

```tsx
// Use built-in translations
<FilterBuilder language="en" />  // English (default)
<FilterBuilder language="de" />  // German

// Provide custom translations
<FilterBuilder
  language="en"
  translations={{
    operators: {
      and: 'ALL OF',
      or: 'ANY OF',
      eq: 'is equal to',
      contains: 'contains text',
      // ... more operator labels
    },
    buttons: {
      addCondition: '➕ Add Rule',
      addGroup: '📁 Add Group',
      remove: '❌ Delete',
      // ... more button labels
    },
    values: {
      true: 'Yes',
      false: 'No',
      empty: '(empty)',
      placeholderArray: 'value1, value2, value3'
    }
  }}
/>
```

### Custom Styling

Complete control over component appearance:

```tsx
<FilterBuilder
  classNames={{
    root: "custom-filter-builder", // Main container
    group: "custom-group", // Filter groups (AND/OR)
    controls: "custom-controls", // Button controls
    button: "custom-button", // Action buttons
    children: "custom-children", // Child container
    childWrapper: "custom-child-wrapper", // Individual child wrapper
    conditionRow: "custom-condition-row", // Condition rows
    fieldSelect: "custom-field-select", // Field dropdowns
    operatorSelect: "custom-operator-select", // Operator dropdowns
    valueInput: "custom-value-input", // Value inputs
  }}
/>
```

### Filter Tree Structure

The component uses a nested tree structure for complex filters:

```tsx
// Simple filter
const simpleFilter: Tree = {
  and: [
    { field: "age", operator: "gt", value: 25 },
    { field: "role", operator: "eq", value: "admin" },
  ],
};

// Complex nested filter
const complexFilter: Tree = {
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
        { field: "role", operator: "in", value: ["admin", "moderator"] },
        { field: "createdAt", operator: "after", value: "2023-01-01" },
      ],
    },
  ],
};
```

## Architecture Decisions

### Design Philosophy

The FilterBuilder is designed with several key principles:

1. **Composability** - Complex filters are built from simple, composable parts
2. **Type Safety** - Full TypeScript support prevents runtime errors
3. **Flexibility** - Configurable to work with any data schema
4. **Performance** - Minimal re-renders and efficient tree operations
5. **Accessibility** - Proper ARIA labels and keyboard navigation

### Component Architecture

```
FilterBuilder (Main Container)
├── TranslationProvider (i18n Context)
└── FilterBuilderInner
    └── GroupEditor (Recursive Component)
        ├── Controls (Add/Remove buttons)
        ├── LogicalOperator (AND/OR selector)
        └── Children (Recursive)
            ├── ConditionRow (Leaf nodes)
            │   ├── FieldSelect
            │   ├── OperatorSelect
            │   └── ValueInput (Dynamic based on operator)
            └── GroupEditor (Nested groups)
```

**Key Components:**

- **FilterBuilder**: Main component with translation and state management
- **GroupEditor**: Handles logical groups (AND/OR) and recursively renders children
- **ConditionRow**: Renders individual filter conditions (field + operator + value)
- **ValueInput**: Dynamic input component that adapts to different operators and field types

### Tree Serialization System

The library uses a dual-tree system for optimal performance and API compatibility:

#### Internal Tree (GroupNode/ConditionNode)

```tsx
// Optimized for component state and UI operations
interface GroupNode {
  id: string; // Unique identifier
  operator: "and" | "or"; // Logical operator
  children: (GroupNode | ConditionNode)[]; // Child nodes
}

interface ConditionNode {
  id: string; // Unique identifier
  field: string; // Field name
  operator: ConditionOperator; // Comparison operator
  value?: any; // Filter value
  type?: FieldType; // Field type for validation
}
```

#### External Tree (Tree/TreeNode)

```tsx
// Optimized for serialization and API transmission
type Tree =
  | {
      and: TreeNode[];
    }
  | {
      or: TreeNode[];
    };

type TreeNode =
  | Tree
  | {
      field: string;
      operator: ConditionOperator;
      value?: any;
    };
```

**Conversion Flow:**

1. UI changes update internal tree (with IDs for React keys)
2. `serialize()` converts to external tree (clean JSON)
3. `deserialize()` converts back to internal tree (generates new IDs)

### Validation System

Multi-layered validation ensures data integrity:

#### 1. Type-Level Validation (TypeScript)

```tsx
// Compile-time type checking
const operators: OperatorsByTypeMap = {
  string: ["eq", "contains"], // ✅ Valid operators
  number: ["invalid"], // ❌ TypeScript error
};
```

#### 2. Runtime Validation

```tsx
// Validates filter tree consistency
const validation = validateTree(filterTree);
if (!validation.valid) {
  validation.errors.forEach((error) => {
    console.error(`Node ${error.id}: ${error.message}`);
  });
}
```

**Validation Rules:**

- `between` operator must have exactly 2 values
- `in` operator must have non-empty array
- `is_null`/`is_not_null` operators cannot have values
- Field names must exist in schema
- Operators must be valid for field type

### State Management Patterns

#### Immutable Updates

All tree modifications create new objects to ensure React re-renders:

```tsx
// Add condition - creates new tree
const addCondition = (parentId: string) => {
  const newTree = { ...tree };
  // ... immutable update logic
  setTree(newTree);
};

// Remove node - creates new tree
const removeNode = (nodeId: string) => {
  const newTree = { ...tree };
  // ... immutable removal logic
  setTree(newTree);
};
```

#### Change Detection

The `onChange` callback fires only when the tree structure actually changes, preventing unnecessary API calls or re-computations.

### Encoding Strategies

The library supports multiple encoding strategies for API integration:

#### URI Encoding (Default)

```tsx
// Standard URL encoding for query parameters
const encoded = encodeURIComponent(JSON.stringify(tree));
// Output: /api/data?filter=%7B%22and%22%3A%5B...
```

#### Base64 Encoding

```tsx
// More compact for complex filters
const encoded = btoa(JSON.stringify(tree));
// Output: /api/data?filter=eyJhbmQiOlt7ImZpZWxkIjoi...
```

#### JSON (POST)

```tsx
// Direct JSON for POST request bodies
fetch("/api/data", {
  method: "POST",
  body: JSON.stringify({ filter: tree }),
});
```

## Development

This project uses a monorepo structure powered by:

- 🏎 [Turborepo](https://turborepo.com) — High-performance build system
- 🚀 [React](https://reactjs.org/) — UI framework
- 🛠 [Tsup](https://github.com/egoist/tsup) — TypeScript bundler
- 📖 [Storybook](https://storybook.js.org/) — Component development environment

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd filter-builder

# Install dependencies
pnpm install

# Start development
pnpm dev
```

### Running Storybook Locally

To start the Storybook development server and explore the FilterBuilder components:

```bash
# From the root folder, start Storybook
pnpm dev

# This will start Storybook and automatically open your browser to:
# http://localhost:6006
```

The Storybook interface provides:

- 📖 Interactive component documentation
- 🎮 Live component playground with controls
- 🎨 Visual examples and use cases

You can explore different FilterBuilder configurations, test various field types and operators, and see real-time examples of how the component works with different data schemas.

### Available Commands

- `pnpm build` - Build all packages, including the Storybook site
- `pnpm dev` - Run all packages locally and preview with Storybook
- `pnpm lint` - Lint all packages
- `pnpm test` - Run test suites
- `pnpm test:watch` - Run tests in watch mode
- `pnpm changeset` - Generate a changeset for versioning
- `pnpm clean` - Clean up all `node_modules` and `dist` folders

### Project Structure

```
packages/
├── ui/                    # Main FilterBuilder component library
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Utility functions
│   │   ├── translations/  # i18n translations
│   │   └── context/       # React context providers
│   └── tests/             # Test files
├── eslint-config/         # Shared ESLint configuration
└── typescript-config/     # Shared TypeScript configuration

apps/
└── docs/                  # Storybook documentation site
    ├── stories/           # Storybook stories
    └── src/               # Documentation utilities
```

### Testing

The library includes comprehensive test coverage:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run integration tests
pnpm test --run integration

# Run unit tests only
pnpm test --run unit
```

**Test Structure:**

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions and API integration
- **Validation Tests**: Test filter tree validation logic
- **Serialization Tests**: Test tree conversion and encoding

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass: `pnpm test`
6. Lint your code: `pnpm lint`
7. Commit your changes: `git commit -m 'Add amazing feature'`
8. Push to the branch: `git push origin feature/amazing-feature`
9. Open a Pull Request

### Versioning & Publishing

This project uses [Changesets](https://github.com/changesets/changesets) for version management:

```bash
# Create a changeset
pnpm changeset

# Version packages (updates package.json versions)
pnpm version-packages

# Publish to npm
pnpm release
```

## License

MIT License - see the [LICENSE](LICENSE) file for details.
