import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import axios from "axios";

const VariantManager = () => {
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const res = await axios.get("http://localhost:3000/variant");
        setVariants(res.data.data || []);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Lỗi khi tải biến thể:", error.message);
        } else {
          console.error("Lỗi không xác định:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa biến thể này?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/variant/${id}`);
      const updatedVariants = variants.filter((v) => v._id !== id);
      setVariants(updatedVariants);
      if ((currentPage - 1) * itemsPerPage >= updatedVariants.length && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Lỗi khi xóa biến thể:", error.message);
      } else {
        console.error("Lỗi không xác định:", error);
      }
    }
  };

  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = variants.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">Danh sách biến thể</h1>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border text-sm">
            <thead>
              <tr className="bg-black text-white text-left">
                <th className="px-4 py-2">STT</th>
                <th className="px-4 py-2">Tên sản phẩm</th>
                <th className="px-4 py-2">Dung tích</th>
                <th className="px-4 py-2">Hương vị</th>
                <th className="px-4 py-2">Giá</th>
                <th className="px-4 py-2">Số lượng</th>
                <th className="px-4 py-2">Ảnh</th>
                <th className="px-4 py-2">Ngày tạo</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((variant, index) => (
                  <tr key={variant._id} className="hover:bg-gray-50 text-left">
                    <td className="px-4 py-2">{indexOfFirstItem + index + 1}</td>
                    <td className="px-4 py-2">{variant.productId?.name || "Không rõ"}</td>
                    <td className="px-4 py-2">{variant.volume}ml</td>
                    <td className="px-4 py-2">{variant.flavors}</td>
                    <td className="px-4 py-2">{variant.price.toLocaleString()}đ</td>
                    <td className="px-4 py-2">{variant.stock_quantity}</td>
                    <td className="px-4 py-2">
                      <img src={variant.image} alt="variant" className="h-12 w-12 object-cover rounded" />
                    </td>
                    <td className="px-4 py-2">
                      {new Date(variant.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(variant._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs"
                      >
                        <Trash size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    Không có biến thể nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

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
      )}
    </div>
  );
};

export default VariantManager;