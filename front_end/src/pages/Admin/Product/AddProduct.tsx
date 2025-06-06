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
  flavors: string;
  quantity: number;
  status: string;
  description: string;
  price: number;
  image: string;
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

  const onSubmit = async (data: FormData) => {
    try {
      const processedData = {
        ...data,
        flavors: data.flavors
          ? data.flavors.split(",").map((f) => f.trim()).filter((f) => f)
          : [],
      };

      await axios.post("http://localhost:3000/products", processedData);
      alert("Thêm sản phẩm thành công!");
      navigate("/dashboard/products");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Thêm thất bại");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white shadow-xl rounded-xl mt-10">
      <h1 className="text-3xl font-bold text-center mb-8">➕ Thêm Sản Phẩm</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tên */}
        <div>
          <label className="block mb-1 font-medium">Tên sản phẩm</label>
          <input
            {...register("name", { required: "Tên sản phẩm là bắt buộc" })}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Giá */}
        <div>
          <label className="block mb-1 font-medium">Giá</label>
          <input
            type="number"
            {...register("price", {
              required: "Giá sản phẩm là bắt buộc",
              min: {
                value: 0,
                message: "Giá phải lớn hơn hoặc bằng 0",
              },
              valueAsNumber: true,
            })}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>

        {/* Số lượng */}
        <div>
          <label className="block mb-1 font-medium">Số lượng</label>
          <input
            type="number"
            {...register("quantity", {
              required: "Số lượng là bắt buộc",
              min: {
                value: 0,
                message: "Số lượng không được âm",
              },
              valueAsNumber: true,
            })}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
        </div>

        {/* Danh mục */}
        <div>
          <label className="block mb-1 font-medium">Danh mục</label>
          <select
            {...register("categoryId", { required: "Vui lòng chọn danh mục" })}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
        </div>

        {/* Thương hiệu */}
        <div>
          <label className="block mb-1 font-medium">Thương hiệu</label>
          <select
            {...register("brandId", { required: "Vui lòng chọn thương hiệu" })}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">-- Chọn thương hiệu --</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
          {errors.brandId && <p className="text-red-500 text-sm">{errors.brandId.message}</p>}
        </div>

        {/* Mùi hương */}
        <div>
          <label className="block mb-1 font-medium">Mùi hương (phân cách bằng dấu phẩy)</label>
          <input
            {...register("flavors", { required: "Vui lòng nhập mùi hương" })}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="ví dụ: Hoa hồng, Oải hương, Vanilla"
          />
          {errors.flavors && <p className="text-red-500 text-sm">{errors.flavors.message}</p>}
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block mb-1 font-medium">Trạng thái</label>
          <select
            {...register("status")}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="Còn hàng">Còn hàng</option>
            <option value="Hết hàng">Hết hàng</option>
          </select>
        </div>

        {/* Ảnh */}
        <div>
          <label className="block mb-1 font-medium">URL ảnh sản phẩm</label>
          <input
            {...register("image", {
              required: "URL ảnh là bắt buộc"
            })}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="https://example.com/image.jpg"
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
        </div>

        {/* Mô tả */}
        <div>
          <label className="block mb-1 font-medium">Mô tả</label>
          <textarea
            {...register("description", { required: "Mô tả không được bỏ trống" })}
            className="w-full px-4 py-2 border rounded-md"
            rows={4}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        {/* Nút */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/dashboard/products")}
            className="px-5 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            🔙 Quay lại
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ➕ Thêm sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
