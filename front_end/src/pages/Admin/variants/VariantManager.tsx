import React, { useEffect, useState } from 'react';
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
      <h1 className="text-3xl font-bold mb-6">Danh sách biến thể</h1>
      <Link to="/dashboard/variants/add">
        <button className="bg-blue-600 hover:bg-blue-700 transition text-white py-2 px-5 rounded mb-6">
          Thêm mới biến thể
        </button>
      </Link>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-5 border-b border-gray-300 text-center text-sm font-semibold text-gray-700">STT</th>
              <th className="py-3 px-5 border-b border-gray-300 text-center text-sm font-semibold text-gray-700">Ảnh</th>
              <th className="py-3 px-5 border-b border-gray-300 text-center text-sm font-semibold text-gray-700">Dung tích (ml)</th>
              <th className="py-3 px-5 border-b border-gray-300 text-center text-sm font-semibold text-gray-700">Giá</th>
              <th className="py-3 px-5 border-b border-gray-300 text-center text-sm font-semibold text-gray-700">Tồn kho</th>
              <th className="py-3 px-5 border-b border-gray-300 text-center text-sm font-semibold text-gray-700">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant, index) => (
              <tr key={variant.id || index} className="hover:bg-gray-100 even:bg-white odd:bg-gray-50">
                <td className="py-3 px-5 border-b border-gray-300 text-center text-sm">{index + 1}</td>
                <td className="py-3 px-5 border-b border-gray-300 text-center">
                  <img src={variant.image} alt="variant" className="mx-auto max-h-16 object-contain" />
                </td>
                <td className="py-3 px-5 border-b border-gray-300 text-center text-sm font-medium">{variant.volume} ml</td>
                <td className="py-3 px-5 border-b border-gray-300 text-center text-sm text-green-600 font-semibold">
                  {variant.price.toLocaleString()}₫
                </td>
                <td className="py-3 px-5 border-b border-gray-300 text-center text-sm">{variant.stock_quantity}</td>
                <td className="py-3 px-5 border-b border-gray-300 text-center space-x-2">
                  <Link to={`/dashboard/variants/${variant.id}`}>
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-4 rounded transition">Sửa</button>
                  </Link>
                  <button
                    onClick={() => deleteVariant(variant.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded transition"
                  >
                    Xóa
                  </button>
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
