import { useEffect, useState } from "react"
import { Edit, Trash, Plus, Eye } from "lucide-react"
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
}

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 5

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/products")
      setProducts(res.data.data)
      setSelectedIds([])
      setCurrentPage(1)
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error)
    }
  }

  const handleSoftDelete = async (id: string) => {
    const confirm = window.confirm("Bạn có chắc muốn xóa sản phẩm này?")
    if (!confirm) return

    try {
      await axios.delete(`http://localhost:3000/products/soft/${id}`)
      alert("Đã chuyển các sản phẩm và biến thể vào thùng rác")
      fetchProducts()
    } catch (error) {
      console.error("Lỗi xóa mềm:", error)
      alert("Xóa thất bại")
    }
  }

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSoftDeleteMany = async () => {
    if (selectedIds.length === 0) return

    const confirm = window.confirm(`Xóa ${selectedIds.length} sản phẩm đã chọn?`)
    if (!confirm) return

    try {
      await axios.delete("http://localhost:3000/products/soft-delete-many", {
        data: { ids: selectedIds },
      })
      alert("Đã chuyển các sản phẩm và biến thể vào thùng rác")
      fetchProducts()
    } catch (error) {
      alert("Xóa thất bại")
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      currency: "VND",
    }).format(price)
  }

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(products.length / productsPerPage)

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">Danh sách sản phẩm</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSoftDeleteMany}
            disabled={selectedIds.length === 0}
            className={`px-3 h-8 rounded text-sm text-white transition ${
              selectedIds.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Xóa đã chọn ({selectedIds.length})
          </button>
          <Link to="/admin/products/add">
            <button className="w-8 h-8 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center">
              <Plus size={14} />
            </button>
          </Link>
        </div>
      </div>

      <div className="flex gap-6 border-b my-4 text-base font-medium text-gray-500">
        <Link
          to="/admin/products"
          className="pb-2 border-b-2 border-blue-500 text-blue-600"
        >
          Sản phẩm đang hoạt động
        </Link>
        <Link
          to="/admin/products/trash"
          className="pb-2 hover:text-blue-500 hover:border-b-2 hover:border-blue-300"
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
          {currentProducts.map((item, index) => (
            <tr key={item._id} className="hover:bg-gray-50 border-b">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item._id)}
                  onChange={() => handleSelect(item._id)}
                  className="w-5 h-5 accent-blue-600"
                />
              </td>
              <td className="px-4 py-2">{indexOfFirstProduct + index + 1}</td>
              <td className="px-4 py-2">
                <img
                  src={item.image || "/placeholder.svg?height=60&width=60"}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded border"
                />
              </td>
              <td className="px-4 py-2 max-w-[220px]">
                <div className="font-medium truncate">{item.name}</div>
                <div className="text-xs text-gray-500 truncate max-w-xs">
                  {item.description}
                </div>
              </td>
              <td className="px-4 py-2 font-medium text-red-600">
                {formatPrice(item.priceDefault)}
              </td>
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
                  <Link to={`/admin/products/${item._id}`}>
                    <button className="w-8 h-8 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center justify-center">
                      <Eye size={14} />
                    </button>
                  </Link>
                  <Link to={`/admin/products/edit/${item._id}`}>
                    <button className="w-8 h-8 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center">
                      <Edit size={14} />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleSoftDelete(item._id)}
                    className="w-8 h-8 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  )
}

export default ProductManager
