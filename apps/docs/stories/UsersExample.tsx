export const mockUsers = [
  {
    id: 1,
    age: 25,
    role: "developer",
    isActive: true,
    createdAt: "2023-01-15",
    name: "John Doe",
  },
  {
    id: 2,
    age: 32,
    role: "designer",
    isActive: false,
    createdAt: "2022-11-20",
    name: "Jane Smith",
  },
  {
    id: 3,
    age: 45,
    role: "manager",
    isActive: true,
    createdAt: "2021-06-10",
    name: "Bob Johnson",
  },
  {
    id: 4,
    age: 28,
    role: "developer",
    isActive: true,
    createdAt: "2023-03-22",
    name: "Alice Brown",
  },
  {
    id: 5,
    age: 38,
    role: "designer",
    isActive: false,
    createdAt: "2022-08-14",
    name: "Charlie Wilson",
  },
  {
    id: 6,
    age: 29,
    role: "developer",
    isActive: true,
    createdAt: "2023-02-08",
    name: "Diana Davis",
  },
];
const FilterResultsUser = ({ data }: { data: any[] }) => (
  <div
    style={{
      marginTop: "20px",
      padding: "16px",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
    }}
  >
    <h3>Filtered Results ({data.length} items)</h3>
    {data.length === 0 ? (
      <p>No items match the current filters.</p>
    ) : (
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              ID
            </th>
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Name
            </th>
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Age
            </th>
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Role
            </th>
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Active
            </th>
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Created
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {user.id}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {user.name}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {user.age}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {user.role}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {user.isActive ? "✅ Yes" : "❌ No"}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {user.createdAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
export default FilterResultsUser;
