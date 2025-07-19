import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import type { AttributeValue, GroupedAttribute } from "../../../types/Product"

interface VariantDetail {
    _id: string
    price: number
    stock: number
    image?: string
    attributes: { attributeId: string; valueId: string }[]
}

const DetailProduct = () => {
    const { id: productId } = useParams()
    const [product, setProduct] = useState<any>(null)
    const [variants, setVariants] = useState<VariantDetail[]>([])
    const [attributes, setAttributes] = useState<GroupedAttribute[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!productId) return
        fetchProductDetails()
    }, [productId])

    const fetchProductDetails = async () => {
        try {
            setLoading(true)
            const productRes = await axios.get(`http://localhost:3000/products/${productId}`)
            setProduct(productRes.data.data)

            const variantRes = await axios.get(`http://localhost:3000/variant/product/${productId}`)
            const fetchedVariants = variantRes.data.data.map((variant: any) => ({
                _id: variant._id,
                price: variant.price,
                stock: variant.stock_quantity,
                image: variant.image,
                attributes: variant.attributes.map((attr: any) => ({
                    attributeId: typeof attr.attributeId === "string" ? attr.attributeId : attr.attributeId._id,
                    valueId: typeof attr.valueId === "string" ? attr.valueId : attr.valueId._id,
                })),
            }))
            setVariants(fetchedVariants)

            const attrRes = await axios.get("http://localhost:3000/attribute-value")
            const values: AttributeValue[] = attrRes.data.data

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
        } catch (err) {
            console.error("Lỗi khi lấy chi tiết sản phẩm:", err)
        } finally {
            setLoading(false)
        }
    }

    const getAttributeValue = (attributeId: string, valueId: string): string => {
        const group = attributes.find((g) => g.attributeId === attributeId)
        const val = group?.values.find((v) => v._id === valueId)
        return val?.value || "-"
    }

    if (loading) {
        return <div className="p-4">Đang tải chi tiết sản phẩm...</div>
    }

    if (!product) {
        return <div className="p-4 text-red-500">Không tìm thấy sản phẩm</div>
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-2xl space-y-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">
                Chi tiết sản phẩm
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="w-full">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto max-h-[500px] object-contain rounded-xl border border-gray-100 transition-transform duration-300 hover:scale-[1.02]"
                    />
                </div>
                <div className="space-y-5 text-gray-900">
                    <h3 className="text-2xl font-semibold text-blue-800 tracking-wide">{product.name}</h3>
                    <p className="flex items-center gap-3">
                        <span className="font-medium text-gray-600">Giá mặc định:</span>
                        <span className="text-red-600 font-semibold text-lg">
                            {Number(product.priceDefault).toLocaleString()}
                        </span>
                    </p>
                    <p className="flex items-center gap-3">
                        <span className="font-medium text-gray-600">Danh mục:</span>
                        <span className="text-gray-700">{product.categoryId?.name}</span>
                    </p>
                    <p className="flex items-center gap-3">
                        <span className="font-medium text-gray-600">Thương hiệu:</span>
                        <span className="text-gray-700">{product.brandId?.name}</span>
                    </p>
                    <p className="flex flex-col gap-1">
                        <span className="font-medium text-gray-600">Mô tả:</span>
                        <span className="text-gray-700 leading-relaxed">{product.description}</span>
                    </p>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 tracking-tight">Danh sách biến thể</h3>
                {variants.length === 0 ? (
                    <p className="text-gray-500 italic text-base">Chưa có biến thể nào</p>
                ) : (
                    <div className="overflow-x-auto border border-gray-100 rounded-xl">
                        <table className="min-w-full table-auto border-collapse bg-white">
                            <thead className="bg-gray-100 text-xs text-gray-600 font-medium uppercase">
                                <tr>
                                    <th className="border-b border-gray-200 px-6 py-3 text-left">#</th>
                                    {attributes.map((attr) => (
                                        <th key={attr.attributeId} className="border-b border-gray-200 px-6 py-3 text-left">
                                            {attr.name}
                                        </th>
                                    ))}
                                    <th className="border-b border-gray-200 px-6 py-3 text-left">Giá tiền</th>
                                    <th className="border-b border-gray-200 px-6 py-3 text-left">Tồn kho</th>
                                    <th className="border-b border-gray-200 px-6 py-3 text-left">Ảnh</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                                {variants.map((variant, index) => (
                                    <tr key={variant._id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="border-b border-gray-200 px-6 py-4">{index + 1}</td>
                                        {attributes.map((attr) => {
                                            const selected = variant.attributes.find((a) => a.attributeId === attr.attributeId);
                                            return (
                                                <td key={attr.attributeId} className="border-b border-gray-200 px-6 py-4">
                                                    {selected ? getAttributeValue(attr.attributeId, selected.valueId) : "-"}
                                                </td>
                                            );
                                        })}
                                        <td className="border-b border-gray-200 px-6 py-4 text-red-600 font-medium">
                                            {Number(variant.price).toLocaleString()}
                                        </td>
                                        <td className="border-b border-gray-200 px-6 py-4">{variant.stock}</td>
                                        <td className="border-b border-gray-200 px-6 py-4 text-center">
                                            {variant.image && (
                                                <img
                                                    src={variant.image}
                                                    alt={`Variant ${index + 1}`}
                                                    className="w-14 h-14 object-cover rounded-md mx-auto border border-gray-100"
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DetailProduct
