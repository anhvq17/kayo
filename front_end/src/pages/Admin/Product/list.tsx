// giữ tạm code cũ ở đây

import { Link } from "react-router-dom";
import { Edit, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const ProductManager = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("http://localhost:3000/products");
        setProducts(res.data.data);
      } catch (error) {
        console.error("❌ Lỗi khi lấy sản phẩm:", error);
      }
    };
    fetch();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await axios.delete(`http://localhost:3000/products/${id}`);
        setProducts(products.filter((p) => p._id !== id));
        alert("✅ Xóa thành công");
      } catch (err) {
        alert("❌ Xóa thất bại");
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Danh sách sản phẩm</h1>
        <Link to="/admin/products/add">
          <button className="w-8 h-8 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center">
            <Plus size={14} />
          </button>
        </Link>
      </div>

      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Tên</th>
            <th className="px-4 py-2">Danh mục</th>
            <th className="px-4 py-2">Thương hiệu</th>
            <th className="px-4 py-2">Thể tích (ml)</th>
            <th className="px-4 py-2">Hương vị</th>
            <th className="px-4 py-2">Tổng tồn kho</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, index) => {
            const volumes = p.variants?.map((v: any) => `${v.volume}ml`).join(", ") || "--";
            const flavors = p.variants?.map((v: any) => v.flavors).join(", ") || "--";
            const totalStock = p.variants?.reduce(
              (sum: number, v: any) => sum + Number(v.stock_quantity || 0),
              0
            ) || 0;

            return (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.categoryId?.name || "Chưa có"}</td>
                <td className="px-4 py-2">{p.brandId?.name || "Chưa có"}</td>
                <td className="px-4 py-2">{volumes}</td>
                <td className="px-4 py-2">{flavors}</td>
                <td className="px-4 py-2">{totalStock}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="w-8 h-8 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center"
                    >
                      <Trash size={14} />
                    </button>
                    <Link to={`/admin/products/edit/${p._id}`}>
                      <button className="w-8 h-8 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center">
                        <Edit size={14} />
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManager;
