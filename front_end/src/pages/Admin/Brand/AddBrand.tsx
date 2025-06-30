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
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      const file = data.image[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "DATN_upload");

      const cloudRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dvourchjx/image/upload",
        formData
      );

      const imageUrl = cloudRes.data.secure_url;

      await axios.post("http://localhost:3000/brands", {
        name: data.name,
        image: imageUrl,
      });

      alert("Thêm thương hiệu thành công!");
      reset();
      navigate("/admin/brands");
    } catch (error: any) {
      console.error("Thêm brand lỗi:", error);
      alert("Thêm thương hiệu thất bại!");
    }

  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-white rounded shadow space-y-6 max-w-3xl mx-auto mt-8"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">THÊM THƯƠNG HIỆU</h2>

      {/* Tên thương hiệu */}
      <div>
        <label className="block font-medium mb-1">
          <span className="text-red-500">*</span> Tên thương hiệu
        </label>
        <input
          {...register("name", {
            required: "Vui lòng nhập tên thương hiệu",
            minLength: {
              value: 2,
              message: "Tên thương hiệu phải ít nhất 2 ký tự",
            },
            maxLength: {
              value: 100,
              message: "Tên thương hiệu không vượt quá 100 ký tự",
            },
          })}
          className="w-full border rounded px-3 py-2"
          placeholder="VD: Gucci"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Ảnh thương hiệu */}
      <div>
        <label className="block font-medium mb-1">
          <span className="text-red-500">*</span> Hình ảnh
        </label>
        <input
          type="file"
          accept="image/*"
          {...register("image", {
            required: "Vui lòng chọn hình ảnh",
            validate: (fileList) =>
              fileList.length > 0 || "Vui lòng chọn một ảnh",
          })}
          onChange={handleImageChange}
          className="w-full"
        />
        {errors.image && (
          <p className="text-red-500 text-sm">{errors.image.message}</p>
        )}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover mt-2 rounded border"
          />
        )}
      </div>

      {/* Button */}
      <div className="flex gap-x-4 mt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Thêm thương hiệu
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/brands")}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Quay lại
        </button>
      </div>
    </form>
  );
};

export default AddBrand;
