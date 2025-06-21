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

interface Variant {
  image: string;
  price: number;
  volume: number;
}

interface Product {
  _id: string;
  name: string;
  categoryId: Category;
  brandId: Brand;
  variants: Variant[];
}

const categories = [
  "Nước hoa Nam",
  "Nước hoa Nữ",
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
            {currentProducts.map((product) => {
              const firstVariant = product.variants[0];

              return (
                <Link
                to={`/productdetails/${product._id}`}
                key={product._id}
                className="group p-4 border rounded-lg hover:shadow transition block"
              >
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <img
                    src={firstVariant.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 text-left">
                  {product.name}
                </h3>

                <div className="flex gap-2 mb-2">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                    {product.categoryId?.name || 'Danh mục?'}
                  </span>
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    {product.brandId?.name || 'Thương hiệu?'}
                  </span>
                </div>

                <div className="text-red-500 font-semibold text-sm text-left">
                  {firstVariant.price.toLocaleString()}
                </div>
              </Link>
              );
            })}
          </div>

          <div className="flex justify-center mt-8">
            <ul className="flex space-x-2 text-sm">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductList;