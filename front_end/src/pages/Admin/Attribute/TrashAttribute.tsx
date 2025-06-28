import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { RotateCcw, Trash2 } from "lucide-react";

type Attribute = {
  _id: string;
  name: string;
  attributeCode: string;
  description: string;
};

const TrashAttribute = () => {
  const [trashedAttributes, setTrashedAttributes] = useState<Attribute[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchTrashedAttributes();
  }, []);

  const fetchTrashedAttributes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/attribute/trash");
      setTrashedAttributes(res.data.data);
      setSelectedIds([]);
    } catch (error) {
      alert("Lỗi khi lấy dữ liệu thùng rác");
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRestore = async (id: string) => {
    try {
      await axios.patch(`http://localhost:3000/attribute/restore/${id}`);
      fetchTrashedAttributes();
    } catch (error) {
      alert("Khôi phục thất bại");
    }
  };

  const handleHardDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn thuộc tính này?")) return;
    try {
      await axios.delete(`http://localhost:3000/attribute/hard/${id}`);
      fetchTrashedAttributes();
    } catch (error) {
      alert("Xóa thất bại");
    }
  };

  const handleRestoreMany = async () => {
    if (selectedIds.length === 0) return;
    try {
      await axios.patch("http://localhost:3000/attribute/restore-many", {
        ids: selectedIds,
      });
      alert("Khôi phục các thuộc tính thành công")
      fetchTrashedAttributes();
    } catch (error) {
      alert("Khôi phục nhiều thất bại");
    }
  };

  const handleHardDeleteMany = async () => {
    if (selectedIds.length === 0) return;
    const confirm = window.confirm("Xóa vĩnh viễn các thuộc tính đã chọn?");
    if (!confirm) return;
    try {
      await axios.delete("http://localhost:3000/attribute/hard-delete-many", {
        data: { ids: selectedIds },
      });
      alert("Xóa vĩnh viễn tất cả thành công")
      fetchTrashedAttributes();
    } catch (error) {
      alert("Xóa nhiều thất bại");
    }
  };

  return (
    <div className="p-1">
      {/* Tiêu đề */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">Thùng rác thuộc tính</h1>
        <div className="flex gap-2">
          <button
            onClick={handleRestoreMany}
            disabled={selectedIds.length === 0}
            className={`px-3 h-8 rounded text-sm text-white transition ${selectedIds.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            Khôi phục đã chọn ({selectedIds.length})
          </button>
          <button
            onClick={handleHardDeleteMany}
            disabled={selectedIds.length === 0}
            className={`px-3 h-8 rounded text-sm text-white transition ${selectedIds.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
              }`}
          >
            Xóa vĩnh viễn đã chọn ({selectedIds.length})
          </button>
        </div>
      </div>

      {/* Menu tab */}
      <div className="flex gap-6 border-b my-4 text-base font-medium text-gray-500">
        <Link
          to="/admin/attributes"
          className="pb-2 hover:text-blue-500 hover:border-b-2 hover:border-blue-300"
        >
          Thuộc tính đang hoạt động
        </Link>
        <Link
          to="/admin/attributes/trash"
          className="pb-2 border-b-2 border-blue-500 text-blue-600"
        >
          Thùng rác
        </Link>
      </div>

      {/* Bảng danh sách */}
      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="px-4 py-2 w-5 h-5"></th>
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Tên thuộc tính</th>
            <th className="px-4 py-2">Mã thuộc tính</th>
            <th className="px-4 py-2">Mô tả</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {trashedAttributes.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Không có thuộc tính nào trong thùng rác
              </td>
            </tr>
          ) : (
            trashedAttributes.map((attr, index) => (
              <tr key={attr._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(attr._id)}
                    onChange={() => handleSelect(attr._id)}
                    className="w-5 h-5 accent-blue-600"
                  />
                </td>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{attr.name}</td>
                <td className="px-4 py-2">{attr.attributeCode}</td>
                <td className="px-4 py-2">{attr.description}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleRestore(attr._id)}
                      className="w-8 h-8 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
                    >
                      <RotateCcw size={14} />
                    </button>
                    <button
                      onClick={() => handleHardDelete(attr._id)}
                      className="w-8 h-8 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TrashAttribute;
