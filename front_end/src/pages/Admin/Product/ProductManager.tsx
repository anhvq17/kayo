import { useEffect, useState } from "react";
import { Edit, Trash, Plus, Eye, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

// Custom confirm
const confirmToast = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    toast.custom((t) => (
      <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200 max-w-md w-full mx-auto animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-600" size={24} />
          <h3 className="text-lg font-semibold text-gray-800">Xác nhận hành động</h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
            onClick={() => {
              toast.dismiss(t);
              resolve(false);
            }}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            onClick={() => {
              toast.dismiss(t);
              resolve(true);
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    ), {
      duration: 0, 
      position: "top-center",
      style: { background: "transparent", padding: 0, border: "none" },
    });
  });
};

type Category = {
  _id: string;
  name: string;
};

type Brand = {
  _id: string;
  name: string;
};

type Product = {
  _id: string;
  name: string;
  description: string;
  priceDefault: number;
  image: string;
  categoryId: Category;
  brandId: Brand;
};

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const productsPerPage = 5;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/products");
      setProducts(res.data.data);
      setSelectedIds([]);
      setCurrentPage(1);
    } catch (error: unknown) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      toast.error("Lỗi khi lấy danh sách sản phẩm", { duration: 2000 });
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/categories");
      setCategories(res.data.data);
    } catch (error: unknown) {
      console.error("Lỗi lấy danh mục:", error);
      toast.error("Lỗi khi lấy danh mục", { duration: 2000 });
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await axios.get("http://localhost:3000/brands");
      setBrands(res.data.data);
    } catch (error: unknown) {
      console.error("Lỗi lấy thương hiệu:", error);
      toast.error("Lỗi khi lấy thương hiệu", { duration: 2000 });
    }
  };

  const handleSoftDelete = async (id: string) => {
    const confirmed = await confirmToast("Bạn có chắc muốn xóa sản phẩm này?");
    if (!confirmed) {
      return;
    }

    toast.promise(
      axios.delete(`http://localhost:3000/products/soft/${id}`),
      {
        loading: "Đang xóa sản phẩm...",
        success: () => {
          fetchProducts();
          return "Đã chuyển sản phẩm và biến thể vào thùng rác";
        },
        error: (error: unknown) => {
          console.error("Lỗi xóa mềm:", error);
          return "Xóa thất bại";
        },
        duration: 2000,
      }
    );
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSoftDeleteMany = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = await confirmToast(`Xóa ${selectedIds.length} sản phẩm đã chọn?`);
    if (!confirmed) {
      return;
    }

    toast.promise(
      axios.delete("http://localhost:3000/products/soft-delete-many", {
        data: { ids: selectedIds },
      }),
      {
        loading: "Đang xóa các sản phẩm...",
        success: () => {
          fetchProducts();
          return "Đã chuyển các sản phẩm và biến thể vào thùng rác";
        },
        error: (error: unknown) => {
          console.error("Lỗi xóa nhiều:", error);
          return "Xóa thất bại";
        },
        duration: 2000,
      }
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const filteredProducts = products.filter((item) => {
    const matchName = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory ? item.categoryId._id === selectedCategory : true;
    const matchBrand = selectedBrand ? item.brandId._id === selectedBrand : true;
    return matchName && matchCategory && matchBrand;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">Danh sách sản phẩm</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1 border rounded"
          />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1 border rounded"
          >
            <option value="">-- Danh mục --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1 border rounded"
          >
            <option value="">-- Thương hiệu --</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>{brand.name}</option>
            ))}
          </select>
          <button
            onClick={handleSoftDeleteMany}
            disabled={selectedIds.length === 0}
            className={`px-3 h-8 rounded text-sm text-white transition ${
              selectedIds.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Xóa đã chọn ({selectedIds.length})
          </button>
          <Link to="/admin/products/add">
            <button className="w-8 h-8 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center">
              <Plus size={14} />
            </button>
          </Link>
        </div>
      </div>

      <div className="flex gap-6 border-b my-4 text-base font-medium text-gray-500">
        <Link
          to="/admin/products"
          className="pb-2 border-b-2 border-blue-500 text-blue-600"
        >
          Sản phẩm đang hoạt động
        </Link>
        <Link
          to="/admin/products/trash"
          className="pb-2 hover:text-blue-500 hover:border-b-2 hover:border-blue-300"
        >
          Thùng rác
        </Link>
      </div>

      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="px-4 py-2 w-10"></th>
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Ảnh</th>
            <th className="px-4 py-2">Tên sản phẩm</th>
            <th className="px-4 py-2">Giá tiền</th>
            <th className="px-4 py-2">Danh mục</th>
            <th className="px-4 py-2">Thương hiệu</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-4">
                Không có sản phẩm
              </td>
            </tr>
          ) : (
            currentProducts.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-50 border-b">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item._id)}
                    onChange={() => handleSelect(item._id)}
                    className="w-5 h-5 accent-blue-600"
                  />
                </td>
                <td className="px-4 py-2">{indexOfFirstProduct + index + 1}</td>
                <td className="px-4 py-2">
                  <img
                    src={item.image || "/placeholder.svg?height=60&width=60"}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded border"
                  />
                </td>
                <td className="px-4 py-2 max-w-[220px]">
                  <div className="font-medium truncate">{item.name}</div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">
                    {item.description}
                  </div>
                </td>
                <td className="px-4 py-2 font-medium text-red-600">
                  {formatPrice(item.priceDefault)}
                </td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 font-semibold bg-orange-100 text-orange-700 rounded-full text-xs">
                    {item.categoryId?.name || "Không xác định"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 font-semibold bg-green-100 text-green-700 rounded-full text-xs">
                    {item.brandId?.name || "Không xác định"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-1">
                    <Link to={`/admin/products/${item._id}`}>
                      <button className="w-8 h-8 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center justify-center">
                        <Eye size={14} />
                      </button>
                    </Link>
                    <Link to={`/admin/products/edit/${item._id}`}>
                      <button className="w-8 h-8 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center">
                        <Edit size={14} />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleSoftDelete(item._id)}
                      className="w-8 h-8 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default ProductManager;