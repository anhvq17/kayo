import { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface CategoryForm {
  name: string;
  description: string;
  status: "activated" | "deactivated";
}

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryForm>();

  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await axios.get(`http://localhost:3000/categories/${id}`);
        reset(res.data.data);// reset form với dữ liệu lấy về
      } catch (error) {
        alert("Lỗi khi tải chi tiết danh mục");
        console.error(error);
      }
    }
    if (id) {
      fetchCategory();
    }
  }, [id, reset]);

  const onSubmit = async (data: CategoryForm) => {
    try {
      await axios.patch(`http://localhost:3000/categories/${id}`, data);
      alert("Cập nhật danh mục thành công");
      navigate("/admin/categories");
    } catch (error) {
      alert("Lỗi khi cập nhật danh mục");
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white shadow-xl rounded-xl mt-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        ✏️ Chỉnh sửa Danh Mục
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên danh mục
          </label>
          <input
            {...register("name", { required: "Tên danh mục là bắt buộc" })}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
            placeholder="Nhập tên danh mục"
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
            placeholder="Mô tả danh mục (tuỳ chọn)"
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
            className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            💾 Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
