import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Brand {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const BrandManager = () => {
  const [brands, setBrands] = useState<Brand[]>([]);

  async function getBrandList() {
    try {
      const { data } = await axios.get("http://localhost:3000/brands");
      setBrands(data.data);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lấy danh sách thương hiệu!");
    }
  }

  useEffect(() => {
    getBrandList();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xoá thương hiệu này?")) return;
    try {
      await axios.delete(`http://localhost:3000/brands/${id}`);
      alert("Xoá thành công");
      getBrandList();
    } catch (error) {
      alert("Lỗi khi xoá thương hiệu");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold mb-4">Danh sách thương hiệu</h1>
        <Link to="/dashboard/brands/add">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs">
            Thêm
          </button>
        </Link>
      </div>

      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Tên thương hiệu</th>
            <th className="px-4 py-2">Hình ảnh</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand, index) => (
            <tr key={brand._id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{brand.name}</td>
              <td className="px-4 py-2">
                <img src={brand.image} alt={brand.name} className="h-8" />
              </td>
              <td className="px-4 py-2 space-x-1">
                <button
                  onClick={() => handleDelete(brand._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs"
                >
                  Xoá
                </button>
                <Link to={`/dashboard/brands/edit/${brand._id}`}>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs">
                    Sửa
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BrandManager;
