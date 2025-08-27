import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash, Plus, AlertTriangle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Brand {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  productCount?: number;
}

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

const BrandManager = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getBrandList = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/brands");
      setBrands(data.data);
      setSelectedIds([]);
    } catch (error: unknown) {
      console.error("Lỗi khi lấy danh sách thương hiệu:", error);
      toast.error("Lỗi khi lấy danh sách thương hiệu", { duration: 2000 });
    }
  };

  useEffect(() => {
    getBrandList();
  }, []);

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSoftDelete = async (id: string) => {
    const brand = brands.find((b) => b._id === id);
    if (!brand) return;

    if ((brand.productCount ?? 0) > 0) {
      toast.error(`Không thể xoá thương hiệu ${brand.name} vì còn sản phẩm`, { duration: 2000 });
      return;
    }

    const confirmed = await confirmToast("Bạn có chắc muốn xoá thương hiệu này?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3000/brands/soft/${id}`);
      toast.success("Đã chuyển thương hiệu vào thùng rác", { duration: 2000 });
      getBrandList();
    } catch (error: unknown) {
      const msg =
        error instanceof Error && "response" in error
          ? (error as any).response?.data?.message || "Xoá thất bại"
          : "Xoá thất bại";
      toast.error(msg, { duration: 2000 });
    }
  };

  const handleSoftDeleteMany = async () => {
    if (selectedIds.length === 0) return;

    const nonDeletableBrands = brands.filter(
      (b) => selectedIds.includes(b._id) && (b.productCount ?? 0) > 0
    );

    if (nonDeletableBrands.length > 0) {
      const names = nonDeletableBrands.map((b) => `- ${b.name}`).join("\n");
      toast.error(`Không thể xoá các thương hiệu đang có sản phẩm:\n${names}`, { duration: 4000 });
      return;
    }

    const confirmed = await confirmToast("Bạn có chắc muốn xoá các thương hiệu đã chọn?");
    if (!confirmed) return;

    try {
      await axios.delete("http://localhost:3000/brands/soft-delete-many", {
        data: { ids: selectedIds },
      });
      toast.success("Đã chuyển các thương hiệu vào thùng rác", { duration: 2000 });
      getBrandList();
    } catch (error: unknown) {
      const msg =
        error instanceof Error && "response" in error
          ? (error as any).response?.data?.message || "Xoá nhiều thất bại"
          : "Xoá nhiều thất bại";
      toast.error(msg, { duration: 2000 });
    }
  };

  const totalPages = Math.ceil(brands.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = brands.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-4">
      {/* Tiêu đề + nút hành động */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">Danh sách thương hiệu</h1>
        <div className="flex gap-2">
          <button
            onClick={handleSoftDeleteMany}
            disabled={selectedIds.length === 0}
            className={`px-3 h-8 rounded text-sm text-white transition 
              ${selectedIds.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"}`}
          >
            Xóa đã chọn ({selectedIds.length})
          </button>
          <Link to="/admin/brands/add">
            <button className="w-8 h-8 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center">
              <Plus size={14} />
            </button>
          </Link>
        </div>
      </div>

      {/* Menu điều hướng */}
      <div className="flex gap-6 border-b my-4 text-base font-medium text-gray-500">
        <Link
          to="/admin/brands"
          className="pb-2 border-b-2 border-blue-500 text-blue-600"
        >
          Thương hiệu đang hoạt động
        </Link>
        <Link
          to="/admin/brands/trash"
          className="pb-2 hover:text-blue-500 hover:border-b-2 hover:border-blue-300"
        >
          Thùng rác
        </Link>
      </div>

      {/* Bảng thương hiệu */}
      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Tên</th>
            <th className="px-4 py-2">Hình ảnh</th>
            <th className="px-4 py-2 text-center">Số sản phẩm</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((brand, index) => (
              <tr key={brand._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(brand._id)}
                    onChange={() => handleSelect(brand._id)}
                    className="w-5 h-5 accent-blue-600"
                  />
                </td>
                <td className="px-4 py-2">{indexOfFirstItem + index + 1}</td>
                <td className="px-4 py-2">{brand.name}</td>
                <td className="px-4 py-2">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="h-10 w-10 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2 text-center">{brand.productCount ?? 0}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-1">
                    <Link to={`/admin/brands/edit/${brand._id}`}>
                      <button className="w-8 h-8 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center">
                        <Edit size={14} />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleSoftDelete(brand._id)}
                      className="w-8 h-8 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Không có thương hiệu nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
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
          &gt;
        </button>
      </div>
    </div>
  );
};

export default BrandManager;