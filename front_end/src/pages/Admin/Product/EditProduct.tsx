import { useEffect, useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import AttributeSelector from "./AttributeSelector"
import { Trash2, Upload } from "lucide-react"
import type { AttributeValue, GroupedAttribute, VariantInput, VariantErrors, ProductInput } from "../../../types/Product"
import { validateVariantField, validateAllVariants } from "./validate"
import { useNavigate } from "react-router-dom"

const EditProduct = () => {
  const navigate = useNavigate()
  // Lấy productId từ URL (giả sử URL có dạng /admin/products/edit/:id)
  const getProductIdFromUrl = () => {
    const path = window.location.pathname
    const segments = path.split("/")
    return segments[segments.length - 1] // Lấy segment cuối cùng
  }

  const [productId] = useState(() => getProductIdFromUrl())
  const [attributes, setAttributes] = useState<GroupedAttribute[]>([])
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: AttributeValue[] }>({})
  const [variants, setVariants] = useState<VariantInput[]>([])
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([])
  const [brands, setBrands] = useState<{ _id: string; name: string }[]>([])
  const [variantErrors, setVariantErrors] = useState<VariantErrors[]>([])
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [productImagePreview, setProductImagePreview] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [attributesLoaded, setAttributesLoaded] = useState(false)
  const [variantDuplicationError, setVariantDuplicationError] = useState<string>("")
  const [originalVariantIds, setOriginalVariantIds] = useState<string[]>([]) // xóa biến thể


  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
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
    }
  }, [imageFile])

  // Fetch initial data (attributes, categories, brands)
  useEffect(() => {
    // Kiểm tra productId có hợp lệ không
    if (!productId || productId === "edit" || productId === "add") {
      alert("ID sản phẩm không hợp lệ")
      window.location.href = "/admin/products"
      return
    }

    fetchInitialData()
  }, [productId])

  // Fetch product details khi attributes đã được load
  useEffect(() => {
    if (attributesLoaded && attributes.length > 0) {
      console.log("Attributes loaded, now fetching product details...")
      console.log("Loaded attributes:", attributes)
      fetchProductDetails(attributes);
    }
  }, [attributesLoaded, attributes])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      console.log("Fetching data for product ID:", productId)

      // Fetch attributes, categories, brands
      const [attributeRes, categoryRes, brandRes] = await Promise.all([
        axios.get("http://localhost:3000/attribute-value"),
        axios.get("http://localhost:3000/categories"),
        axios.get("http://localhost:3000/brands"),
      ])

      // Group attributes
      const values: AttributeValue[] = attributeRes.data.data
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

      const groupedAttributes = Object.values(grouped)
      console.log("Grouped attributes:", groupedAttributes)

      setAttributes(groupedAttributes)
      setCategories(categoryRes.data.data)
      setBrands(brandRes.data.data)

      // Đánh dấu attributes đã được load
      setAttributesLoaded(true)
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error)
      alert("Không thể tải dữ liệu sản phẩm")
      setLoading(false)
    }
  }

  const fetchProductDetails = async (currentAttributes: GroupedAttribute[]) => {
    try {
      console.log("Fetching product details for ID:", productId)
      console.log("Using attributes:", currentAttributes)

      // Fetch product info
      const productRes = await axios.get(`http://localhost:3000/products/${productId}`)
      const product = productRes.data.data

      console.log("Product data:", product)

      // Set form values
      setValue("name", product.name)
      setValue("description", product.description)
      setValue("priceDefault", product.priceDefault.toString())
      setValue("categoryId", product.categoryId._id)
      setValue("brandId", product.brandId._id)
      setProductImagePreview(product.image)

      // Lấy tất cả variants
      try {
        const variantRes = await axios.get(`http://localhost:3000/variant/product/${productId}`)
        const existingVariants = variantRes.data.data

        console.log("Variants data:", existingVariants)

        // Convert variants to VariantInput format
        const convertedVariants: VariantInput[] = existingVariants.map((variant: any) => ({
          _id: variant._id,
          attributes: variant.attributes.map((attr: any) => ({
            attributeId: typeof attr.attributeId === "string" ? attr.attributeId : attr.attributeId._id,
            valueId: typeof attr.valueId === "string" ? attr.valueId : attr.valueId._id,
          })),
          price: variant.price.toString(),
          stock: variant.stock_quantity.toString(),
          image: null,
          imagePreview: variant.image,
        }))
        console.log("convertedVariants:", convertedVariants);

        setVariants(convertedVariants)
        setOriginalVariantIds(existingVariants.map((v: any) => v._id)) // lưu lại ID các variant cũ
        setVariantErrors(new Array(convertedVariants.length).fill(0).map(() => ({})))


        // Set selected attribute values based on existing variants
        const selectedAttrs: { [key: string]: AttributeValue[] } = {}

        existingVariants.forEach((variant: any) => {
          variant.attributes.forEach((attr: any) => {
            const attrId = attr.attributeId
            const valueId = attr.valueId

            console.log("Processing attribute:", attrId, "value:", valueId)

            // Find the attribute value using currentAttributes parameter
            const attrGroup = currentAttributes.find((a) => a.attributeId === attrId)
            console.log("Found attribute group:", attrGroup)

            if (attrGroup) {
              const attrValue = attrGroup.values.find((v) => v._id === valueId)
              console.log("Found attribute value:", attrValue)

              if (attrValue) {
                if (!selectedAttrs[attrId]) {
                  selectedAttrs[attrId] = []
                }
                if (!selectedAttrs[attrId].find((v) => v._id === valueId)) {
                  selectedAttrs[attrId].push(attrValue)
                }
              }
            }
          })
        })

        console.log("Final selected attributes:", selectedAttrs)
        setSelectedValues(selectedAttrs)
      } catch (variantError) {
        console.log("Không có variants hoặc lỗi khi tải variants:", variantError)
        // Không có variants thì để trống
        setVariants([])
        setVariantErrors([])
        setSelectedValues({})
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết sản phẩm:", error)
      alert("Không thể tải chi tiết sản phẩm. Vui lòng kiểm tra ID sản phẩm.")
      window.location.href = "/admin/products"
    } finally {
      setLoading(false)
    }
  }

  const handleSelectValues = (attributeId: string, selectedIds: string[]) => {
    const group = attributes.find((a) => a.attributeId === attributeId)
    if (!group) return
    const selected = group.values.filter((val) => selectedIds.includes(val._id))
    setSelectedValues((prev) => ({ ...prev, [attributeId]: selected }))
  }

  function cartesianProduct(arr: AttributeValue[][]): AttributeValue[][] {
    return arr.reduce(
      (a, b) => a.flatMap((d) => b.map((e) => [...d, e])),
      [[]] as AttributeValue[][]
    );
  }

  function areAttributesEqual(a1: VariantInput["attributes"], a2: VariantInput["attributes"]): boolean {
    if (a1.length !== a2.length) return false;
    const sortById = (arr: any[]) => [...arr].sort((a, b) => a.attributeId.localeCompare(b.attributeId));
    const sorted1 = sortById(a1);
    const sorted2 = sortById(a2);
    return sorted1.every((attr, i) =>
      attr.attributeId === sorted2[i].attributeId && attr.valueId === sorted2[i].valueId
    );
  }

  const generateVariants = () => {
    const entries = Object.entries(selectedValues)
    const attrVals = entries.map(([_, vals]) => vals)
    if (attrVals.some((arr) => arr.length === 0)) return

    const cartesian = cartesianProduct(attrVals)

    const newVariants: VariantInput[] = []
    const duplicatedVariants: string[] = []

    cartesian.forEach((combo) => {
      const attrs = combo.map((val) => ({
        attributeId: val.attributeId._id,
        valueId: val._id,
      }))

      const isDuplicate = variants.some((v) => areAttributesEqual(v.attributes, attrs))

      if (isDuplicate) {
        // Mô tả lỗi trùng
        const comboLabel = combo.map((v) => v.value).join(" - ")
        duplicatedVariants.push(comboLabel)
        return
      }

      newVariants.push({
        attributes: attrs,
        price: "",
        stock: "",
        image: null,
        imagePreview: "",
      })
    })

    if (newVariants.length > 0) {
      setVariants((prev) => [...prev, ...newVariants])
      setVariantErrors((prev) => [...prev, ...new Array(newVariants.length).fill(0).map(() => ({}))])
    }

    if (duplicatedVariants.length > 0) {
      const message = `Các biến thể sau đã tồn tại và không được tạo lại:\n- ${duplicatedVariants.join("\n- ")}`
      setVariantDuplicationError(message)
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

    if (variants.length === 0) {
      alert("Bạn phải tạo ít nhất một biến thể.")
      setIsUploading(false)
      return
    }

    if (!validateAllVariants(variants, setVariantErrors)) {
      alert("Vui lòng kiểm tra và sửa các lỗi trong biến thể.")
      setIsUploading(false)
      return
    }

    try {
      // Upload ảnh sản phẩm chính nếu có thay đổi
      let productImageUrl = productImagePreview
      if (data.image && data.image.length > 0) {
        console.log("Uploading product image to Cloudinary...")
        productImageUrl = await uploadToCloudinary(data.image[0])
        console.log("Product image uploaded:", productImageUrl)
      }

      // Update product
      const productData = {
        name: data.name,
        description: data.description,
        priceDefault: Number.parseFloat(data.priceDefault),
        categoryId: data.categoryId,
        brandId: data.brandId,
        image: productImageUrl,
      }

      console.log("Updating product with data:", productData)
      await axios.put(`http://localhost:3000/products/${productId}`, productData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      // Xử lý từng biến thể: update nếu có _id, tạo mới nếu không
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i]

        // Upload ảnh nếu có file mới
        let variantImageUrl = variant.imagePreview || ""
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

        if (variant._id) {
          // Cập nhật biến thể cũ
          await axios.put(`http://localhost:3000/variant/${variant._id}`, variantData, {
            headers: { "Content-Type": "application/json" },
          })
          console.log(`Updated variant ${i + 1}`)
        } else {
          // Thêm mới biến thể
          await axios.post("http://localhost:3000/variant", variantData, {
            headers: { "Content-Type": "application/json" },
          })
          console.log(`Created variant ${i + 1}`)
        }
      }

      //  Xử lý xóa những biến thể đã bị loại khỏi danh sách hiện tại
      const currentVariantIds = variants.filter(v => v._id).map(v => v._id)
      const deletedVariantIds = originalVariantIds.filter(id => !currentVariantIds.includes(id))

      for (const variantId of deletedVariantIds) {
        try {
          await axios.delete(`http://localhost:3000/variant/soft/${variantId}`)
          console.log(`Deleted variant ${variantId}`)
        } catch (deleteError) {
          console.error(`Error deleting variant ${variantId}:`, deleteError)
        }
      }

      alert("Cập nhật sản phẩm thành công!")
      navigate("/admin/products")
    } catch (error: any) {
      console.error("Error updating product:", error)
      if (error?.response?.data) {
        const errorMessage = error.response.data.message || error.response.data.error || "Lỗi không xác định"
        alert(`Cập nhật sản phẩm thất bại: ${errorMessage}`)
      } else if (error?.message) {
        alert(`Cập nhật sản phẩm thất bại: ${error.message}`)
      } else {
        alert("Cập nhật sản phẩm thất bại: Lỗi kết nối")
      }
    } finally {
      setIsUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Đang tải dữ liệu sản phẩm ID: {productId}...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Chỉnh sửa sản phẩm</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name", { required: "Tên sản phẩm không được để trống" })}
              className="border rounded px-3 py-2 w-full"
              placeholder="Nhập tên sản phẩm"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">
              Giá mặc định <span className="text-red-500">*</span>
            </label>
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
            <label className="block font-medium mb-1">
              Danh mục <span className="text-red-500">*</span>
            </label>
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
            <label className="block font-medium mb-1">
              Thương hiệu <span className="text-red-500">*</span>
            </label>
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
          <label className="block font-medium mb-1">
            Mô tả <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("description", { required: "Mô tả là bắt buộc" })}
            className="border rounded px-3 py-2 w-full"
            placeholder="Nhập mô tả sản phẩm"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Ảnh sản phẩm</label>
          <input type="file" {...register("image")} accept="image/*" />
          <p className="text-sm text-gray-500 mt-1">Để trống nếu không muốn thay đổi ảnh</p>

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
          <h3 className="font-semibold mb-2">
            Chọn thuộc tính <span className="text-red-500">*</span>
          </h3>
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
            Tạo lại biến thể
          </button>
          {variantDuplicationError && (
            <pre className="text-red-500 text-sm whitespace-pre mt-2">{variantDuplicationError}</pre>
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
                    <th className="border px-2 py-1">
                      Giá <span className="text-red-500">*</span>
                    </th>
                    <th className="border px-2 py-1">
                      Số lượng <span className="text-red-500">*</span>
                    </th>
                    <th className="border px-2 py-1">Ảnh</th>
                    <th className="border px-2 py-1">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v, i) => (
                    <tr key={i} className="text-center">
                      <td className="border px-2 py-1">{i + 1}</td>
                      {attributes.map((attr) => {
                        const foundAttr = v.attributes.find(
                          (a) => a.attributeId?.toString() === attr.attributeId?.toString()
                        )
                        const foundVal = attr.values.find(
                          (val) => val._id?.toString() === foundAttr?.valueId?.toString()
                        )
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
                            className="text-xs"
                            accept="image/*"
                          />
                          <p className="text-xs text-gray-500">Để trống nếu không đổi</p>

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
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isUploading}
            className={`px-4 py-2 rounded text-white transition-colors ${isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <Upload className="animate-spin" size={16} />
                Đang cập nhật...
              </div>
            ) : (
              "Cập nhật sản phẩm"
            )}
          </button>

          <a href="/admin/products">
            <button type="button" className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
              Hủy
            </button>
          </a>
        </div>
      </form>
    </div>
  )
}

export default EditProduct
