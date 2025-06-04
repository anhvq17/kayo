import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  flavors: string; // flavors nhập là string, xử lý chuyển thành array khi submit
  quantity: number;
  status: string;
  description: string;
}

const AddProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      status: "Còn hàng",
      quantity: 0,
    },
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get("http://localhost:3000/categories");
        setCategories(res.data.data);
      } catch {
        alert("Lỗi khi lấy danh mục");
      }
    }

    async function fetchBrands() {
      try {
        const res = await axios.get("http://localhost:3000/brands");
        setBrands(res.data.data);
      } catch {
        alert("Lỗi khi lấy thương hiệu");
      }
    }

    fetchCategories();
    fetchBrands();
  }, []);

  async function onSubmit(data: FormData) {
    try {
      // Chuyển flavors từ string thành mảng string (array)
      const processedData = {
        ...data,
        flavors: data.flavors
          ? data.flavors.split(",").map((f) => f.trim()).filter((f) => f.length > 0)
          : [],
      };

      await axios.post("http://localhost:3000/products", processedData);
      alert("Thêm thành công");
      navigate("/dashboard/products");
    } catch (error) {
      alert("Lỗi khi thêm sản phẩm");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white shadow-xl rounded-xl mt-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        🛒 Thêm Sản Phẩm Mới
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tên sản phẩm */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên sản phẩm
          </label>
          <input
            {...register("name", { required: "Tên sản phẩm là bắt buộc" })}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Danh mục (select) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Danh mục
          </label>
          <select
            {...register("categoryId", { required: "Chọn danh mục" })}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
            defaultValue=""
          >
            <option value="" disabled>
              -- Chọn danh mục --
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-600 text-sm mt-1">{errors.categoryId.message}</p>
          )}
        </div>

        {/* Thương hiệu (select) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thương hiệu
          </label>
          <select
            {...register("brandId", { required: "Chọn thương hiệu" })}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
            defaultValue=""
          >
            <option value="" disabled>
              -- Chọn thương hiệu --
            </option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
          {errors.brandId && (
            <p className="text-red-600 text-sm mt-1">{errors.brandId.message}</p>
          )}
        </div>

        {/* Mùi hương (flavors) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mùi hương (cách nhau bằng dấu phẩy)
          </label>
          <input
            {...register("flavors")}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
            placeholder="Ví dụ: Hoa hồng, Oải hương, Vanilla"
          />
        </div>

        {/* Số lượng */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số lượng
          </label>
          <input
            type="number"
            {...register("quantity", {
              required: "Nhập số lượng",
              min: { value: 0, message: "Số lượng không được âm" },
              valueAsNumber: true,
            })}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
          />
          {errors.quantity && (
            <p className="text-red-600 text-sm mt-1">{errors.quantity.message}</p>
          )}
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            {...register("status")}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
            defaultValue="Còn hàng"
          >
            <option value="Còn hàng">Còn hàng</option>
            <option value="Hết hàng">Hết hàng</option>
          </select>
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            {...register("description", { required: "Mô tả là bắt buộc" })}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
            rows={4}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

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
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ➕ Thêm sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
