import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash, Plus, Eye } from "lucide-react";
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


const VoucherManager = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchVouchers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/voucher");
      setVouchers(res.data.data);
      setSelectedIds([]);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách voucher:", error);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSoftDelete = async (id: string) => {
    const confirm = window.confirm("Bạn có chắc muốn xóa voucher này?");
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:3000/voucher/soft/${id}`);
      alert("Đã chuyển vào thùng rác");
      fetchVouchers();
    } catch (error) {
      const msg = (error as any)?.response?.data?.message || "Xóa thất bại";
      alert(msg);
    }
  };

  const handleSoftDeleteMany = async () => {
    if (selectedIds.length === 0) return;
    const confirm = window.confirm(`Xóa ${selectedIds.length} voucher đã chọn?`);
    if (!confirm) return;
    try {
      await axios.delete("http://localhost:3000/voucher/soft-delete-many", {
        data: { ids: selectedIds },
      });
      alert("Đã chuyển vào thùng rác");
      fetchVouchers();
    } catch (error) {
      alert("Xóa nhiều thất bại");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">Danh sách mã giảm giá</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSoftDeleteMany}
            disabled={selectedIds.length === 0}
            className={`px-3 h-8 rounded text-sm text-white transition ${selectedIds.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
              }`}
          >
            Xóa đã chọn ({selectedIds.length})
          </button>
          <Link to="/admin/vouchers/add">
            <button className="w-8 h-8 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center">
              <Plus size={14} />
            </button>
          </Link>
        </div>
      </div>

      <div className="flex gap-6 border-b my-4 text-base font-medium text-gray-500">
        <Link
          to="/admin/vouchers"
          className="pb-2 border-b-2 border-blue-500 text-blue-600"
        >
          Voucher đang hoạt động
        </Link>
        <Link
          to="/admin/vouchers/trash"
          className="pb-2 hover:text-blue-500 hover:border-b-2 hover:border-blue-300"
        >
          Thùng rác
        </Link>
      </div>

      <table className="min-w-full bg-white border text-sm text-center">
        <thead>
          <tr className="bg-black text-white">
            <th className="px-4 py-2 w-10 text-center"></th>
            <th className="px-4 py-2 text-center">STT</th>
            <th className="px-4 py-2 text-center">Mã</th>
            <th className="px-4 py-2 text-center">Loại</th>
            <th className="px-4 py-2 text-center">Giá trị</th>
            <th className="px-4 py-2 text-center">HSD</th>
            <th className="px-4 py-2 text-center">Lượt dùng</th>
            <th className="px-4 py-2 text-center">Trạng thái</th>
            <th className="px-4 py-2 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher, index) => (
            <tr key={voucher._id} className="hover:bg-gray-50 border-b">
              <td className="px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(voucher._id)}
                  onChange={() => handleSelect(voucher._id)}
                  className="w-5 h-5 accent-blue-600 mx-auto"
                />
              </td>
              <td className="px-4 py-2 text-center">{index + 1}</td>
              <td className="px-4 py-2 text-center">{voucher.code}</td>
              <td className="px-4 py-2 text-center">
                {voucher.discountType === "percent" ? "Phần trăm" : "Tiền mặt"}
              </td>
              <td className="px-4 py-2 text-center">
                {voucher.discountType === "percent"
                  ? `${voucher.discountValue}%`
                  : `${voucher.discountValue.toLocaleString()}`}
              </td>
              <td className="px-4 py-2 text-center">
                {new Date(voucher.startDate).toLocaleDateString()} -{" "}
                {new Date(voucher.endDate).toLocaleDateString()}
                <div>
                  <span className={`mt-1 inline-block text-xs font-medium rounded px-2 py-0.5 
              ${new Date(voucher.endDate) < new Date()
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"}`}>
                    {new Date(voucher.endDate) < new Date() ? "Hết hạn" : "Còn hạn"}
                  </span>
                </div>
              </td>
              <td className="px-4 py-2 text-center">
                {voucher.usageLimit !== null
                  ? `${voucher.usedCount} / ${voucher.usageLimit}`
                  : `${voucher.usedCount} / ∞`}
                <div>
                  <span className={`mt-1 inline-block text-xs font-medium rounded px-2 py-0.5 
              ${voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"}`}>
                    {voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit
                      ? "Hết lượt"
                      : "Còn lượt"}
                  </span>
                </div>
              </td>
              <td className="px-4 py-2 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold 
            ${voucher.status === "activated"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"}`}
                >
                  {voucher.status === "activated" ? "Kích hoạt" : "Tạm dừng"}
                </span>
              </td>
              <td className="px-4 py-2 text-center">
                <div className="flex gap-1 justify-center">
                  <Link to={`/admin/vouchers/${voucher._id}`}>
                    <button className="w-8 h-8 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center justify-center">
                      <Eye size={14} />
                    </button>
                  </Link>
                  <Link to={`/admin/vouchers/edit/${voucher._id}`}>
                    <button className="w-8 h-8 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center">
                      <Edit size={14} />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleSoftDelete(voucher._id)}
                    className="w-8 h-8 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center"
                  >
                    <Trash size={14} />
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

export default VoucherManager;