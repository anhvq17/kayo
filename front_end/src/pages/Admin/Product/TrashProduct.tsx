import { useEffect, useState } from "react"
import { RotateCcw, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import axios from "axios"

type Product = {
  _id: string
  name: string
  description: string
  priceDefault: number
  image: string
  categoryId: {
    _id: string
    name: string
  }
  brandId: {
    _id: string
    name: string
  }
  deletedAt: string
}

const TrashProduct = () => {
  const [trashedProducts, setTrashedProducts] = useState<Product[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    fetchTrashedProducts()
  }, [])

  const fetchTrashedProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/products/trash")
      setTrashedProducts(res.data.data)
      setSelectedIds([])
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm đã xóa:", error)
    }
  }

  const handleRestore = async (id: string) => {
    const confirm = window.confirm("Bạn có chắc muốn khôi phục sản phẩm này?")
    if (!confirm) return

    try {
      await axios.patch(`http://localhost:3000/products/restore/${id}`)
      alert("Khôi phục thành công")
      fetchTrashedProducts()
    } catch (error) {
      console.error("Lỗi khôi phục:", error)
      alert("Khôi phục thất bại")
    }
  }

  const handleHardDelete = async (id: string) => {
    const confirm = window.confirm("Bạn có chắc muốn xóa vĩnh viễn sản phẩm này?")
    if (!confirm) return

    try {
      await axios.delete(`http://localhost:3000/products/hard/${id}`)
      alert("Xóa vĩnh viễn thành công")
      fetchTrashedProducts()
    } catch (error) {
      console.error("Lỗi xóa vĩnh viễn:", error)
      alert("Xóa vĩnh viễn thất bại")
    }
  }

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleRestoreMany = async () => {
    if (selectedIds.length === 0) return

    const confirm = window.confirm(`Khôi phục ${selectedIds.length} sản phẩm đã chọn?`)
    if (!confirm) return

    try {
      await axios.patch("http://localhost:3000/products/restore-many", {
        ids: selectedIds,
      })
      alert("Khôi phục thành công")
      fetchTrashedProducts()
    } catch (error) {
      alert("Khôi phục thất bại")
    }
  }

  const handleHardDeleteMany = async () => {
    if (selectedIds.length === 0) return

    const confirm = window.confirm(`Xóa vĩnh viễn ${selectedIds.length} sản phẩm đã chọn?`)
    if (!confirm) return

    try {
      await axios.delete("http://localhost:3000/products/hard-delete-many", {
        data: { ids: selectedIds },
      })
      alert("Xóa vĩnh viễn thành công")
      fetchTrashedProducts()
    } catch (error) {
      alert("Xóa vĩnh viễn thất bại")
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      currency: "VND",
    }).format(price)
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">Thùng rác sản phẩm</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRestoreMany}
            disabled={selectedIds.length === 0}
            className={`px-3 h-8 rounded text-sm text-white transition ${
              selectedIds.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Khôi phục đã chọn ({selectedIds.length})
          </button>
          <button
            onClick={handleHardDeleteMany}
            disabled={selectedIds.length === 0}
            className={`px-3 h-8 rounded text-sm text-white transition ${
              selectedIds.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Xóa vĩnh viễn ({selectedIds.length})
          </button>
        </div>
      </div>

      <div className="flex gap-6 border-b my-4 text-base font-medium text-gray-500">
        <Link
          to="/admin/products"
          className="pb-2 hover:text-blue-500 hover:border-b-2 hover:border-blue-300"
        >
          Sản phẩm đang hoạt động
        </Link>
        <Link
          to="/admin/products/trash"
          className="pb-2 border-b-2 border-blue-500 text-blue-600"
        >
          Thùng rác
        </Link>
      </div>

      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="px-4 py-2 w-10"></th>
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Ảnh</th>
            <th className="px-4 py-2">Tên sản phẩm</th>
            <th className="px-4 py-2">Giá tiền</th>
            <th className="px-4 py-2">Danh mục</th>
            <th className="px-4 py-2">Thương hiệu</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {trashedProducts.map((item, index) => (
            <tr key={item._id} className="hover:bg-gray-50 border-b">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item._id)}
                  onChange={() => handleSelect(item._id)}
                  className="w-5 h-5 accent-blue-600"
                />
              </td>
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">
                <img
                  src={item.image || "/placeholder.svg?height=60&width=60"}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded border"
                />
              </td>
              <td className="px-4 py-2 max-w-[220px]">
                <div className="font-medium truncate">{item.name}</div>
                <div className="text-xs text-gray-500 truncate max-w-xs">{item.description}</div>
              </td>
              <td className="px-4 py-2 font-medium text-red-600">{formatPrice(item.priceDefault)}</td>
              <td className="px-4 py-2">
                <span className="px-2 py-1 font-semibold bg-orange-100 text-orange-700 rounded-full text-xs">
                  {item.categoryId?.name || "Không xác định"}
                </span>
              </td>
              <td className="px-4 py-2">
                <span className="px-2 py-1 font-semibold bg-green-100 text-green-700 rounded-full text-xs">
                  {item.brandId?.name || "Không xác định"}
                </span>
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-1">
                  <button
                    onClick={() => handleRestore(item._id)}
                    className="w-8 h-8 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <button
                    onClick={() => handleHardDelete(item._id)}
                    className="w-8 h-8 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TrashProduct