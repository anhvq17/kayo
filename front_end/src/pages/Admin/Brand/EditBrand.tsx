import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

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
  const [preview, setPreview] = useState<string | null>(null);
  const [oldImage, setOldImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<Brand>();

  // Lấy chi tiết brand và reset form
  async function getBrandDetail(id: string) {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/brands/${id}`);
      const brand = res.data.data;
      reset(brand);
      setOldImage(brand.image);
    } catch (error: unknown) {
      console.error("Lỗi khi tải chi tiết thương hiệu:", error);
      toast.error("Lỗi khi tải chi tiết thương hiệu", { duration: 2000 });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) getBrandDetail(id);
  }, [id]);

  const onSubmit = async (data: Brand) => {
    try {
      let imageUrl = oldImage;

      const fileInput = watch("image") as unknown as FileList;
      const file = fileInput?.[0];

      if (file instanceof File) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "DATN_upload");

        const cloudRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dvourchjx/image/upload",
          formData
        );

        imageUrl = cloudRes.data.secure_url;
      }

      // Gửi dữ liệu cập nhật
      await axios.put(`http://localhost:3000/brands/${id}`, {
        name: data.name,
        image: imageUrl,
      });

      toast.success("Cập nhật thương hiệu thành công!", { duration: 2000 });
      nav("/admin/brands");
    } catch (error: unknown) {
      console.error("Lỗi khi cập nhật thương hiệu:", error);
      const msg =
        error instanceof Error && "response" in error
          ? (error as any).response?.data?.message || "Cập nhật thương hiệu thất bại!"
          : "Cập nhật thương hiệu thất bại!";
      toast.error(msg, { duration: 2000 });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white shadow-xl rounded-xl mt-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        Sửa Thương Hiệu
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
            Ảnh thương hiệu
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            onChange={handleImageChange}
          />
          <div className="mt-2 flex gap-4 items-center">
            {preview ? (
              <img
                src={preview}
                alt="Ảnh mới"
                className="w-24 h-24 object-cover rounded-md border"
              />
            ) : oldImage ? (
              <img
                src={oldImage}
                alt="Ảnh hiện tại"
                className="w-24 h-24 object-cover rounded-md border"
              />
            ) : null}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => nav("/admin/brands")}
            className="bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Quay lại
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Cập nhật thương hiệu
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBrand;