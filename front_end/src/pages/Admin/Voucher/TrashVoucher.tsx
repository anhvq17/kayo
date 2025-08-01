import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RotateCw, Trash2 } from "lucide-react";
import axios from "axios";

type Voucher = {
  _id: string;
  code: string;
  discountType: "percent" | "amount";
  discountValue: number;
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  usedCount: number;
  status: "activated" | "inactivated";
};

const TrashVoucher = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchTrash = async () => {
    try {
      const res = await axios.get("http://localhost:3000/voucher/trash");
      setVouchers(res.data.data);
      setSelectedIds([]);
    } catch (error) {
      console.error("Lỗi khi lấy thùng rác voucher:", error);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRestore = async (id: string) => {
    try {
      await axios.patch(`http://localhost:3000/voucher/restore/${id}`);
      alert("Khôi phục thành công");
      fetchTrash();
    } catch (error) {
      alert("Khôi phục thất bại");
    }
  };

  const handleHardDelete = async (id: string) => {
    const confirm = window.confirm("Xóa vĩnh viễn voucher này?");
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:3000/voucher/hard/${id}`);
      alert("Đã xóa vĩnh viễn");
      fetchTrash();
    } catch (error) {
      alert("Xóa thất bại");
    }
  };

  const handleRestoreMany = async () => {
    if (selectedIds.length === 0) return;
    const confirm = window.confirm("Khôi phục các voucher đã chọn?");
    if (!confirm) return;
    try {
      await axios.patch("http://localhost:3000/voucher/restore-many", {
        ids: selectedIds,
      });
      alert("Khôi phục thành công");
      fetchTrash();
    } catch (error) {
      alert("Khôi phục thất bại");
    }
  };

  const handleHardDeleteMany = async () => {
    if (selectedIds.length === 0) return;
    const confirm = window.confirm("Xóa vĩnh viễn các voucher đã chọn?");
    if (!confirm) return;
    try {
      await axios.delete("http://localhost:3000/voucher/hard-delete-many", {
        data: { ids: selectedIds },
      });
      alert("Đã xóa vĩnh viễn");
      fetchTrash();
    } catch (error) {
      alert("Xóa thất bại");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">Thùng rác mã giảm giá</h1>
        <div className="flex gap-2">
          <button
            onClick={handleRestoreMany}
            disabled={selectedIds.length === 0}
            className={`px-3 h-8 rounded text-sm text-white transition ${selectedIds.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
              }`}
          >
            Khôi phục ({selectedIds.length})
          </button>
          <button
            onClick={handleHardDeleteMany}
            disabled={selectedIds.length === 0}
            className={`px-3 h-8 rounded text-sm text-white transition ${selectedIds.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
              }`}
          >
            Xóa vĩnh viễn ({selectedIds.length})
          </button>
        </div>
      </div>

      <div className="flex gap-6 border-b my-4 text-base font-medium text-gray-500">
        <Link
          to="/admin/vouchers"
          className="pb-2 hover:text-blue-500 hover:border-b-2 hover:border-blue-300"
        >
          Voucher đang hoạt động
        </Link>
        <Link
          to="/admin/vouchers/trash"
          className="pb-2 border-b-2 border-blue-500 text-blue-600"
        >
          Thùng rác
        </Link>
      </div>

      <table className="min-w-full bg-white border text-sm text-center">
        <thead>
          <tr className="bg-black text-white">
            <th className="px-4 py-2 w-10 text-center"></th>
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Mã</th>
            <th className="px-4 py-2">Loại</th>
            <th className="px-4 py-2">Giá trị</th>
            <th className="px-4 py-2">HSD</th>
            <th className="px-4 py-2">Lượt dùng</th>
            <th className="px-4 py-2">Trạng thái</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher, index) => (
            <tr key={voucher._id} className="hover:bg-gray-50 border-b">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(voucher._id)}
                  onChange={() => handleSelect(voucher._id)}
                  className="w-5 h-5 accent-blue-600 mx-auto"
                />
              </td>
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{voucher.code}</td>
              <td className="px-4 py-2">
                {voucher.discountType === "percent" ? "Phần trăm" : "Tiền mặt"}
              </td>
              <td className="px-4 py-2">
                {voucher.discountType === "percent"
                  ? `${voucher.discountValue}%`
                  : `${voucher.discountValue.toLocaleString()}₫`}
              </td>
              <td className="px-4 py-2">
                {new Date(voucher.startDate).toLocaleDateString("vi-VN")} -{" "}
                {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
                <div>
                  <span className={`mt-1 inline-block text-xs font-medium rounded px-2 py-0.5 
                    ${new Date(voucher.endDate) < new Date()
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"}`}>
                    {new Date(voucher.endDate) < new Date() ? "Hết hạn" : "Còn hạn"}
                  </span>
                </div>
              </td>
              <td className="px-4 py-2">
                {voucher.usageLimit !== null
                  ? `${voucher.usedCount} / ${voucher.usageLimit}`
                  : `${voucher.usedCount} / ∞`}
              </td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                  ${voucher.status === "activated"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"}`}>
                  {voucher.status === "activated" ? "Kích hoạt" : "Tạm dừng"}
                </span>
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-1 justify-center">
                  <button
                    onClick={() => handleRestore(voucher._id)}
                    className="w-8 h-8 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center"
                  >
                    <RotateCw size={14} />
                  </button>
                  <button
                    onClick={() => handleHardDelete(voucher._id)}
                    className="w-8 h-8 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrashVoucher;
