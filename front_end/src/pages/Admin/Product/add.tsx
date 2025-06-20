// ...các import như cũ
import React, { useEffect } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";

type VariantType = {
  flavors: string;
  volume: string;
  price: string;
  stock_quantity: string;
  image: string;
};

type FormData = {
  name: string;
  description: string;
  categoryId: string;
  brandId: string;
  variants: VariantType[];
};

const AddProduct = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      brandId: "",
      variants: [
        {
          flavors: "",
          volume: "",
          price: "",
          stock_quantity: "",
          image: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const [categories, setCategories] = React.useState<any[]>([]);
  const [brands, setBrands] = React.useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cateRes, brandRes] = await Promise.all([
          axios.get("http://localhost:3000/categories"),
          axios.get("http://localhost:3000/brands"),
        ]);
        setCategories(cateRes.data.data);
        setBrands(brandRes.data.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục hoặc thương hiệu:", err);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const productRes = await axios.post("http://localhost:3000/products", {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        brandId: data.brandId,
      });
      const productId = productRes.data.data._id;

      for (const variant of data.variants) {
        await axios.post("http://localhost:3000/variant", {
          productId,
          ...variant,
          volume: Number(variant.volume),
          price: Number(variant.price),
          stock_quantity: Number(variant.stock_quantity),
        });
      }

      alert("✅ Thêm sản phẩm và biến thể thành công!");
      reset(); // Reset form sau khi submit
    } catch (error: any) {
      console.error("❌ Lỗi khi thêm sản phẩm hoặc biến thể:", error);
      alert("❌ Thêm sản phẩm thất bại");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 bg-white space-y-6">
      <h2 className="text-xl font-semibold">THÊM MỚI SẢN PHẨM</h2>

      {/* Tên sản phẩm */}
      <div>
        <label className="block font-medium mb-1">
          <span className="text-red-500">*</span> Tên sản phẩm
        </label>
        <input
          {...register("name", { required: "Vui lòng nhập tên sản phẩm" })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* Danh mục và thương hiệu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">
            <span className="text-red-500">*</span> Danh mục
          </label>
          <select
            {...register("categoryId", { required: "Chọn danh mục" })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cate) => (
              <option key={cate._id} value={cate._id}>
                {cate.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">
            <span className="text-red-500">*</span> Thương hiệu
          </label>
          <select
            {...register("brandId", { required: "Chọn thương hiệu" })}
            className="w-full border rounded px-3 py-2"
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
      </div>

      {/* Mô tả */}
      <div>
        <label className="block font-medium mb-1">
          <span className="text-red-500">*</span> Mô tả
        </label>
        <textarea
          {...register("description", { required: "Nhập mô tả" })}
          className="w-full border rounded px-3 py-2 h-24"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      {/* Biến thể sản phẩm */}
      <div>
        <h3 className="text-lg font-medium mb-2">Biến thể sản phẩm</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div>
              <label className="block font-medium mb-1">Hương vị</label>
              <input
                placeholder="Hương vị"
                {...register(`variants.${index}.flavors`, { required: "Nhập hương vị" })}
                className="border px-2 py-1 rounded w-full"
              />
              {errors.variants?.[index]?.flavors && (
                <p className="text-red-500 text-sm">{errors.variants[index].flavors?.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Thể tích (ml)</label>
              <input
                placeholder="Thể tích"
                {...register(`variants.${index}.volume`, {
                  required: "Nhập thể tích",
                  pattern: { value: /^[0-9]+$/, message: "Chỉ nhập số" },
                  min: { value: 1, message: "Thể tích phải > 0" },
                })}
                className="border px-2 py-1 rounded w-full"
              />
              {errors.variants?.[index]?.volume && (
                <p className="text-red-500 text-sm">{errors.variants[index].volume?.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Giá (vnđ)</label>
              <input
                placeholder="Giá"
                {...register(`variants.${index}.price`, {
                  required: "Nhập giá",
                  pattern: { value: /^[0-9]+$/, message: "Chỉ nhập số" },
                  min: { value: 1, message: "Giá phải > 0" },
                })}
                className="border px-2 py-1 rounded w-full"
              />
              {errors.variants?.[index]?.price && (
                <p className="text-red-500 text-sm">{errors.variants[index].price?.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Số lượng</label>
              <input
                placeholder="Số lượng"
                {...register(`variants.${index}.stock_quantity`, {
                  required: "Nhập số lượng",
                  pattern: { value: /^[0-9]+$/, message: "Chỉ nhập số" },
                  min: { value: 1, message: "Số lượng phải > 0" },
                })}
                className="border px-2 py-1 rounded w-full"
              />
              {errors.variants?.[index]?.stock_quantity && (
                <p className="text-red-500 text-sm">{errors.variants[index].stock_quantity?.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Ảnh</label>
              <input
                placeholder="URL ảnh"
                {...register(`variants.${index}.image`, { required: "Nhập đường dẫn ảnh" })}
                className="border px-2 py-1 rounded w-full"
              />
              {errors.variants?.[index]?.image && (
                <p className="text-red-500 text-sm">{errors.variants[index].image?.message}</p>
              )}
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => remove(index)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 h-fit"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            append({
              flavors: "",
              volume: "",
              price: "",
              stock_quantity: "",
              image: "",
            })
          }
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Thêm biến thể
        </button>
      </div>


      {/* Nút submit */}
      <div>
        <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Thêm sản phẩm
        </button>
      </div>
    </form>
  );
};

export default AddProduct;
