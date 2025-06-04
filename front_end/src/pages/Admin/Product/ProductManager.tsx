import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
  image?: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  categoryId: Category;  
  brandId: Brand;        
  status: string;
  quantity: number;
  flavors: string[];
  createdAt: string;
  updatedAt: string;
}

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get('http://localhost:3000/products');
        setProducts(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm', error);
      }
    }

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xoá sản phẩm này không?')) return;
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      alert('Xoá thành công');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      alert('Lỗi khi xoá sản phẩm');
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold mb-4">Danh sách sản phẩm</h1>
        <Link to="/dashboard/products/add">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs">
            Thêm
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
            <th className="px-4 py-2">Mô tả</th>
            <th className="px-4 py-2">Trạng thái</th>
            <th className="px-4 py-2">Số lượng</th>
            <th className="px-4 py-2">Mùi hương</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, index) => (
            <tr key={p._id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">{p.categoryId?.name || 'Chưa cập nhật'}</td>
              <td className="px-4 py-2">{p.brandId?.name || 'Chưa cập nhật'}</td>
              <td className="px-4 py-2">{p.description}</td>
              <td className="px-4 py-2">{p.status}</td>
              <td className="px-4 py-2">{p.quantity}</td>
              <td className="px-4 py-2">{p.flavors.join(', ')}</td>
              <td className="px-4 py-2 space-x-1">
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-600 mb-1 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                >
                  Xoá
                </button>
                {/* Nút sửa có thể thêm như sau */}
                <Link to={`/dashboard/products/edit/${p._id}`}>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs">
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

export default ProductManager;
