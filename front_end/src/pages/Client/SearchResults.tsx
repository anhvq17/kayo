import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

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
        if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          console.error("Định dạng dữ liệu không chính xác:", data);
          setProducts([]);
        }
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-10 xl:px-16">
        <h1 className="text-2xl font-bold mb-10">
          Kết quả tìm kiếm cho: <span className="text-[#5f518e]">"{query}"</span>
        </h1>
        {filteredProducts.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center p-24">
            <img src="img/notfound.png" className="w-20 h-20 mb-4"/>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Oops! Không tìm thấy sản phẩm nào :(
            </h2>
            <p className="text-gray-500 text-sm text-center max-w-md">
              Hãy thử từ khóa khác hoặc kiểm tra lại chính tả để có kết quả tốt hơn!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {filteredProducts.map((product: any) => (
              <div
                key={product._id}
                className="group relative p-3 border rounded-lg hover:shadow-md transition"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <img
                      src={product.image || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between mt-1">
                    <p className="text-red-500 font-semibold text-sm mt-1">
                      {product.price.toFixed(3)}
                    </p>

                    <div className="mt-2">
                      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        {product.brandId?.name || "Không có thương hiệu"}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchResults;