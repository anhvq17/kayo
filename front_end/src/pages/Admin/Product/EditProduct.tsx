import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

type VariantType = {
  _id?: string;
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

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      brandId: "",
      variants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cateRes, brandRes, productRes, variantRes] = await Promise.all([
          axios.get("http://localhost:3000/categories"),
          axios.get("http://localhost:3000/brands"),
          axios.get(`http://localhost:3000/products/${id}`),
          axios.get(`http://localhost:3000/variant/product/${id}`),
        ]);

        setCategories(cateRes.data.data);
        setBrands(brandRes.data.data);

        const product = productRes.data.data;
        const variants = variantRes.data.data;

        reset({
          name: product.name,
          description: product.description,
          categoryId:
            typeof product.categoryId === "object"
              ? product.categoryId._id
              : product.categoryId,
          brandId:
            typeof product.brandId === "object"
              ? product.brandId._id
              : product.brandId,
          variants: variants.map((v: any) => ({
            _id: v._id,
            flavors: v.flavors,
            volume: String(v.volume),
            price: String(v.price),
            stock_quantity: String(v.stock_quantity),
            image: v.image,
          })),
        });
      } catch (err) {
        console.error("Lỗi khi load dữ liệu:", err);
      }
    };
    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await axios.put(`http://localhost:3000/products/${id}`, {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        brandId: data.brandId,
      });

      let hasError = false;

      for (let index = 0; index < data.variants.length; index++) {
        const variant = data.variants[index];
        const { _id, ...rest } = variant;

        const payload = {
          productId: id,
          ...rest,
          volume: Number(rest.volume),
          price: Number(rest.price),
          stock_quantity: Number(rest.stock_quantity),
        };

        try {
          if (_id) {
            await axios.put(`http://localhost:3000/variant/${_id}`, payload);
          } else {
            await axios.post("http://localhost:3000/variant", payload);
          }
        } catch (err: any) {
          hasError = true;
          const msg =
            err.response?.data?.message ||
            "Có lỗi xảy ra khi cập nhật biến thể.";

          setError(`variants.${index}.volume`, {
            type: "server",
            message: msg,
          });
        }
      }

      if (hasError) {
        alert("Cập nhật sản phẩm thất bại với một số biến thể!");
        return;
      }

      alert("Cập nhật thành công!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto p-6 bg-white space-y-6"
    >
      <h2 className="text-xl font-semibold">CẬP NHẬT SẢN PHẨM</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Tên sản phẩm</label>
          <input
            {...register("name", { required: "Không được để trống" })}
            className="border rounded px-3 py-2 w-full"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Danh mục</label>
          <select
            {...register("categoryId", { required: "Bắt buộc" })}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cate) => (
              <option key={cate._id} value={cate._id}>
                {cate.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Thương hiệu</label>
          <select
            {...register("brandId", { required: "Bắt buộc" })}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">-- Chọn thương hiệu --</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Mô tả</label>
          <textarea
            {...register("description")}
            className="border rounded px-3 py-2 w-full"
            rows={4}
          />
        </div>
      </div>

      {/* Biến thể */}
      <div>
        <h3 className="text-lg font-medium mb-2">Biến thể sản phẩm</h3>
        {fields.map((field, index) => {
          const image = watch(`variants.${index}.image`);

          const onImageUpload = async (
            e: React.ChangeEvent<HTMLInputElement>
          ) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "DATN_upload");

            try {
              const res = await axios.post(
                "https://api.cloudinary.com/v1_1/dvourchjx/image/upload",
                formData
              );
              setValue(`variants.${index}.image`, res.data.secure_url);
            } catch (err) {
              console.error("Upload thất bại:", err);
            }
          };

          return (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6 border p-4 rounded-md shadow-sm"
            >
              <input type="hidden" {...register(`variants.${index}._id`)} />

              <div>
                <label className="block font-medium mb-1">Hương vị</label>
                <input
                  {...register(`variants.${index}.flavors`, {
                    required: "Nhập hương vị",
                  })}
                  className="border px-2 py-1 rounded w-full"
                />
                {errors.variants?.[index]?.flavors && (
                  <p className="text-red-500 text-sm">
                    {errors.variants[index].flavors?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">Thể tích (ml)</label>
                <input
                  {...register(`variants.${index}.volume`, {
                    required: "Nhập thể tích",
                    pattern: { value: /^[0-9]+$/, message: "Chỉ nhập số" },
                    min: { value: 1, message: "Thể tích phải > 0" },
                  })}
                  className="border px-2 py-1 rounded w-full"
                />
                {errors.variants?.[index]?.volume && (
                  <p className="text-red-500 text-sm">
                    {errors.variants[index].volume?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">Giá (vnđ)</label>
                <input
                  {...register(`variants.${index}.price`, {
                    required: "Nhập giá",
                    pattern: { value: /^[0-9]+$/, message: "Chỉ nhập số" },
                    min: { value: 1, message: "Giá phải > 0" },
                  })}
                  className="border px-2 py-1 rounded w-full"
                />
                {errors.variants?.[index]?.price && (
                  <p className="text-red-500 text-sm">
                    {errors.variants[index].price?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">Số lượng</label>
                <input
                  {...register(`variants.${index}.stock_quantity`, {
                    required: "Nhập số lượng",
                    pattern: { value: /^[0-9]+$/, message: "Chỉ nhập số" },
                    min: { value: 1, message: "Số lượng phải > 0" },
                  })}
                  className="border px-2 py-1 rounded w-full"
                />
                {errors.variants?.[index]?.stock_quantity && (
                  <p className="text-red-500 text-sm">
                    {errors.variants[index].stock_quantity?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">Ảnh</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload}
                  className="border px-2 py-1 rounded w-full"
                />
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="mt-2 w-20 h-20 object-cover border rounded"
                  />
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
          );
        })}

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

      <div>
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Cập nhật sản phẩm
        </button>
      </div>
    </form>
  );
};

export default EditProduct;
