import { useEffect, useState } from "react";
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
  image: string;
  price: number;
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

        // Reset form với dữ liệu đầy đủ, bao gồm image và price
        reset({
          name: product.name,
          categoryId: product.categoryId?._id || product.categoryId || "",
          brandId: product.brandId?._id || product.brandId || "",
          flavors: product.flavors?.join(", ") || "",
          quantity: product.quantity,
          status: product.status,
          description: product.description,
          image: product.image || "",
          price: product.price || 0,
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
      navigate("/admin/products");
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
              min: { value: 0, message: "Giá phải lớn hơn hoặc bằng 0" },
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
              min: { value: 0, message: "Số lượng không được âm" },
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
          <select {...register("status")} className="w-full px-4 py-2 border rounded-md">
            <option value="Còn hàng">Còn hàng</option>
            <option value="Hết hàng">Hết hàng</option>
          </select>
        </div>

        {/* URL ảnh sản phẩm */}
        <div>
          <label className="block mb-1 font-medium">URL ảnh sản phẩm</label>
          <input
            {...register("image", { required: "URL ảnh là bắt buộc" })}
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
            onClick={() => navigate("/admin/products")}
            className="px-5 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            🔙 Quay lại
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            💾 Cập nhật sản phẩm
          </button>
        </div>
      </form>

    </div>
  );
};

export default EditProduct;
