import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Edit, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
  description: string;
  status: string;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

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

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  async function getCategoryList() {
    try {
      const res = await axios.get("http://localhost:3000/categories");
      setCategories(res.data.data);
      toast.success("Tải danh sách danh mục thành công!", { duration: 2000 });
    } catch (error: unknown) {
      console.error("Lỗi khi tải danh mục:", error);
      const msg =
        error instanceof Error && "response" in error
          ? (error as any).response?.data?.message || "Lỗi khi tải danh mục"
          : "Lỗi khi tải danh mục";
      toast.error(msg, { duration: 2000 });
    }
  }

  async function toggleStatus(category: Category) {
    const newStatus = category.status === "activated" ? "inactivated" : "activated";
    const confirmed = await confirmToast(
      `Bạn có chắc muốn ${newStatus === "activated" ? "kích hoạt" : "tạm khóa"} danh mục ${category.name}?`
    );
    if (!confirmed) return;

    try {
      await axios.patch(`http://localhost:3000/categories/${category._id}`, {
        status: newStatus,
      });
      toast.success(`Đã ${newStatus === "activated" ? "kích hoạt" : "tạm khóa"} danh mục ${category.name}!`, {
        duration: 2000,
      });
      await getCategoryList();
    } catch (error: unknown) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      const msg =
        error instanceof Error && "response" in error
          ? (error as any).response?.data?.message || "Lỗi khi cập nhật trạng thái"
          : "Lỗi khi cập nhật trạng thái";
      toast.error(msg, { duration: 2000 });
    }
  }

  useEffect(() => {
    getCategoryList();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold mb-4">Danh sách danh mục</h1>
      </div>

      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Tên</th>
            <th className="px-4 py-2">Mô tả</th>
            <th className="px-4 py-2 text-center">Số sản phẩm</th>
            <th className="px-4 py-2">Trạng thái</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                Không có danh mục nào.
              </td>
            </tr>
          ) : (
            categories.map((category, index) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{category.name}</td>
                <td className="px-4 py-2">{category.description}</td>
                <td className="px-4 py-2 text-center">{category.productCount ?? 0}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => toggleStatus(category)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold ${
                      category.status === "activated"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                    title="Nhấn để đổi trạng thái"
                  >
                    {category.status === "activated" ? "Hoạt động" : "Tạm khóa"}
                  </button>
                </td>
                <td className="px-4 py-2">
                  <Link to={`/admin/categories/edit/${category._id}`}>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs">
                      <Edit size={14} />
                    </button>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryManager;