import  { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q") || "";

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/products");
        const data = await res.json();
        console.log("Fetched products:", data);

        if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          console.error("Data format is incorrect:", data);
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        Kết quả tìm kiếm cho: <span className="text-purple-600">"{query}"</span>
      </h1>

      {filteredProducts.length === 0 ? (
        <p>Không tìm thấy sản phẩm nào.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.map((product: any) => (
            <div key={product.id} className="border rounded-md p-4 shadow">
              <img
                
                alt={product.name}
                className="w-full h-40 object-cover mb-2"
              />
              <h2 className="text-lg font-semibold">{product.name}</h2>
           
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;