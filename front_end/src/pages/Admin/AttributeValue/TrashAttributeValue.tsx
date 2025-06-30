import React, { useEffect, useState } from "react";
import axios from "axios";
import { RotateCcw, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

type AttributeValue = {
  _id: string;
  value: string;
  valueCode: string;
  attributeId: {
    _id: string;
    name: string;
  };
};

const TrashAttributeValue = () => {
  const [trashedValues, setTrashedValues] = useState<AttributeValue[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchTrashedValues();
  }, []);

  const fetchTrashedValues = async () => {
    try {
      const res = await axios.get("http://localhost:3000/attribute-value/trash");
      setTrashedValues(res.data.data);
      setSelectedIds([]);
    } catch (error) {
      alert("Lỗi khi lấy dữ liệu thùng rác");
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleRestore = async (id: string) => {
    try {
      await axios.patch(`http://localhost:3000/attribute-value/restore/${id}`);
      alert("Khôi phục thành công");
      fetchTrashedValues();
    } catch (error) {
      alert("Khôi phục thất bại");
    }
  };

  const handleHardDelete = async (id: string) => {
    if (!window.confirm("Xóa vĩnh viễn giá trị này?")) return;
    try {
      await axios.delete(`http://localhost:3000/attribute-value/hard/${id}`);
      alert("Đã xóa vĩnh viễn");
      fetchTrashedValues();
    } catch (error) {
      alert("Xóa thất bại");
    }
  };

  const handleRestoreMany = async () => {
    try {
      await axios.patch("http://localhost:3000/attribute-value/restore-many", {
        ids: selectedIds,
      });
      alert("Đã khôi phục các mục đã chọn");
      fetchTrashedValues();
    } catch (error) {
      alert("Khôi phục nhiều thất bại");
    }
  };

  const handleHardDeleteMany = async () => {
    if (!window.confirm(`Xóa vĩnh viễn ${selectedIds.length} giá trị đã chọn?`)) return;
    try {
      await axios.delete("http://localhost:3000/attribute-value/hard-delete-many", {
        data: { ids: selectedIds },
      });
      alert("Đã xóa vĩnh viễn");
      fetchTrashedValues();
    } catch (error) {
      alert("Xóa nhiều thất bại");
    }
  };

  return (
    <div className="p-1">
      {/* Tiêu đề */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">Thùng rác giá trị thuộc tính</h1>
        <div className="flex gap-2">
          <button
            onClick={handleRestoreMany}
            disabled={selectedIds.length === 0}
            className={`px-3 h-8 rounded text-sm text-white ${
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
            className={`px-3 h-8 rounded text-sm text-white ${
              selectedIds.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Xóa vĩnh viễn ({selectedIds.length})
          </button>
        </div>
      </div>

      {/* Menu tab */}
      <div className="flex gap-6 border-b my-4 text-base font-medium text-gray-500">
        <Link
          to="/admin/attribute-values"
          className="pb-2 hover:text-blue-500 hover:border-b-2 hover:border-blue-300"
        >
          Giá trị đang hoạt động
        </Link>
        <Link
          to="/admin/attribute-values/trash"
          className="pb-2 border-b-2 border-blue-500 text-blue-600"
        >
          Thùng rác
        </Link>
      </div>

      {/* Bảng */}
      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="px-4 py-2 w-10"></th>
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Giá trị</th>
            <th className="px-4 py-2">Mã giá trị</th>
            <th className="px-4 py-2">Tên thuộc tính</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {trashedValues.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Không có giá trị nào trong thùng rác
              </td>
            </tr>
          ) : (
            trashedValues.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-50 border-b">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item._id)}
                    onChange={() => handleSelect(item._id)}
                    className="w-5 h-5 accent-blue-600"
                  />
                </td>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{item.value}</td>
                <td className="px-4 py-2">{item.valueCode}</td>
                <td className="px-4 py-2">{item.attributeId?.name || "Không xác định"}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleRestore(item._id)}
                      className="w-8 h-8 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
                    >
                      <RotateCcw size={14} />
                    </button>
                    <button
                      onClick={() => handleHardDelete(item._id)}
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

export default TrashAttributeValue;
