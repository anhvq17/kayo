import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  categoryId: Category;
  brandId: Brand;
}

const categories = [
  "Nước hoa Nam",
  "Nước hoa Nữ",
  "Nước hoa UNISEX",
];

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/products");
        const allProducts: Product[] = res.data.data;
        setProducts(allProducts);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };
    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm mb-5">
        <Link to="/" className="text-gray-500 hover:text-gray-900">Trang chủ</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-black">Danh sách sản phẩm</span>
      </div>

      <div className="max-w-7xl mx-auto mt-8 flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-1/4 space-y-9">
          <div>
            <h2 className="font-bold mb-2 border-b pb-1">DANH MỤC</h2>
            <ul className="space-y-1 text-sm">
              {categories.map((item) => (
                <li
                  key={item}
                  className="hover:text-[#5f518e] cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-bold mb-2 border-b pb-1">BỘ LỌC SẢN PHẨM</h2>
          </div>
        </aside>

        <main className="lg:w-3/4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentProducts.map((product) => (
              <Link
                key={product._id}
                to={`/productdetails/${product._id}`}
                className="border p-4 rounded hover:shadow transition relative block"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-contain mb-3"
                />
                <h3 className="text-sm font-medium leading-5">{product.name}</h3>
                <p className="text-red-600 text-2xl font-bold mb-3">
                  {(+product.price || 0).toFixed(3)}
                </p>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <ul className="flex space-x-2 text-sm">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li key={page}>
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded ${
                        page === currentPage
                          ? "bg-[#5f518e] text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductList;