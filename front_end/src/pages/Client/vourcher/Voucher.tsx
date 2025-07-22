import { useEffect, useState } from "react";
import axios from "axios";

type Voucher = {
  _id: string;
  code: string;
  description?: string;
  discountType: "percent" | "fixed" | "freeship";
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue?: number | null;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
};

const Voucher = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/voucher");
        setVouchers(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy mã giảm giá", error);
      }
    };
    fetchVouchers();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const isExpired = (endDate: string) => new Date(endDate) < new Date();

  return (
    <div className="bg-gray-100 font-sans min-h-screen">
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Tìm mã theo từ khóa..."
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#696faa]"
            />
          </div>

          <div className="flex gap-4 flex-wrap">
            <select className="p-3 rounded-lg border border-gray-300">
              <option>Loại mã</option>
              <option>Giảm phần trăm</option>
              <option>Giảm tiền mặt</option>
            </select>
            <select className="p-3 rounded-lg border border-gray-300">
              <option>Thời gian hết hạn</option>
              <option>Còn hiệu lực</option>
              <option>Hết hạn</option>
            </select>
            <select className="p-3 rounded-lg border border-gray-300">
              <option>Danh mục sản phẩm</option>
              <option>Nam</option>
              <option>Nữ</option>
            </select>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vouchers.map((voucher) => {
          const expired = isExpired(voucher.endDate);
          return (
            <div
              key={voucher._id}
              className={`rounded-lg shadow-md p-6 border-2 border-dashed ${
                expired ? "bg-gray-200 border-[#aaa] opacity-70" : "bg-white border-[#696faa] hover:shadow-lg"
              } transition`}
            >
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
                    ? `Giảm ${voucher.discountValue}%`
                    : voucher.discountType === "fixed"
                    ? `Giảm ${voucher.discountValue.toLocaleString("vi-VN")}`
                    : `Freeship toàn quốc`}
                </h3>
              </div>

              <p className="text-gray-700 mt-1">
                Mã:{" "}
                <span className="font-bold text-[#696faa]">{voucher.code}</span>
              </p>

              {voucher.maxDiscountValue && voucher.discountType === "percent" && (
                <p className="text-gray-700 mt-1">
                  Giảm tối đa: {voucher.maxDiscountValue.toLocaleString("vi-VN")}
                </p>
              )}

              <p className="text-gray-700 mt-1">
                Đơn tối thiểu: {voucher.minOrderValue.toLocaleString("vi-VN")}
              </p>

              <p className="text-gray-500 text-sm mt-1">
                Hết hạn: {formatDate(voucher.endDate)}
              </p>

              <p className="text-gray-500 text-sm mt-1">
                Trạng thái: {expired ? "Hết hạn" : "Còn hạn"}
              </p>

              <div className="mt-4">
                <button
                  disabled={expired}
                  className={`px-4 py-2 rounded-lg text-white ${
                    expired
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#696faa] hover:bg-[#4f5580]"
                  }`}
                >
                  {expired ? "Đã hết mã" : "Lưu mã"}
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Voucher;