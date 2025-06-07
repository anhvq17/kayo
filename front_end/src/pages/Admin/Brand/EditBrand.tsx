import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

interface Brand {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const EditBrand = () => {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Brand>();

  // Lấy chi tiết brand và reset form
  async function getBrandDetail(id: string) {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/brands/${id}`);
      reset(res.data.data); // nhớ lấy đúng data từ API
    } catch (error) {
      alert("Lỗi khi tải chi tiết thương hiệu");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      getBrandDetail(id);
    }
  }, [id]);

  // Xử lý submit form cập nhật
  async function onSubmit(data: Brand) {
    try {
      await axios.put(`http://localhost:3000/brands/${id}`, data);
      alert("Cập nhật thương hiệu thành công");
      nav("/admin/brands");
    } catch (error) {
      alert("Lỗi khi cập nhật thương hiệu");
    }
  }

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white shadow-xl rounded-xl mt-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        ✏️ Sửa Thương Hiệu
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên thương hiệu
          </label>
          <input
            {...register("name", { required: "Tên thương hiệu là bắt buộc" })}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL hình ảnh
          </label>
          <input
            {...register("image", { required: "URL hình ảnh là bắt buộc" })}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
          />
          {errors.image && (
            <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => nav("/admin/brands")}
            className="bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            🔙 Quay lại
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            💾 Cập nhật thương hiệu
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBrand;
