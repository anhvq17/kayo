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

      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="px-4 py-2 w-10"></th>
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Mã</th>
            <th className="px-4 py-2">Loại</th>
            <th className="px-4 py-2">Giá trị</th>
            <th className="px-4 py-2">HSD</th>
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
                  className="w-5 h-5 accent-blue-600"
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
                  : `${voucher.discountValue.toLocaleString()}`}
              </td>
              <td className="px-4 py-2">
                {new Date(voucher.startDate).toLocaleDateString()} -{" "}
                {new Date(voucher.endDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold 
                  ${voucher.status === "activated"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"}`}
                >
                  {voucher.status === "activated" ? "Kích hoạt" : "Tạm dừng"}
                </span>
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-1">
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