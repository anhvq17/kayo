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
  image: string;
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

const categories = ["Nam", "Nữ"];

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/products");
        setProducts(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    const fetchBrands = async () => {
      try {
        const res = await axios.get("http://localhost:3000/brands");
        setBrands(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy thương hiệu:", error);
      }
    };

    fetchProducts();
    fetchBrands();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, selectedPriceRange]);

  const filteredProducts = products.filter((product) => {
    const firstVariant = product.variants[0];

    const matchCategory = selectedCategory
      ? product.categoryId.name === selectedCategory
      : true;

    const matchBrand = selectedBrand
      ? product.brandId.name === selectedBrand
      : true;

    const matchPrice = (() => {
      if (!selectedPriceRange) return true;
      const price = firstVariant.price;
      switch (selectedPriceRange) {
        case ">-2":
          return price < 2000000;
        case "2-4":
          return price >= 2000000 && price <= 4000000;
        case "<-4":
          return price > 4000000;
        default:
          return true;
      }
    })();

    return matchCategory && matchBrand && matchPrice;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

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
            <h2 className="font-bold mb-5 border-b pb-1">BỘ LỌC SẢN PHẨM</h2>
            <div className="mb-6 relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none border border-gray-300 rounded-lg bg-white px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:ring-[#5f518e] focus:border-[#5f518e] hover:shadow-sm transition"
              >
                <option value="">-- Danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="mb-6 relative">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full appearance-none border border-gray-300 rounded-lg bg-white px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:ring-[#5f518e] focus:border-[#5f518e] hover:shadow-sm transition"
              >
                <option value="">-- Thương hiệu --</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand.name}>{brand.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="mb-6 relative">
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full appearance-none border border-gray-300 rounded-lg bg-white px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:ring-[#5f518e] focus:border-[#5f518e] hover:shadow-sm transition"
              >
                <option value="">-- Giá tiền --</option>
                <option value=">-2">Dưới 2 triệu</option>
                <option value="2-4">2 - 4 triệu</option>
                <option value="<-4">Trên 4 triệu</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {selectedCategory && (
                <div className="flex items-center bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("")} className="ml-2 focus:outline-none hover:text-orange-900">✕</button>
                </div>
              )}
              {selectedBrand && (
                <div className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {selectedBrand}
                  <button onClick={() => setSelectedBrand("")} className="ml-2 focus:outline-none hover:text-green-900">✕</button>
                </div>
              )}
              {selectedPriceRange && (
                <div className="flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                  {{
                    ">-2": "Dưới 2 triệu",
                    "2-4": "2 - 4 triệu",
                    "<-4": "Trên 4 triệu",
                  }[selectedPriceRange]}
                  <button onClick={() => setSelectedPriceRange("")} className="ml-2 focus:outline-none hover:text-red-900">✕</button>
                </div>
              )}
            </div>

            <div className="mt-10">
              <h2 className="font-bold mb-5 border-b pb-1">THƯƠNG HIỆU NỔI BẬT</h2>
              <div className="grid grid-cols-2 gap-3">
                {brands.map((brand) => (
                  <div
                    key={brand._id}
                    className={`cursor-pointer p-2 border rounded-lg hover:shadow ${
                      selectedBrand === brand.name ? "border-[#5f518e]" : "border-gray-200"
                    }`}
                    onClick={() => setSelectedBrand(brand.name)}
                  >
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-16 object-contain mx-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
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
                      {product.categoryId?.name || "Danh mục?"}
                    </span>
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      {product.brandId?.name || "Thương hiệu?"}
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