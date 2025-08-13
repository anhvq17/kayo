import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
      console.log("Dữ liệu mã đã lưu:", res.data); // 👈 THÊM DÒNG NÀY
      setSavedVouchers(res.data);
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
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex items-center text-sm mb-5">
        <Link to="/" className="text-gray-500 hover:text-gray-900">Trang chủ</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-black">Mã của tôi</span>
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-2">
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
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
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
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filterVouchers().map((voucher: any) => {
          const expired = isExpired(voucher.endDate);
          const discountValue = Number(voucher.discountValue) || 0;
          const maxDiscountValue = voucher.maxDiscountValue != null ? Number(voucher.maxDiscountValue) : null;
          const minOrderValue = Number(voucher.minOrderValue) || 0;

          return (
            <div
              key={voucher._id}
              className={`h-full flex flex-col justify-between rounded-lg shadow-md p-6 border-2 border-dashed transition ${expired ? "bg-gray-200 border-[#aaa] opacity-70" : "bg-white border-[#696faa]"
                }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <svg
                    className={`w-6 h-6 ${expired ? "text-gray-500" : "text-[#696faa]"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold">
                    {voucher.discountType === "percent"
                      ? `Giảm ${discountValue}%`
                      : voucher.discountType === "fixed"
                        ? `Giảm ${discountValue.toLocaleString("vi-VN")}`
                        : "Freeship toàn quốc"}
                  </h3>
                </div>

                <p className="text-gray-700 mt-1">
                  Mã: <span className="font-bold text-[#696faa]">{voucher.code}</span>
                </p>

                {voucher.discountType === "percent" && maxDiscountValue !== null && (
                  <p className="text-gray-700 mt-1">
                    Giảm tối đa: {maxDiscountValue.toLocaleString("vi-VN")}
                  </p>
                )}

                <p className="text-gray-700 mt-1">
                  Đơn tối thiểu: {minOrderValue.toLocaleString("vi-VN")}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Hết hạn: {formatDate(voucher.endDate)}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Trạng thái: {expired ? "Hết hạn" : "Còn hạn"}
                </p>
              </div>
            </div>
          );
        })}

      </section>
    </div>
  );
};

export default MyVoucher;