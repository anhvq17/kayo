import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Voucher = {
  _id: string;
  code: string;
  description?: string;
  discountType: "percent" | "fixed";
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
  const [savingCode, setSavingCode] = useState<string | null>(null);
  const [savedCodes, setSavedCodes] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;

  const fetchVouchers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/voucher/public"); // sửa dòng này
      setVouchers(res.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy mã giảm giá", error);
    }
  };

  const fetchSavedCodes = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/voucher-user/saved/${userId}`
      );
      const saved = res.data.map((item: any) => item.code);
      setSavedCodes(saved);
    } catch (error) {
      console.error("Lỗi khi lấy mã đã lưu", error);
    }
  };

  useEffect(() => {
    fetchVouchers();
    fetchSavedCodes();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const isExpired = (endDate: string) => new Date(endDate) < new Date();

  const handleSaveVoucher = async (code: string) => {
    if (!userId) {
      alert("Bạn cần đăng nhập để lưu mã.");
      return;
    }

    try {
      setSavingCode(code);

      await axios.post("http://localhost:3000/voucher-user/save", {
        userId,
        voucherCode: code,
      });

      alert("Lưu mã thành công!");

      setSavedCodes((prev) => [...prev, code]);

      setVouchers((prev) =>
        prev.map((v) =>
          v.code === code ? { ...v, usedCount: v.usedCount + 1 } : v
        )
      );

    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
        "Không thể lưu mã. Có thể bạn đã lưu rồi."
      );
    } finally {
      setSavingCode(null);
    }
  };
  const filterVouchers = (voucherList: Voucher[]) => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    return voucherList.filter((voucher) => {
      if (filterType !== "all" && voucher.discountType !== filterType) {
        return false;
      }

      const endDate = new Date(voucher.endDate);

      if (filterStatus === "valid") {
        return endDate >= now;
      }
      if (filterStatus === "expiringSoon") {
        return endDate > now && endDate <= tomorrow;
      }
      if (filterStatus === "expired") {
        return endDate < now;
      }

      return true;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex items-center text-sm mb-5">
        <Link to="/" className="text-gray-500 hover:text-gray-900">Trang chủ</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-black">Mã giảm giá</span>
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-2">
        <div className="flex flex-wrap justify-center gap-4">
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none px-4 py-1 pr-10 rounded-lg border border-[#ccc] bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#696faa] transition"
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
              className="appearance-none px-4 py-1 pr-10 rounded-lg border border-[#ccc] bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#696faa] transition"
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
        {filterVouchers(vouchers).map((voucher) => {
          const expired = isExpired(voucher.endDate);
          const fullyUsed = voucher.usedCount >= voucher.usageLimit;
          const percentUsed = Math.min(
            (voucher.usedCount / voucher.usageLimit) * 100,
            100
          );
          const isSaved = savedCodes.includes(voucher.code);
          const disabled =
            expired || fullyUsed || savingCode === voucher.code || isSaved;

          return (
            <div
              key={voucher._id}
              className={`h-full flex flex-col justify-between rounded-lg shadow-md p-6 border-2 border-dashed transition ${disabled
                ? "bg-gray-200 border-[#aaa] opacity-70"
                : "bg-white border-[#696faa] hover:shadow-lg"
                }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <svg
                    className={`w-6 h-6 ${disabled ? "text-gray-500" : "text-[#696faa]"
                      }`}
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
                  <span className="font-bold text-[#696faa]">
                    {voucher.code}
                  </span>
                </p>

                {voucher.maxDiscountValue &&
                  voucher.discountType === "percent" && (
                    <p className="text-gray-700 mt-1">
                      Giảm tối đa:{" "}
                      {voucher.maxDiscountValue.toLocaleString("vi-VN")}
                    </p>
                  )}

                <p className="text-gray-700 mt-1">
                  Đơn tối thiểu:{" "}
                  {voucher.minOrderValue.toLocaleString("vi-VN")}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Hết hạn: {formatDate(voucher.endDate)}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Trạng thái: {expired ? "Hết hạn" : "Còn hạn"}
                </p>
              </div>

              <div className="mt-auto flex flex-col gap-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mt-7 mb-1">
                    <span>Lượt dùng</span>
                    <span>
                      {voucher.usedCount} / {voucher.usageLimit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#696faa] h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${percentUsed}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  disabled={disabled}
                  onClick={() => handleSaveVoucher(voucher.code)}
                  className={`px-4 py-2 rounded-lg text-white w-full ${disabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#696faa] hover:bg-[#4f5580]"
                    }`}
                >
                  {expired || fullyUsed
                    ? "Đã hết mã"
                    : isSaved
                      ? "Đã lưu"
                      : savingCode === voucher.code
                        ? "Đang lưu..."
                        : "Lưu mã"}
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