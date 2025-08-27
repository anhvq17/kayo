import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

type FormData = {
  value: string;
  valueCode: string;
  attributeId: string;
};

type Attribute = {
  _id: string;
  name: string;
};

const EditAttributeValue = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>();

  const [attributes, setAttributes] = useState<Attribute[]>([]);

  // Lấy danh sách thuộc tính và dữ liệu value
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attrRes, valueRes] = await Promise.all([
          axios.get("http://localhost:3000/attribute"),
          axios.get(`http://localhost:3000/attribute-value/${id}`),
        ]);
        setAttributes(attrRes.data.data);

        const { value, valueCode, attributeId } = valueRes.data.data;
        reset({
          value,
          valueCode,
          attributeId: attributeId._id, // Chuyển về ID chuỗi
        });
      } catch (error: unknown) {
        console.error("Lỗi khi tải dữ liệu:", error);
        toast.error("Không thể tải dữ liệu cần thiết", { duration: 2000 });
        navigate("/admin/attribute-values");
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await axios.put(`http://localhost:3000/attribute-value/${id}`, data);
      toast.success("Cập nhật giá trị thành công!", { duration: 2000 });
      navigate("/admin/attribute-values");
    } catch (error: unknown) {
      const msg =
        error instanceof Error && "response" in error
          ? (error as any).response?.data?.message || "Lỗi khi cập nhật!"
          : "Lỗi khi cập nhật!";
      if (
        error instanceof Error &&
        "response" in error &&
        Array.isArray((error as any).response?.data?.errors)
      ) {
        (error as any).response.data.errors.forEach((err: string) => {
          if (err.includes("value")) {
            setError("value", { type: "server", message: err });
          }
          if (err.includes("valueCode")) {
            setError("valueCode", { type: "server", message: err });
          }
          if (err.includes("attributeId")) {
            setError("attributeId", { type: "server", message: err });
          }
        });
      } else {
        toast.error(msg, { duration: 2000 });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full p-6 bg-white rounded shadow space-y-6"
    >
      <h2 className="text-xl font-semibold">CHỈNH SỬA GIÁ TRỊ THUỘC TÍNH</h2>

      {/* Giá trị */}
      <div>
        <label className="block font-medium mb-1">
          <span className="text-red-500">*</span> Giá trị
        </label>
        <input
          {...register("value", { required: "Vui lòng nhập giá trị" })}
          className="w-full border rounded px-3 py-2"
          placeholder="VD: 100ml, Đỏ, S"
        />
        {errors.value && (
          <p className="text-red-500 text-sm">{errors.value.message}</p>
        )}
      </div>

      {/* Mã giá trị */}
      <div>
        <label className="block font-medium mb-1">
          <span className="text-red-500">*</span> Mã giá trị
        </label>
        <input
          {...register("valueCode", {
            required: "Vui lòng nhập mã giá trị",
            pattern: {
              value: /^[a-zA-Z0-9-_]+$/,
              message: "Mã chỉ bao gồm chữ, số, gạch ngang hoặc gạch dưới",
            },
          })}
          className="w-full border rounded px-3 py-2"
          placeholder="VD: 100ml"
        />
        {errors.valueCode && (
          <p className="text-red-500 text-sm">{errors.valueCode.message}</p>
        )}
      </div>

      {/* Thuộc tính */}
      <div>
        <label className="block font-medium mb-1">
          <span className="text-red-500">*</span> Thuộc tính
        </label>
        <select
          {...register("attributeId", { required: "Vui lòng chọn thuộc tính" })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">-- Chọn thuộc tính --</option>
          {attributes.map((attr) => (
            <option key={attr._id} value={attr._id}>
              {attr.name}
            </option>
          ))}
        </select>
        {errors.attributeId && (
          <p className="text-red-500 text-sm">{errors.attributeId.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-x-4 mt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Cập nhật
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/attribute-values")}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Quay lại
        </button>
      </div>
    </form>
  );
};

export default EditAttributeValue;