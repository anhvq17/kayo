import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface FormData {
  name: string;
  image: FileList;
}

const AddBrand = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      // 1. Upload ảnh lên Cloudinary
      const file = data.image[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "DATN_upload"); 

      const cloudRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dvourchjx/image/upload",
        formData
      );

      const imageUrl = cloudRes.data.secure_url;

      // 2. Gửi dữ liệu brand về server
      await axios.post("http://localhost:3000/brands", {
        name: data.name,
        image: imageUrl,
      });

      alert("Thêm thương hiệu thành công");
      navigate("/admin/brands");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi thêm thương hiệu");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white shadow-xl rounded-xl mt-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        🛍️ Thêm Thương Hiệu Mới
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên thương hiệu
          </label>
          <input
            {...register("name", {
              required: "Tên thương hiệu không được để trống",
            })}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
            placeholder="VD: Gucci"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ảnh đại diện
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("image", {
              required: "Ảnh không được để trống",
            })}
            onChange={handleImageChange}
            className="w-full"
          />
          {errors.image && (
            <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
          )}

          {preview && (
            <img
              src={preview}
              alt="Xem trước"
              className="w-32 h-32 object-cover mt-2 rounded-md border"
            />
          )}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/admin/brands")}
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
