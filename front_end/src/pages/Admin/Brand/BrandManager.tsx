import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Edit, Plus, Trash } from "lucide-react";

interface Brand {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const BrandManager = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
      if ((currentPage - 1) * itemsPerPage >= brands.length - 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      alert("Lỗi khi xoá thương hiệu");
      console.error(error);
    }
  };

  const totalPages = Math.ceil(brands.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = brands.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold mb-4">Danh sách thương hiệu</h1>
        <Link to="/admin/brands/add">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs">
            <Plus size={14} />
          </button>
        </Link>
      </div>

      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Tên</th>
            <th className="px-4 py-2">Hình ảnh</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((brand, index) => (
              <tr key={brand._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{indexOfFirstItem + index + 1}</td>
                <td className="px-4 py-2">{brand.name}</td>
                <td className="px-4 py-2">
                  <img src={brand.image} alt={brand.name} className="h-8" />
                </td>
                <td className="px-4 py-2 space-x-1">
                  <button
                    onClick={() => handleDelete(brand._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs"
                  >
                    <Trash size={14} />
                  </button>
                  <Link to={`/admin/brands/edit/${brand._id}`}>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs">
                      <Edit size={14} />
                    </button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4">Không có thương hiệu nào.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center mt-4 gap-2">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default BrandManager;