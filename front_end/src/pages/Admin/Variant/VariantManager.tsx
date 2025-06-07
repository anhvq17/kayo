import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface IVariant {
  id: string; 
  productId: string;
  volume: number;
  price: number;
  stock_quantity: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const VariantManager = () => {
  const [variants, setVariants] = useState<IVariant[]>([]);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/variants');
        setVariants(data);
      } catch (error) {
        console.error('Lỗi lấy danh sách biến thể:', error);
      }
    };
    fetchVariants();
  }, []);

  const deleteVariant = async (id: string) => {
    try {
      if (confirm('Bạn có chắc muốn xóa biến thể này?')) {
        await axios.delete(`http://localhost:3000/variants/${id}`);
        setVariants(variants.filter(variant => variant.id !== id));
        alert('Xóa thành công');
      }
    } catch (error) {
      alert('Xóa thất bại');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold mb-4">Danh sách biến thể</h1>
        <Link to={`/admin/variants/add`}>
          <button className="border bg-blue-600 hover:bg-blue-700 text-white hover:text-white px-3 py-1 rounded-md text-xs transition duration-200">Thêm</button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead>
            <tr className="bg-black text-white text-left">
              <th className="py-2 px-3 border-b">ID</th>
              <th className="py-2 px-3 border-b">Hình ảnh</th>
              <th className="py-2 px-3 border-b">Dung tích</th>
              <th className="py-2 px-3 border-b">Giá tiền</th>
              <th className="py-2 px-3 border-b">Tồn kho</th>
              <th className="py-2 px-3 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant, index) => (
              <tr key={variant.id || index} className="hover:bg-gray-100 even:bg-white odd:bg-gray-50">
                <td className="py-2 px-3 border-b border-gray-300 text-sm">{index + 1}</td>
                <td className="py-2 px-3 border-b border-gray-300">
                  <img src={variant.image} className="h-8" />
                </td>
                <td className="py-2 px-3 border-b border-gray-300 text-sm font-medium">{variant.volume} ml</td>
                <td className="py-2 px-3 border-b border-gray-300 text-sm text-red-600 font-semibold">
                  {variant.price.toLocaleString()}
                </td>
                <td className="py-2 px-3 border-b border-gray-300 text-sm">{variant.stock_quantity}</td>
                <td className="py-2 px-3 border-b border-gray-300 space-x-1">
                  <button
                    onClick={() => deleteVariant(variant.id)}
                    className="border bg-red-600 hover:bg-red-700 text-white hover:text-white px-3 py-1 rounded-md text-xs transition duration-200"
                  >
                    Xóa
                  </button>
                  <Link to={`/admin/variants/edit/${variant.id}`}>
                    <button className="border bg-green-600 hover:bg-green-700 text-white hover:text-white px-3 py-1 rounded-md text-xs transition duration-200">Sửa</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VariantManager;