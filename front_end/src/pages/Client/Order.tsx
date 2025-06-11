import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface OrderItem {
  id: string;
  price: number;
  content: string;
  creatAt: string;
  status: string;
  details: string;
}

const Order = () => {
  const [orderList, setOrderList] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/');
        if (Array.isArray(data)) {
          setOrderList(data);
        }
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm">
        <Link to="/" className="text-gray-500 hover:text-gray-900">Trang chủ</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-black">Danh sách đơn hàng</span>
      </div>

      <div className="mx-auto mt-10 text-center">
        <h1 className="text-3xl font-bold">DANH SÁCH ĐƠN HÀNG</h1>
      </div>

      <div className="mx-8 my-10">
        <table className="min-w-full table-auto border-2 border-gray-400 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2 border">Mã đơn hàng</th>
              <th className="px-4 py-2 border">Tổng tiền</th>
              <th className="px-4 py-2 border">Nội dung</th>
              <th className="px-4 py-2 border">Ngày tạo</th>
              <th className="px-4 py-2 border">Tình trạng</th>
              <th className="px-4 py-2 border">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-blue-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-red-500">
                  {error}
                </td>
              </tr>
            ) : orderList.length > 0 ? (
              orderList.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 border">{item.id}</td>
                  <td className="px-4 py-2 border">{item.price}</td>
                  <td className="px-4 py-2 border">{item.content}</td>
                  <td className="px-4 py-2 border">{item.creatAt}</td>
                  <td className="px-4 py-2 border">{item.status}</td>
                  <td className="px-4 py-2 border">{item.details}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500 min-h-[200px] h-[200px] align-middle">
                  Danh sách trống
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;