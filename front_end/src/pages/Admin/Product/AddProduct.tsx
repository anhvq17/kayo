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
    setValue,
    watch,
    setError,
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

        // Lọc chỉ những danh mục đang "activated"
        const activeCategories = cateRes.data.data.filter((c: any) => c.status === "activated");

        setCategories(activeCategories);
        setBrands(brandRes.data.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục hoặc thương hiệu:", err);
      }
    };

    // Gọi 1 lần khi vào trang
    fetchData();

    // tự cập nhật lại danh mục 
    const handleFocus = () => fetchData();
    window.addEventListener("focus", handleFocus);

    // Dọn sự kiện khi rời component
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);


  const onSubmit = async (data: FormData) => {
    let productId = "";

    try {
      const productRes = await axios.post("http://localhost:3000/products", {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        brandId: data.brandId,
      });

      productId = productRes.data.data._id;
      let hasError = false;

      for (let index = 0; index < data.variants.length; index++) {
        const variant = data.variants[index];
        try {
          await axios.post("http://localhost:3000/variant", {
            productId,
            ...variant,
            volume: Number(variant.volume),
            price: Number(variant.price),
            stock_quantity: Number(variant.stock_quantity),
          });
        } catch (err: any) {
          hasError = true;

          const msg =
            err.response?.data?.message ||
            "Có lỗi xảy ra khi thêm biến thể.";

          setError(`variants.${index}.volume`, {
            type: "server",
            message: msg,
          });
        }
      }

      if (hasError) {
        //  Xóa sản phẩm nếu biến thể lỗi
        await axios.delete(`http://localhost:3000/products/${productId}`);
        alert(" Có lỗi khi thêm biến thể");
      } else {
        alert(" Thêm sản phẩm và biến thể thành công!");
        reset();
      }
    } catch (error: any) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      alert(" Thêm sản phẩm thất bại.");
    }
  };


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto p-6 bg-white space-y-6"
    >
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
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Danh mục và thương hiệu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">
            <span className="text-red-500">*</span> Danh mục
          </label>
          <select
            {...register("categoryId", { required: "Chọn danh mục" })}
            className="w-full border rounded px-3 py-2">
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cate) => (
              <option key={cate._id} value={cate._id}>
                {cate.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (<p className="text-red-500 text-sm">{errors.categoryId.message}</p>
          )}
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
          {errors.brandId && (
            <p className="text-red-500 text-sm">{errors.brandId.message}</p>
          )}
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
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Biến thể sản phẩm */}
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
              const imageUrl = res.data.secure_url;
              setValue(`variants.${index}.image`, imageUrl);
            } catch (error) {
              alert(" Upload ảnh thất bại");
            }
          };

          return (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4"
            >
              <div>
                <label className="block font-medium mb-1">Hương vị</label>
                <input
                  {...register(`variants.${index}.flavors`, {
                    required: "Nhập hương vị",
                  })}
                  placeholder="Hương vị"
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
                  placeholder="Thể tích"
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
                  placeholder="Giá"
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
                  placeholder="Số lượng"
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

                {/* input ẩn để lưu URL ảnh */}
                <input
                  type="hidden"
                  {...register(`variants.${index}.image`, {
                    required: "Nhập ảnh"
                  })}
                />

                {/* input file dùng để upload ảnh - KHÔNG dùng register */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload}
                  className="border px-2 py-1 rounded w-full"
                />

                {/* Hiển thị ảnh preview nếu đã có */}
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="mt-2 w-20 h-20 object-cover border rounded"
                  />
                )}

                {/* Thông báo lỗi nếu thiếu ảnh */}
                {errors.variants?.[index]?.image && (
                  <p className="text-red-500 text-sm">
                    {errors.variants[index].image?.message}
                  </p>
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

      {/* Nút submit */}
      <div>
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Thêm sản phẩm
        </button>
      </div>
    </form>
  );
};

export default AddProduct;
