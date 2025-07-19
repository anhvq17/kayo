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

    if (!voucher) return <div className="p-6 text-center text-gray-500">Đang tải dữ liệu...</div>;

    return (
        <div className=" bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8 max-h-[90vh] overflow-y-auto transition-all duration-300 hover:shadow-xl">
                <h2 className="text-3xl font-bold text-black mb-6 text-center">Chi tiết mã giảm giá</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                    <div className="space-y-2">
                        <p className="text-lg font-semibold text-black">Mã voucher:</p>
                        <p className="text-[16px] text-gray-500 font-medium">{voucher.code}</p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-lg font-semibold text-black">Trạng thái:</p>
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${voucher.status === "activated"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                                }`}
                        >
                            {voucher.status === "activated" ? "Kích hoạt" : "Tạm dừng"}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <p className="text-lg font-semibold text-black">Loại giảm giá:</p>
                        <p className="text-[16px] text-gray-500 font-medium">
                            {voucher.discountType === "percent" ? "Phần trăm" : "Số tiền cố định"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-lg font-semibold text-black">Giá trị giảm:</p>
                        <p className="text-[16px] text-gray-500 font-medium">
                            {voucher.discountType === "percent"
                                ? `${voucher.discountValue}%`
                                : `${voucher.discountValue.toLocaleString("vi-VN")}đ`}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-lg font-semibold text-black">Giảm tối đa:</p>
                        <p className="text-[16px] text-gray-500 font-medium">
                            {voucher.maxDiscountValue
                                ? `${voucher.maxDiscountValue.toLocaleString("vi-VN")}`
                                : "Không giới hạn"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-lg font-semibold text-black">Giá trị đơn hàng tối thiểu:</p>
                        <p className="text-[16px] text-gray-500 font-medium">
                            {voucher.minOrderValue.toLocaleString("vi-VN")}đ
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-lg font-semibold text-black">Ngày bắt đầu:</p>
                        <p className="text-[16px] text-gray-500 font-medium">
                            {voucher.startDate.slice(0, 10)}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-lg font-semibold text-black">Ngày kết thúc:</p>
                        <p className="text-[16px] text-gray-500 font-medium">
                            {voucher.endDate.slice(0, 10)}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-lg font-semibold text-black">Giới hạn lượt dùng:</p>
                        <p className="text-[16px] text-gray-500 font-medium">{voucher.usageLimit}</p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-lg font-semibold text-black">Đã dùng:</p>
                        <p className="text-[16px] text-gray-500 font-medium">{voucher.usedCount}</p>
                    </div>
                </div>

                {voucher.description ? (
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-lg font-semibold text-black">Mô tả:</p>
                            <button
                                onClick={() => navigate("/admin/vouchers")}
                                className="text-sm px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition-colors duration-200"
                            >
                                Quay lại
                            </button>
                        </div>
                        <p className="text-[16px] text-gray-500 font-medium leading-relaxed">
                            {voucher.description}
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={() => navigate("/admin/vouchers")}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                        >
                            Quay lại
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailVoucher;