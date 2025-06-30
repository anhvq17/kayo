import { useEffect, useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import AttributeSelector from "./AttributeSelector"
import { Trash2, Upload } from "lucide-react"
import type { AttributeValue, GroupedAttribute, ProductInput, VariantErrors, VariantInput } from "../../../types/Product"
import { validateVariantField, validateAllVariants } from "./validate"
import { areAttributesEqual } from "../../../utils/compareAttributes"

const AddProduct = () => {
  const [attributes, setAttributes] = useState<GroupedAttribute[]>([])
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: AttributeValue[] }>({})
  const [variants, setVariants] = useState<VariantInput[]>([])
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([])
  const [brands, setBrands] = useState<{ _id: string; name: string }[]>([])
  const [variantErrors, setVariantErrors] = useState<VariantErrors[]>([])
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [productImagePreview, setProductImagePreview] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [variantDuplicationError, setVariantDuplicationError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset, // Thêm reset method
  } = useForm<ProductInput>()

  const imageFile = watch("image")

  // Preview ảnh sản phẩm chính
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setProductImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setProductImagePreview("")
    }
  }, [imageFile])

  useEffect(() => {
    const fetchAttributes = async () => {
      const res = await axios.get("http://localhost:3000/attribute-value")
      const values: AttributeValue[] = res.data.data
      const grouped: { [key: string]: GroupedAttribute } = {}
      values.forEach((val) => {
        const attrId = val.attributeId._id
        if (!grouped[attrId]) {
          grouped[attrId] = {
            attributeId: attrId,
            name: val.attributeId.name,
            values: [],
          }
        }
        grouped[attrId].values.push(val)
      })
      setAttributes(Object.values(grouped))
    }

    const fetchMeta = async () => {
      const [catRes, brandRes] = await Promise.all([
        axios.get("http://localhost:3000/categories"),
        axios.get("http://localhost:3000/brands"),
      ])
      setCategories(catRes.data.data)
      setBrands(brandRes.data.data)
    }

    fetchAttributes()
    fetchMeta()
  }, [])

  const handleSelectValues = (attributeId: string, selectedIds: string[]) => {
    const group = attributes.find((a) => a.attributeId === attributeId)
    if (!group) return
    const selected = group.values.filter((val) => selectedIds.includes(val._id))
    setSelectedValues((prev) => ({ ...prev, [attributeId]: selected }))
  }

  const generateVariants = () => {
    const entries = Object.entries(selectedValues)
    const attrVals = entries.map(([_, vals]) => vals)
    if (attrVals.some((arr) => arr.length === 0)) return
    const cartesian = attrVals.reduce<AttributeValue[][]>(
      (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
      [[]],
    )
    const existingVariants = [...variants]
    const duplicatedVariants: string[] = []
    const addedVariants: VariantInput[] = []

    cartesian.forEach((combo) => {
      const attrs = combo.map((val) => ({
        attributeId: val.attributeId._id,
        valueId: val._id,
      }))

      const isDuplicate = existingVariants.some((v) => areAttributesEqual(v.attributes, attrs))
      if (isDuplicate) {
        duplicatedVariants.push(combo.map((v) => v.value).join(" - "))
        return
      }

      addedVariants.push({
        attributes: attrs,
        price: "",
        stock: "",
        image: null,
        imagePreview: "",
      })
    })

    if (addedVariants.length > 0) {
      setVariants((prev) => [...prev, ...addedVariants])
      setVariantErrors((prev) => [...prev, ...new Array(addedVariants.length).fill({})])
    }

    if (duplicatedVariants.length > 0) {
      setVariantDuplicationError(`Các biến thể sau đã tồn tại:\n- ${duplicatedVariants.join("\n- ")}`)
    } else {
      setVariantDuplicationError("")
    }
  }

  const handleVariantChange = (index: number, field: keyof VariantInput, value: any) => {
    setVariants((prev) => {
      const updated = [...prev]
      updated[index][field] = value

      // Nếu là file ảnh, tạo preview
      if (field === "image" && value) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setVariants((prevVariants) => {
            const updatedVariants = [...prevVariants]
            updatedVariants[index].imagePreview = reader.result as string
            return updatedVariants
          })
        }
        reader.readAsDataURL(value)
      }

      return updated
    })

    // Validate field immediately
    validateVariantField(variants, index, field, value, setVariantErrors)
  }

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index))
    setVariantErrors((prev) => prev.filter((_, i) => i !== index))
  }

  const canGenerateVariants = attributes.every((attr) => selectedValues[attr.attributeId]?.length > 0)

  // Upload ảnh lên Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "DATN_upload")

    const cloudRes = await axios.post("https://api.cloudinary.com/v1_1/dvourchjx/image/upload", formData)

    return cloudRes.data.secure_url
  }

  const onSubmit = async (data: ProductInput) => {
    setHasSubmitted(true)
    setIsUploading(true)

    //  Kiểm tra có biến thể không
    if (variants.length === 0) {
      alert("Bạn phải tạo ít nhất một biến thể.")
      setIsUploading(false)
      return
    }

    //  Kiểm tra biến thể có hợp lệ không
    const isVariantValid = validateAllVariants(variants, setVariantErrors)
    if (!isVariantValid) {
      alert("Vui lòng kiểm tra và sửa các lỗi trong biến thể.")
      setIsUploading(false)
      return
    }

    try {
      //  Upload ảnh sản phẩm chính nếu có
      let productImageUrl = ""
      if (data.image && data.image.length > 0) {
        console.log("Uploading product image to Cloudinary...")
        productImageUrl = await uploadToCloudinary(data.image[0])
        console.log("Product image uploaded:", productImageUrl)
      }

      //  Tạo sản phẩm trước
      const productData = {
        name: data.name,
        description: data.description,
        priceDefault: Number.parseFloat(data.priceDefault),
        categoryId: data.categoryId,
        brandId: data.brandId,
        image: productImageUrl,
      }

      console.log("Creating product with data:", productData)

      const productRes = await axios.post("http://localhost:3000/products", productData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      const productId = productRes.data.data._id
      console.log("Product created with ID:", productId)

      //  Tạo từng biến thể
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i]

        // Upload ảnh nếu có
        let variantImageUrl = ""
        if (variant.image) {
          console.log(`Uploading variant ${i + 1} image to Cloudinary...`)
          variantImageUrl = await uploadToCloudinary(variant.image)
          console.log(`Variant ${i + 1} image uploaded:`, variantImageUrl)
        }

        const variantData = {
          productId,
          price: Number.parseFloat(variant.price),
          stock_quantity: Number.parseInt(variant.stock),
          image: variantImageUrl,
          attributes: variant.attributes,
        }

        console.log(`Creating variant ${i + 1}:`, variantData)

        try {
          await axios.post("http://localhost:3000/variant", variantData, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          console.log(`Variant ${i + 1} created successfully`)
        } catch (variantError: any) {
          console.error(`Error creating variant ${i + 1}:`, variantError)
          if (variantError?.response?.data) {
            console.error("Variant error response:", variantError.response.data)
          }
          throw variantError
        }
      }

      //  Thành công
      alert("Tạo sản phẩm thành công!")

      //  Reset lại form
      setVariants([])
      setVariantErrors([])
      setSelectedValues({})
      setProductImagePreview("")
      setHasSubmitted(false)
      reset()

    } catch (error: any) {
      console.error("Error creating product:", error)
      if (error?.response?.data) {
        const errorMessage = error.response.data.message || error.response.data.error || "Lỗi không xác định"
        alert(`Tạo sản phẩm thất bại: ${errorMessage}`)
      } else if (error?.message) {
        alert(`Tạo sản phẩm thất bại: ${error.message}`)
      } else {
        alert("Tạo sản phẩm thất bại: Lỗi kết nối")
      }
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white space-y-6">
      <h2 className="text-xl font-semibold">Thêm sản phẩm với biến thể</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Tên sản phẩm <span className="text-red-500">*</span></label>
            <input
              {...register("name", { required: "Tên sản phẩm không được để trống" })}
              className="border rounded px-3 py-2 w-full"
              placeholder="Nhập tên sản phẩm"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">Giá mặc định <span className="text-red-500">*</span></label>
            <input
              {...register("priceDefault", {
                required: "Giá mặc định là bắt buộc",
                min: { value: 1, message: "Giá phải lớn hơn 0" },
              })}
              className="border rounded px-3 py-2 w-full"
              placeholder="VD: 1000000"
              type="number"
            />
            {errors.priceDefault && <p className="text-red-500 text-sm mt-1">{errors.priceDefault.message}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">Danh mục <span className="text-red-500">*</span></label>
            <select
              {...register("categoryId", { required: "Danh mục là bắt buộc" })}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">Thương hiệu <span className="text-red-500">*</span></label>
            <select
              {...register("brandId", { required: "Thương hiệu là bắt buộc" })}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">-- Chọn thương hiệu --</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
            {errors.brandId && <p className="text-red-500 text-sm mt-1">{errors.brandId.message}</p>}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Mô tả <span className="text-red-500">*</span></label>
          <textarea
            {...register("description", { required: "Mô tả là bắt buộc" })}
            className="border rounded px-3 py-2 w-full"
            placeholder="Nhập mô tả sản phẩm"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Ảnh sản phẩm <span className="text-red-500">*</span></label>
          <input
            type="file"
            {...register("image", {
              required: "Ảnh sản phẩm là bắt buộc",
              validate: {
                isValid: (fileList) =>
                  (fileList instanceof FileList && fileList.length > 0) || "Ảnh đại diện là bắt buộc",
              },
            })}
            accept="image/*"
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}

          {/* Preview ảnh sản phẩm */}
          {productImagePreview && (
            <div className="mt-2">
              <img
                src={productImagePreview || "/placeholder.svg"}
                alt="Preview"
                className="w-32 h-32 object-cover border rounded"
              />
            </div>
          )}
        </div>

        {/* --- Chọn thuộc tính --- */}
        <div>
          <h3 className="font-semibold mb-2">Chọn thuộc tính</h3>
          {attributes.map((attr) => (
            <AttributeSelector
              key={attr.attributeId}
              name={attr.name}
              attributeId={attr.attributeId}
              values={attr.values}
              selected={(selectedValues[attr.attributeId] || []).map((v) => v._id)}
              onChange={(ids) => handleSelectValues(attr.attributeId, ids)}
            />
          ))}
          <button
            type="button"
            onClick={generateVariants}
            className={`mt-2 px-4 py-2 rounded text-white ${canGenerateVariants ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
              }`}
            disabled={!canGenerateVariants}
          >
            Tạo biến thể
          </button>
          {variantDuplicationError && (
            <p className="text-red-500 text-sm whitespace-pre-line mb-2">
              {variantDuplicationError}
            </p>
          )}
        </div>

        {/* --- Danh sách biến thể --- */}
        <div>
          <h3 className="font-semibold mb-2">Danh sách biến thể</h3>

          {hasSubmitted && variants.length === 0 && (
            <p className="text-red-500 text-sm mt-2">Bạn phải tạo ít nhất một biến thể.</p>
          )}

          {variants.length > 0 && (
            <div className="overflow-x-auto">
              <table className="table-auto w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">#</th>
                    {attributes.map((attr) => (
                      <th key={attr.attributeId} className="border px-2 py-1">
                        {attr.name}
                      </th>
                    ))}
                    <th className="border px-2 py-1">Giá <span className="text-red-500">*</span></th>
                    <th className="border px-2 py-1">Số lượng <span className="text-red-500">*</span></th>
                    <th className="border px-2 py-1">Ảnh <span className="text-red-500">*</span></th>
                    <th className="border px-2 py-1">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v, i) => (
                    <tr key={i} className="text-center">
                      <td className="border px-2 py-1">{i + 1}</td>
                      {attributes.map((attr) => {
                        const foundAttr = v.attributes.find((a) => a.attributeId === attr.attributeId)
                        const foundVal = attr.values.find((val) => val._id === foundAttr?.valueId)
                        return (
                          <td key={attr.attributeId} className="border px-2 py-1">
                            {foundVal?.value}
                          </td>
                        )
                      })}
                      <td className="border px-2 py-1">
                        <div className="space-y-1">
                          <input
                            type="number"
                            value={v.price}
                            onChange={(e) => handleVariantChange(i, "price", e.target.value)}
                            className={`w-24 border px-1 py-1 rounded ${variantErrors[i]?.price ? "border-red-500" : "border-gray-300"}`}
                            placeholder="0"
                          />
                          {variantErrors[i]?.price && <p className="text-red-500 text-xs">{variantErrors[i].price}</p>}
                        </div>
                      </td>
                      <td className="border px-2 py-1">
                        <div className="space-y-1">
                          <input
                            type="number"
                            value={v.stock}
                            onChange={(e) => handleVariantChange(i, "stock", e.target.value)}
                            className={`w-20 border px-1 py-1 rounded ${variantErrors[i]?.stock ? "border-red-500" : "border-gray-300"}`}
                            placeholder="0"
                          />
                          {variantErrors[i]?.stock && <p className="text-red-500 text-xs">{variantErrors[i].stock}</p>}
                        </div>
                      </td>
                      <td className="border px-2 py-1">
                        <div className="space-y-1">
                          <input
                            type="file"
                            onChange={(e) => handleVariantChange(i, "image", e.target.files?.[0] || null)}
                            className={`text-xs ${variantErrors[i]?.image ? "text-red-500" : ""}`}
                            accept="image/*"
                          />
                          {variantErrors[i]?.image && <p className="text-red-500 text-xs">{variantErrors[i].image}</p>}

                          {/* Preview ảnh variant */}
                          {v.imagePreview && (
                            <div className="mt-1">
                              <img
                                src={v.imagePreview || "/placeholder.svg"}
                                alt="Variant preview"
                                className="w-16 h-16 object-cover border rounded"
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="border px-2 py-1">
                        <button
                          type="button"
                          onClick={() => removeVariant(i)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                          title="Xóa biến thể"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className={`px-4 py-2 rounded text-white transition-colors ${isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
        >
          {isUploading ? (
            <div className="flex items-center gap-2">
              <Upload className="animate-spin" size={16} />
              Đang tải lên...
            </div>
          ) : (
            "Lưu sản phẩm"
          )}
        </button>
      </form>
    </div>
  )
}

export default AddProduct