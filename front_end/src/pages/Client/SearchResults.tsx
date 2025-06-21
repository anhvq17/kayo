import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

interface Variant {
  image: string;
  price: number;
  volume: number;
}

interface Brand {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  brandId: Brand;
  categoryId: Category;
  variants: Variant[];
}

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);

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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-10 xl:px-16">
        <h1 className="text-2xl font-bold mb-10">
          Kết quả tìm kiếm cho: <span className="text-[#5f518e]">"{query}"</span>
        </h1>

        {filteredProducts.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center p-14 mb-12">
            <img src="/img/notfound.png" className="w-32 h-32 mb-4" />
            <h2 className="text-3xl font-semibold text-gray-700 mb-2">
              Oops! Không tìm thấy sản phẩm nào :(
            </h2>
            <p className="text-gray-500 text-sm text-center max-w-md">
              Hãy thử từ khóa khác hoặc kiểm tra lại chính tả để có kết quả tốt hơn!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const firstVariant = product.variants?.[0];

              return (
                <Link
                  to={`/productdetails/${product._id}`}
                  key={product._id}
                  className="group p-4 border rounded-lg hover:shadow transition block"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <img
                      src={firstVariant?.image || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 text-left">
                    {product.name}
                  </h3>

                  <div className="flex gap-2 mb-2">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                      {product.categoryId?.name || "Danh mục?"}
                    </span>
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      {product.brandId?.name || "Thương hiệu?"}
                    </span>
                  </div>

                  <div className="text-red-500 font-semibold text-sm text-left">
                    {firstVariant?.price?.toLocaleString() || "Liên hệ"}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchResults;