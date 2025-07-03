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
        reset(res.data.data);
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6 mt-8"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Chỉnh sửa danh mục
      </h2>

      <div>
        <label className="block font-medium mb-1">
          <span className="text-red-500">*</span> Tên danh mục
        </label>
        <input
          {...register("name", { required: "Tên danh mục là bắt buộc" })}
          className="w-full border rounded px-3 py-2"
          placeholder="VD: Điện thoại"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Mô tả</label>
        <textarea
          {...register("description")}
          className="w-full border rounded px-3 py-2 h-24"
          placeholder="Mô tả danh mục (không bắt buộc)"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Trạng thái</label>
        <select
          {...register("status")}
          className="w-full border rounded px-3 py-2"
        >
          <option value="activated">Hoạt động</option>
          <option value="deactivated">Tạm khoá</option>
        </select>
      </div>

      <div className="flex gap-x-4 mt-4 justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Lưu thay đổi
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/categories")}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Quay lại
        </button>
      </div>
    </form>
  );
};

export default EditCategory;