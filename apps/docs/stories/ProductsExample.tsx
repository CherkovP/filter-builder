export const mockProducts = [
  {
    id: 1,
    name: "iPhone 14 Pro",
    price: 999,
    category: "electronics",
    inStock: true,
    releaseDate: "2022-09-16",
    brand: "Apple",
  },
  {
    id: 2,
    name: "Nike Air Max",
    price: 120,
    category: "footwear",
    inStock: false,
    releaseDate: "2023-02-10",
    brand: "Nike",
  },
  {
    id: 3,
    name: "MacBook Pro",
    price: 1999,
    category: "electronics",
    inStock: true,
    releaseDate: "2023-01-17",
    brand: "Apple",
  },
  {
    id: 4,
    name: "Levi's Jeans",
    price: 89,
    category: "clothing",
    inStock: true,
    releaseDate: "2023-03-05",
    brand: "Levi's",
  },
  {
    id: 5,
    name: "Samsung Galaxy S23",
    price: 799,
    category: "electronics",
    inStock: false,
    releaseDate: "2023-02-01",
    brand: "Samsung",
  },
  {
    id: 6,
    name: "Adidas Ultraboost",
    price: 180,
    category: "footwear",
    inStock: true,
    releaseDate: "2023-04-12",
    brand: "Adidas",
  },
];

const FilterResults = ({ data }: { data: any[] }) => (
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
              Price
            </th>
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Category
            </th>
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              In Stock
            </th>
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Release Date
            </th>
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Brand
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((product) => (
            <tr key={product.id}>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {product.id}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {product.name}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                ${product.price}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {product.category}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {product.inStock ? "✅ Yes" : "❌ No"}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {product.releaseDate}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {product.brand}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default FilterResults;
