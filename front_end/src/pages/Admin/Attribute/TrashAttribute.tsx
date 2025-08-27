import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { RotateCcw, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

type Attribute = {
  _id: string;
  name: string;
  attributeCode: string;
  description: string;
};

// Custom confirm toast function with polished UI
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
      duration: 0, // Keep toast open until user interacts
      position: "top-center",
      style: { background: "transparent", padding: 0, border: "none" },
    });
  });
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
    } catch (error: unknown) {
      toast.error("Lỗi khi lấy dữ liệu thùng rác", { duration: 2000 });
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRestore = async (id: string) => {
    const confirmed = await confirmToast("Bạn có chắc chắn muốn khôi phục thuộc tính này?");
    if (!confirmed) return;
    try {
      await axios.patch(`http://localhost:3000/attribute/restore/${id}`);
      toast.success("Khôi phục thuộc tính thành công", { duration: 2000 });
      fetchTrashedAttributes();
    } catch (error: unknown) {
      toast.error("Khôi phục thất bại", { duration: 2000 });
    }
  };

  const handleHardDelete = async (id: string) => {
    const confirmed = await confirmToast("Bạn có chắc chắn muốn xóa vĩnh viễn thuộc tính này?");
    if (!confirmed) return;
    try {
      await axios.delete(`http://localhost:3000/attribute/hard/${id}`);
      toast.success("Xóa vĩnh viễn thuộc tính thành công", { duration: 2000 });
      fetchTrashedAttributes();
    } catch (error: unknown) {
      toast.error("Xóa vĩnh viễn thất bại", { duration: 2000 });
    }
  };

  const handleRestoreMany = async () => {
    if (selectedIds.length === 0) return;
    const confirmed = await confirmToast("Bạn có chắc chắn muốn khôi phục các thuộc tính đã chọn?");
    if (!confirmed) return;
    try {
      await axios.patch("http://localhost:3000/attribute/restore-many", {
        ids: selectedIds,
      });
      toast.success("Khôi phục các thuộc tính thành công", { duration: 2000 });
      fetchTrashedAttributes();
    } catch (error: unknown) {
      toast.error("Khôi phục nhiều thất bại", { duration: 2000 });
    }
  };

  const handleHardDeleteMany = async () => {
    if (selectedIds.length === 0) return;
    const confirmed = await confirmToast("Xóa vĩnh viễn các thuộc tính đã chọn?");
    if (!confirmed) return;
    try {
      await axios.delete("http://localhost:3000/attribute/hard-delete-many", {
        data: { ids: selectedIds },
      });
      toast.success("Xóa vĩnh viễn các thuộc tính thành công", { duration: 2000 });
      fetchTrashedAttributes();
    } catch (error: unknown) {
      toast.error("Xóa vĩnh viễn nhiều thất bại", { duration: 2000 });
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
            className={`px-3 h-8 rounded text-sm text-white transition ${
              selectedIds.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Khôi phục đã chọn ({selectedIds.length})
          </button>
          <button
            onClick={handleHardDeleteMany}
            disabled={selectedIds.length === 0}
            className={`px-3 h-8 rounded text-sm text-white transition ${
              selectedIds.length === 0
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