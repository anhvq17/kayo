import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Edit, Plus } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  description: string;
  status: string; 
  createdAt: string;
  updatedAt: string;
}

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  async function getCategoryList() {
    try {
      const res = await axios.get("http://localhost:3000/categories");
      setCategories(res.data.data);
    } catch (error) {
      alert("Lỗi khi tải danh mục");
      console.error(error);
    }
  }

  // Hàm đổi trạng thái category
  async function toggleStatus(category: Category) {
    try {
      const newStatus = category.status === "activated" ? "inactivated" : "activated";
      await axios.patch(`http://localhost:3000/categories/${category._id}`, {
        status: newStatus,
      });
      getCategoryList(); // refresh danh sách
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái");
      console.error(error);
    }
  }

  useEffect(() => {
    getCategoryList();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold mb-4">Danh sách danh mục</h1>
        {/* <Link to="/admin/categories/add">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs">
            <Plus size={14}/>
          </button>
        </Link> */}
      </div>

      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Tên</th>
            <th className="px-4 py-2">Mô tả</th>
            <th className="px-4 py-2">Trạng thái</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                Không có danh mục nào.
              </td>
            </tr>
          ) : (
            categories.map((category, index) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{category.name}</td>
                <td className="px-4 py-2">{category.description}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => toggleStatus(category)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold ${category.status === "activated"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-400 text-gray-800 hover:bg-gray-500"
                      }`}
                    title="Nhấn để đổi trạng thái"
                  >
                    {category.status === "activated" ? "Activated" : "Inactivated"}
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
