import { Link } from "react-router-dom";
import { Edit, Eye, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const ProductManager = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 7;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/products");
        setProducts(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        alert("Lỗi khi lấy danh sách sản phẩm");
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      const updated = products.filter((p) => p._id !== id);
      setProducts(updated);
      if ((currentPage - 1) * productsPerPage >= updated.length && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      alert("Đã xóa sản phẩm và các biến thể liên quan");
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      alert("Xóa sản phẩm thất bại");
    }
  };

  // Phân trang
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Danh sách sản phẩm</h1>
        <Link to="/admin/products/add">
          <button className="w-8 h-8 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center">
            <Plus size={14} />
          </button>
        </Link>
      </div>

      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Tên</th>
            <th className="px-4 py-2">Danh mục</th>
            <th className="px-4 py-2">Thương hiệu</th>
            <th className="px-4 py-2">Tổng tồn kho</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((p, index) => {
            const totalStock =
              p.variants?.reduce((sum: number, v: any) => sum + Number(v.stock_quantity || 0), 0) || 0;

            return (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{indexOfFirst + index + 1}</td>
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.categoryId?.name || "Chưa có"}</td>
                <td className="px-4 py-2">{p.brandId?.name || "Chưa có"}</td>
                <td className="px-4 py-2">{totalStock}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-1">
                    <Link to={`/admin/products/detail/${p._id}`}>
                      <button className="w-8 h-8 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center justify-center">
                        <Eye size={14} />
                      </button>
                    </Link>
                    <Link to={`/admin/products/edit/${p._id}`}>
                      <button className="w-8 h-8 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center">
                        <Edit size={14} />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="w-8 h-8 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {'<'}
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {'>'}
        </button>
      </div>
    </div>
  );
};

export default ProductManager;
