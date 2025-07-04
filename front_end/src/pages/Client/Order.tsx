import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrdersByUser } from '../../services/Order';
import type { Order } from '../../types/Order';

const OrderList = () => {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const data = await getOrdersByUser(user._id);
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processed': return 'Đã xử lý';
      case 'shipping': return 'Đang giao hàng';
      case 'shipped': return 'Đã giao hàng';
      case 'delivered': return 'Đã nhận hàng';
      case 'cancelled': return 'Đã huỷ đơn hàng';
      default: return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cod': return 'Thanh toán khi nhận hàng';
      case 'vnpay': return 'Thanh toán qua VNPay';
      default: return method;
    }
  };

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
              <th className="px-4 py-2 border">Phương thức thanh toán</th>
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
                <tr key={item._id}>
                  <td className="px-4 py-2 border">{item._id}</td>
                  <td className="px-4 py-2 border">{item.totalAmount.toLocaleString()}₫</td>
                  <td className="px-4 py-2 border">{getPaymentMethodText(item.paymentMethod)}</td>
                  <td className="px-4 py-2 border">{new Date(item.createdAt).toLocaleString("vi-VN")}</td>
                  <td className="px-4 py-2 border">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.status === 'paid' ? 'bg-green-100 text-green-800' :
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      item.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    <Link to={`/orders/${item._id}`} className="text-blue-500 underline">Xem</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">Danh sách trống</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
