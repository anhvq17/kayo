// pages/MyVoucher.tsx
import { useEffect, useState } from "react";
import axios from "axios";

const MyVoucher = () => {
  const [savedVouchers, setSavedVouchers] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;

  const fetchSavedVouchers = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/voucher-user/saved/${userId}`
      );
      setSavedVouchers(res.data); // [{...voucher}]
    } catch (err) {
      console.error("Lỗi khi lấy mã đã lưu", err);
    }
  };

  useEffect(() => {
    fetchSavedVouchers();
  }, []);

  const isExpired = (endDate: string) => new Date(endDate) < new Date();

  const filterVouchers = () => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    return savedVouchers.filter((voucher: any) => {
      if (filterType !== "all" && voucher.discountType !== filterType) {
        return false;
      }

      const end = new Date(voucher.endDate);

      if (filterStatus === "valid") return end >= now;
      if (filterStatus === "expiringSoon") return end > now && end <= tomorrow;
      if (filterStatus === "expired") return end < now;

      return true;
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div className="min-h-screen">
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-11 pb-2">
        <div className="flex flex-wrap justify-center gap-4">
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none px-4 py-1 pr-10 rounded-lg border border-[#ccc] bg-white text-gray-700 shadow-sm"
            >
              <option value="all">Loại mã</option>
              <option value="percent">Giảm phần trăm</option>
              <option value="fixed">Giảm tiền mặt</option>
              <option value="freeship">Freeship</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none px-4 py-1 pr-10 rounded-lg border border-[#ccc] bg-white text-gray-700 shadow-sm"
            >
              <option value="all">Trạng thái</option>
              <option value="valid">Còn hiệu lực</option>
              <option value="expiringSoon">Sắp hết hạn</option>
              <option value="expired">Hết hạn</option>
            </select>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filterVouchers().map((voucher: any) => {
          const percentUsed = Math.min(
            (voucher.usedCount / voucher.usageLimit) * 100,
            100
          );
          const expired = isExpired(voucher.endDate);

          return (
            <div
              key={voucher._id}
              className={`rounded-lg shadow-md p-6 border-2 border-dashed transition ${expired
                ? "bg-gray-200 border-[#aaa] opacity-70"
                : "bg-white border-[#696faa]"
                }`}
            >
              <h3 className="text-xl font-semibold">
                {voucher.discountType === "percent"
                  ? `Giảm ${voucher.discountValue}%`
                  : voucher.discountType === "fixed"
                    ? `Giảm ${voucher.discountValue.toLocaleString("vi-VN")}`
                    : "Freeship toàn quốc"}
              </h3>

              <p className="text-gray-700 mt-1">Mã: <strong>{voucher.code}</strong></p>
              <p className="text-gray-700 mt-1">Hết hạn: {formatDate(voucher.endDate)}</p>
              <p className="text-gray-700 mt-1">Lượt dùng: {voucher.usedCount}1 / 1{voucher.usageLimit}</p>

              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                <div
                  className="bg-[#696faa] h-2.5 rounded-full"
                  style={{ width: `${percentUsed}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default MyVoucher;
