import { useEffect, useState } from "react";
import { RotateCcw, Trash2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

// Custom confirm
const confirmToast = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    toast.custom((t) => (
      <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200 max-w-md w-full mx-auto animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-600" size={24} />
          <h3 className="text-lg font-semibold text-gray-800">Xác nhận hành động</h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
            onClick={() => {
              toast.dismiss(t);
              resolve(false);
            }}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            onClick={() => {
              toast.dismiss(t);
              resolve(true);
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    ), {
      duration: 0,
      position: "top-center",
      style: { background: "transparent", padding: 0, border: "none" },
    });
  });
};

type Product = {
  _id: string;
  name: string;
  description: string;
  priceDefault: number;
  image: string;
  categoryId: {
    _id: string;
    name: string;
  };
  brandId: {
    _id: string;
    name: string;
  };
  deletedAt: string;
};

const TrashProduct = () => {
  const [trashedProducts, setTrashedProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchTrashedProducts();
  }, []);

  const fetchTrashedProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/products/trash");
      setTrashedProducts(res.data.data);
      setSelectedIds([]);
    } catch (error: unknown) {
      console.error("Lỗi khi lấy danh sách sản phẩm đã xóa:", error);
      toast.error("Lỗi khi lấy danh sách sản phẩm đã xóa", { duration: 2000 });
    }
  };

  const handleRestore = async (id: string) => {
    const confirmed = await confirmToast("Bạn có chắc muốn khôi phục sản phẩm này?");
    if (!confirmed) return;

    toast.promise(
      axios.patch(`http://localhost:3000/products/restore/${id}`),
      {
        loading: "Đang khôi phục sản phẩm...",
        success: () => {
          fetchTrashedProducts();
          return "Khôi phục thành công";
        },
        error: (error: unknown) => {
          console.error("Lỗi khôi phục:", error);
          return "Khôi phục thất bại";
        },
        duration: 2000,
      }
    );
  };

  const handleHardDelete = async (id: string) => {
    const confirmed = await confirmToast("Bạn có chắc muốn xóa vĩnh viễn sản phẩm này?");
    if (!confirmed) return;

    toast.promise(
      axios.delete(`http://localhost:3000/products/hard/${id}`),
      {
        loading: "Đang xóa vĩnh viễn sản phẩm...",
        success: () => {
          fetchTrashedProducts();
          return "Xóa vĩnh viễn thành công";
        },
        error: (error: unknown) => {
          console.error("Lỗi xóa vĩnh viễn:", error);
          return "Xóa vĩnh viễn thất bại";
        },
        duration: 2000,
      }
    );
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRestoreMany = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = await confirmToast(`Khôi phục ${selectedIds.length} sản phẩm đã chọn?`);
    if (!confirmed) return;

    toast.promise(
      axios.patch("http://localhost:3000/products/restore-many", {
        ids: selectedIds,
      }),
      {
        loading: "Đang khôi phục các sản phẩm...",
        success: () => {
          fetchTrashedProducts();
          return "Khôi phục thành công";
        },
        error: (error: unknown) => {
          console.error("Lỗi khôi phục nhiều:", error);
          return "Khôi phục thất bại";
        },
        duration: 2000,
      }
    );
  };

  const handleHardDeleteMany = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = await confirmToast(`Xóa vĩnh viễn ${selectedIds.length} sản phẩm đã chọn?`);
    if (!confirmed) return;

    toast.promise(
      axios.delete("http://localhost:3000/products/hard-delete-many", {
        data: { ids: selectedIds },
      }),
      {
        loading: "Đang xóa vĩnh viễn các sản phẩm...",
        success: () => {
          fetchTrashedProducts();
          return "Xóa vĩnh viễn thành công";
        },
        error: (error: unknown) => {
          console.error("Lỗi xóa vĩnh viễn nhiều:", error);
          return "Xóa vĩnh viễn thất bại";
        },
        duration: 2000,
      }
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      currency: "VND",
    }).format(price);
  };

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
          {trashedProducts.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-4">
                Không có sản phẩm trong thùng rác
              </td>
            </tr>
          ) : (
            trashedProducts.map((item, index) => (
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TrashProduct;
