import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface FormData {
  name: string;
  categoryId: string;
  brandId: string;
  flavors: string;
  quantity: number;
  status: string;
  description: string;
}

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, brandRes] = await Promise.all([
          axios.get("http://localhost:3000/categories"),
          axios.get("http://localhost:3000/brands"),
        ]);

        setCategories(catRes.data.data);
        setBrands(brandRes.data.data);

        const productRes = await axios.get(`http://localhost:3000/products/${id}`);
        const product = productRes.data.data;

        // Chỉ reset sau khi danh mục và thương hiệu đã có
        reset({
          name: product.name,
          categoryId: product.categoryId?._id || product.categoryId || "",
          brandId: product.brandId?._id || product.brandId || "",
          flavors: product.flavors?.join(", ") || "",
          quantity: product.quantity,
          status: product.status,
          description: product.description,
        });

        setLoading(false);
      } catch (err) {
        alert("Lỗi khi tải dữ liệu sản phẩm");
      }
    }

    fetchData();
  }, [id, reset]);

  async function onSubmit(data: FormData) {
    try {
      const processedData = {
        ...data,
        flavors: data.flavors
          ? data.flavors.split(",").map((f) => f.trim()).filter((f) => f.length > 0)
          : [],
      };

      await axios.put(`http://localhost:3000/products/${id}`, processedData);
      alert("Cập nhật thành công");
      navigate("/dashboard/products");
    } catch (err) {
      alert("Lỗi khi cập nhật sản phẩm");
    }
  }

  if (loading) {
    return <p className="text-center py-10">⏳ Đang tải dữ liệu...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white shadow-xl rounded-xl mt-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        🛠️ Chỉnh sửa sản phẩm
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tên sản phẩm */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
          <input
            {...register("name", { required: "Tên sản phẩm là bắt buộc" })}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Danh mục */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
          <select
            {...register("categoryId", { required: "Chọn danh mục" })}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-600 text-sm mt-1">{errors.categoryId.message}</p>}
        </div>

        {/* Thương hiệu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
          <select
            {...register("brandId", { required: "Chọn thương hiệu" })}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
          >
            <option value="">-- Chọn thương hiệu --</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
          {errors.brandId && <p className="text-red-600 text-sm mt-1">{errors.brandId.message}</p>}
        </div>

        {/* Mùi hương */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mùi hương (phân cách bởi dấu phẩy)
          </label>
          <input
            {...register("flavors")}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
            placeholder="Ví dụ: Hoa hồng, Bạc hà, Vanilla"
          />
        </div>

        {/* Số lượng */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
          <input
            type="number"
            {...register("quantity", {
              required: "Nhập số lượng",
              min: { value: 0, message: "Số lượng không được âm" },
              valueAsNumber: true,
            })}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
          />
          {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity.message}</p>}
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <select
            {...register("status")}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
          >
            <option value="Còn hàng">Còn hàng</option>
            <option value="Hết hàng">Hết hàng</option>
          </select>
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea
            {...register("description", { required: "Mô tả là bắt buộc" })}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
            rows={4}
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/dashboard/products")}
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

export default EditProduct;
