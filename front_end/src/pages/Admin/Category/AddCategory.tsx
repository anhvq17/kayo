import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface CategoryForm {
  name: string;
  description: string;
  status: "activated" | "deactivated";
}

const AddCategory = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryForm>({
    defaultValues: {
      status: "activated",
    },
  });

  const onSubmit = async (data: CategoryForm) => {
    console.log("📦 Dữ liệu gửi lên:", data);
    try {
      await axios.post("http://localhost:3000/categories", data);
      alert("Thêm danh mục thành công");
      navigate("/admin/categories");
    } catch (error) {
      alert("Lỗi khi thêm danh mục");
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white shadow-xl rounded-xl mt-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        🗂️ Thêm Danh Mục Mới
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên danh mục
          </label>
          <input
            {...register("name", { required: "Tên danh mục là bắt buộc" })}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
            placeholder="VD: Nam"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            {...register("description")}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
            placeholder="Mô tả hiển thị"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            {...register("status")}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
          >
            <option value="activated">Kích hoạt</option>
            <option value="deactivated">Không kích hoạt</option>
          </select>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            🔙 Quay lại
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ➕ Thêm danh mục
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
