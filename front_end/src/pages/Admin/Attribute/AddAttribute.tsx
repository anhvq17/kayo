import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type FormData = {
  name: string;
  attributeCode: string;
  description: string;
};

const AddAttribute = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      attributeCode: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post("http://localhost:3000/attribute", data);
      toast.success("Thêm thuộc tính thành công!", { duration: 2000 });
      reset();
    } catch (error: unknown) {
      const msg =
        error instanceof Error && "response" in error
          ? (error as any).response?.data?.message || "Lỗi khi thêm thuộc tính!"
          : "Lỗi khi thêm thuộc tính!";
      if (
        error instanceof Error &&
        "response" in error &&
        Array.isArray((error as any).response?.data?.errors)
      ) {
        (error as any).response.data.errors.forEach((err: string) => {
          if (err.includes("Tên")) {
            setError("name", { type: "server", message: err });
          }
          if (err.includes("Mã")) {
            setError("attributeCode", { type: "server", message: err });
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
      className="p-6 bg-white rounded shadow space-y-6"
    >
      <h2 className="text-xl font-semibold mb-4">THÊM THUỘC TÍNH SẢN PHẨM</h2>

      {/* Tên thuộc tính */}
      <div>
        <label className="block font-medium mb-1">
          <span className="text-red-500">*</span> Tên thuộc tính
        </label>
        <input
          {...register("name", { required: "Vui lòng nhập tên thuộc tính" })}
          className="w-full border rounded px-3 py-2"
          placeholder="VD: Dung tích"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Mã thuộc tính */}
      <div>
        <label className="block font-medium mb-1">
          <span className="text-red-500">*</span> Mã thuộc tính
        </label>
        <input
          {...register("attributeCode", {
            required: "Vui lòng nhập mã thuộc tính",
            pattern: {
              value: /^[a-zA-Z0-9-_]+$/,
              message: "Mã chỉ bao gồm chữ, số, gạch ngang hoặc gạch dưới",
            },
          })}
          className="w-full border rounded px-3 py-2"
          placeholder="VD: volume"
        />
        {errors.attributeCode && (
          <p className="text-red-500 text-sm">{errors.attributeCode.message}</p>
        )}
      </div>

      {/* Mô tả */}
      <div>
        <label className="block font-medium mb-1">Mô tả</label>
        <textarea
          {...register("description")}
          className="w-full border rounded px-3 py-2 h-24"
          placeholder="Mô tả cho thuộc tính (không bắt buộc)"
        />
      </div>

      <div className="flex gap-x-4 mt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Thêm thuộc tính
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/attributes")}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Quay lại
        </button>
      </div>
    </form>
  );
};

export default AddAttribute;