import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

type FormData = {
  code: string;
  description?: string;
  discountType: "percent" | "fixed";
  discountValue?: number;
  minOrderValue?: number;
  maxDiscountValue?: number | null;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  status: "activated" | "inactivated";
};

const AddVoucher = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      code: "",
      description: "",
      discountType: "percent",
      maxDiscountValue: null,
      status: "activated",
    },
  });

  const discountType = watch("discountType");
  const startDate = watch("startDate");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (discountType === "fixed") {
        data.maxDiscountValue = null;
      }

      await axios.post("http://localhost:3000/voucher", data);
      alert("Thêm voucher thành công!");
      reset();
    } catch (error: any) {
      const serverErrors = error.response?.data?.errors || [];
      if (Array.isArray(serverErrors)) {
        serverErrors.forEach((msg: string) => {
          if (msg.includes("Mã")) {
            setError("code", { type: "server", message: msg });
          }
        });
      } else {
        alert(error.response?.data?.message || "Đã xảy ra lỗi!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-white rounded shadow space-y-6"
    >
      <h2 className="text-xl font-semibold mb-4">THÊM MÃ GIẢM GIÁ</h2>

      {/* Mã voucher */}
      <div>
        <label className="block font-medium mb-1">
          <span className="text-red-500">*</span> Mã voucher
        </label>
        <input
          {...register("code", {
            required: "Vui lòng nhập mã voucher",
            pattern: {
              value: /^[A-Z0-9-_]+$/,
              message: "Chỉ gồm chữ in hoa, số, gạch ngang hoặc gạch dưới",
            },
          })}
          className="w-full border rounded px-3 py-2"
          placeholder="VD: SUMMER10"
        />
        {errors.code && (
          <p className="text-red-500 text-sm">{errors.code.message}</p>
        )}
      </div>

      {/* Mô tả */}
      <div>
        <label className="block font-medium mb-1">Mô tả</label>
        <textarea
          {...register("description")}
          className="w-full border rounded px-3 py-2 h-20"
          placeholder="Mô tả ngắn về voucher"
        />
      </div>

      {/* Loại giảm giá */}
      <div>
        <label className="block font-medium mb-1">
          <span className="text-red-500">*</span> Loại giảm giá
        </label>
        <select
          {...register("discountType", {
            required: "Vui lòng chọn loại giảm giá",
          })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="percent">Phần trăm (%)</option>
          <option value="fixed">Số tiền (VNĐ)</option>
        </select>
        {errors.discountType && (
          <p className="text-red-500 text-sm">{errors.discountType.message}</p>
        )}
      </div>

      {/* Giá trị giảm */}
      <div>
        <label className="block font-medium mb-1">
          <span className="text-red-500">*</span> Giá trị giảm
        </label>
        <input
          type="number"
          {...register("discountValue", {
            valueAsNumber: true,
            required: "Vui lòng nhập giá trị giảm",
            min: { value: 1, message: "Phải > 0" },
          })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.discountValue && (
          <p className="text-red-500 text-sm">{errors.discountValue.message}</p>
        )}
      </div>

      {/* Giá trị tối thiểu đơn hàng */}
      <div>
        <label className="block font-medium mb-1">
          <span className="text-red-500">*</span>Giá trị tối thiểu đơn hàng</label>
        <input
          type="number"
          {...register("minOrderValue", {
            required: "Vui lòng nhập giá trị tối thiểu đơn hàng",
            valueAsNumber: true,
            min: { value: 1, message: "Phải > 0" },
          })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.minOrderValue && (
          <p className="text-red-500 text-sm">{errors.minOrderValue.message}</p>
        )}
      </div>

      {/* Giảm tối đa (chỉ áp dụng cho giảm giá %) */}
      <div>
        <label className="block font-medium mb-1">
          Giảm tối đa (chỉ áp dụng cho giảm giá %)
        </label>
        <input
          type="number"
          disabled={discountType === "fixed"}
          {...register("maxDiscountValue", {
            valueAsNumber: true,
            min: { value: 1, message: "Phải > 0" },
          })}
          className={`w-full border rounded px-3 py-2 ${
            discountType === "fixed" ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
        {errors.maxDiscountValue && (
          <p className="text-red-500 text-sm">{errors.maxDiscountValue.message}</p>
        )}
      </div>

      {/* Ngày bắt đầu và kết thúc */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">
            <span className="text-red-500">*</span> Ngày bắt đầu
          </label>
          <input
            type="date"
            {...register("startDate", {
              required: "Vui lòng chọn ngày bắt đầu",
            })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">
            <span className="text-red-500">*</span> Ngày kết thúc
          </label>
          <input
            type="date"
            min={startDate}
            {...register("endDate", {
              required: "Vui lòng chọn ngày kết thúc",
              validate: (value) => {
                if (!startDate) return true;
                return (
                  new Date(value) > new Date(startDate) ||
                  "Ngày kết thúc phải sau ngày bắt đầu"
                );
              },
            })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Giới hạn số lần sử dụng */}
      <div>
        <label className="block font-medium mb-1">
          <span className="text-red-500">*</span> Giới hạn số lần sử dụng
        </label>
        <input
          type="number"
          {...register("usageLimit", {
            valueAsNumber: true,
            required: "Vui lòng nhập số lần sử dụng",
            min: { value: 1, message: "Phải >= 1" },
          })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.usageLimit && (
          <p className="text-red-500 text-sm">{errors.usageLimit.message}</p>
        )}
      </div>

      {/* Trạng thái */}
      <div>
        <label className="block font-medium mb-1">
          <span className="text-red-500">*</span> Trạng thái
        </label>
        <select
          {...register("status", {
            required: "Vui lòng chọn trạng thái",
          })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="activated">Kích hoạt</option>
          <option value="inactivated">Tạm dừng</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-sm">{errors.status.message}</p>
        )}
      </div>

      {/* Nút */}
      <div className="flex gap-x-4 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {loading ? "Đang lưu..." : "Thêm voucher"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/vouchers")}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Quay lại
        </button>
      </div>
    </form>
  );
};

export default AddVoucher;
