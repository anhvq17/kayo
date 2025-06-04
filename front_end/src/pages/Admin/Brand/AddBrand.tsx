import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

interface FormData {
  name: string;
  image: string; // URL ảnh dưới dạng text input
}

const AddBrand = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post("http://localhost:3000/brands", data);
      alert("Thêm thương hiệu thành công");
      navigate("/dashboard/brands");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi thêm thương hiệu");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white shadow-xl rounded-xl mt-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">🛍️ Thêm Thương Hiệu Mới</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên thương hiệu</label>
          <input
            {...register("name", { required: "Tên thương hiệu không được để trống" })}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
            placeholder="Nhập tên thương hiệu"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL hình ảnh</label>
          <input
            {...register("image", { 
              required: "URL hình ảnh không được để trống",
              pattern: {
                value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))/i,
                message: "URL không hợp lệ hoặc không phải là ảnh"
              }
            })}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
            placeholder="https://example.com/image.png"
          />
          {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/dashboard/brands")}
            className="bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            🔙 Quay lại
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ➕ Thêm thương hiệu
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBrand;
