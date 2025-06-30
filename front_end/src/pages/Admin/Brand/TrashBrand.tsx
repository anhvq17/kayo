import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { RotateCw, Trash2 } from "lucide-react";

interface Brand {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const TrashBrand = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchTrashedBrands = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/brands/trash");
      setBrands(data.data);
      setSelectedIds([]);
    } catch (error) {
      alert("Lỗi khi tải danh sách thùng rác!");
    }
  };

  useEffect(() => {
    fetchTrashedBrands();
  }, []);

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRestore = async (id: string) => {
    try {
      await axios.patch(`http://localhost:3000/brands/restore/${id}`);
      alert("Khôi phục thành công");
      await fetchTrashedBrands();
    } catch (error) {
      alert("Lỗi khi khôi phục thương hiệu");
    }
  };

  const handleRestoreMany = async () => {
    if (selectedIds.length === 0) return;
    try {
      await axios.patch("http://localhost:3000/brands/restore-many", {
        ids: selectedIds,
      });
      alert("Khôi phục thành công");
      await fetchTrashedBrands();
    } catch (error) {
      alert("Lỗi khi khôi phục nhiều thương hiệu");
    }
  };

  const handleHardDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xoá vĩnh viễn thương hiệu này?")) return;
    try {
      await axios.delete(`http://localhost:3000/brands/hard/${id}`);
      alert("Đã xoá vĩnh viễn");
      await fetchTrashedBrands();
    } catch (error) {
      alert("Lỗi khi xoá vĩnh viễn thương hiệu");
    }
  };

  const handleHardDeleteMany = async () => {
    if (selectedIds.length === 0) return;
    const confirm = window.confirm("Bạn có chắc muốn xoá vĩnh viễn các thương hiệu?");
    if (!confirm) return;
    try {
      await axios.delete("http://localhost:3000/brands/hard-delete-many", {
        data: { ids: selectedIds },
      });
      alert("Đã xoá vĩnh viễn các thương hiệu");
      await fetchTrashedBrands();
    } catch (error) {
      alert("Xoá nhiều thất bại");
    }
  };

  return (
    <div className="p-4">
      {/* Tiêu đề và nút */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">Thương hiệu trong thùng rác</h1>
        <div className="flex gap-2">
          <button
            onClick={handleRestoreMany}
            disabled={selectedIds.length === 0}
            className={`px-3 h-8 rounded text-sm text-white transition 
              ${selectedIds.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"}`}
          >
            Khôi phục ({selectedIds.length})
          </button>
          <button
            onClick={handleHardDeleteMany}
            disabled={selectedIds.length === 0}
            className={`px-3 h-8 rounded text-sm text-white transition 
              ${selectedIds.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"}`}
          >
            Xoá vĩnh viễn ({selectedIds.length})
          </button>
        </div>
      </div>

      {/* Điều hướng */}
      <div className="flex gap-6 border-b my-4 text-base font-medium text-gray-500">
        <Link
          to="/admin/brands"
          className="pb-2 hover:text-blue-500 hover:border-b-2 hover:border-blue-300"
        >
          Thương hiệu đang hoạt động
        </Link>
        <Link
          to="/admin/brands/trash"
          className="pb-2 border-b-2 border-blue-500 text-blue-600"
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
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {brands.length > 0 ? (
            brands.map((brand, index) => (
              <tr key={brand._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(brand._id)}
                    onChange={() => handleSelect(brand._id)}
                    className="w-5 h-5 accent-blue-600"
                  />
                </td>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{brand.name}</td>
                <td className="px-4 py-2">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="h-10 w-10 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleRestore(brand._id)}
                      className="w-8 h-8 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center"
                    >
                      <RotateCw size={14} />
                    </button>
                    <button
                      onClick={() => handleHardDelete(brand._id)}
                      className="w-8 h-8 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">
                Không có thương hiệu nào trong thùng rác.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TrashBrand;
