import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

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
  status: "activated" | "inactivated";
  usedCount: number;
  createdAt: string;
};

const DetailVoucher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState<Voucher | null>(null);

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/voucher/${id}`);
        setVoucher(res.data.data);
      } catch (error) {
        alert("Không tìm thấy voucher");
        navigate("/admin/vouchers");
      }
    };
    fetchVoucher();
  }, [id]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  if (!voucher)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg font-medium text-gray-600 animate-pulse">
          Đang tải dữ liệu...
        </div>
      </div>
    );

  const isExpired = new Date(voucher.endDate) < new Date();
  const isUsedUp =
    voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit;

  return (
    <div className=" bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 transition-all duration-300">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
          Chi tiết mã giảm giá
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Mã voucher
            </p>
            <p className="text-lg text-gray-900 font-medium">{voucher.code}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Trạng thái
            </p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                voucher.status === "activated"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {voucher.status === "activated" ? "Kích hoạt" : "Tạm dừng"}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Loại giảm giá
            </p>
            <p className="text-lg text-gray-900 font-medium">
              {voucher.discountType === "percent" ? "Phần trăm" : "Tiền mặt"}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Giá trị giảm
            </p>
            <p className="text-lg text-gray-900 font-medium">
              {voucher.discountType === "percent"
                ? `${voucher.discountValue}%`
                : `${voucher.discountValue.toLocaleString("vi-VN")}`}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Giảm tối đa
            </p>
            <p className="text-lg text-gray-900 font-medium">
              {voucher.maxDiscountValue
                ? `${voucher.maxDiscountValue.toLocaleString("vi-VN")}`
                : "Không giới hạn"}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Giá trị đơn hàng tối thiểu
            </p>
            <p className="text-lg text-gray-900 font-medium">
              {voucher.minOrderValue.toLocaleString("vi-VN")}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Hạn sử dụng
            </p>
            <p className="text-lg text-gray-900 font-medium">
              {formatDate(voucher.startDate)} - {formatDate(voucher.endDate)}
            </p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                isExpired
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {isExpired ? "Hết hạn" : "Còn hạn"}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Lượt dùng
            </p>
            <p className="text-lg text-gray-900 font-medium">
              {voucher.usedCount} /{" "}
              {voucher.usageLimit ? voucher.usageLimit : "∞"}
            </p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                isUsedUp
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {isUsedUp ? "Hết lượt" : "Còn lượt"}
            </span>
          </div>
        </div>

        {voucher.description && (
          <div className="border-t pt-6 mt-6 sm:mt-8">
            <p className="text-lg font-semibold text-gray-800 mb-3">Mô tả</p>
            <p className="text-base text-gray-600 leading-relaxed">
              {voucher.description}
            </p>
          </div>
        )}

        <div className="pt-6 mt-6 border-t flex justify-end">
          <button
            onClick={() => navigate("/admin/vouchers")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailVoucher;