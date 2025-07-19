import { useState, useEffect } from "react";
import { BarChart, LineChart, Users, Package, ShoppingCart } from "lucide-react";
import { getAllOrders } from "../../services/Order";
import type { Order } from "../../types/Order";

interface OrderWithUser extends Omit<Order, 'userId'> {
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
}

export default function Dashboard() {
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.originalAmount ?? order.totalAmount), 0);
  const totalRevenue = orders.reduce((sum, order) => sum + (order.originalAmount ?? order.totalAmount), 0);
  const newOrders = orders.filter(order => order.orderStatus === 'Chờ xử lý').length;
  const completedOrders = orders.filter(order => 
    order.orderStatus === 'Đã giao hàng' || order.orderStatus === 'Đã nhận hàng'
  ).length;

  const statusStats = {
    'Chờ xử lý': orders.filter(o => o.orderStatus === 'Chờ xử lý').length,
    'Đã xử lý': orders.filter(o => o.orderStatus === 'Đã xử lý').length,
    'Đang giao hàng': orders.filter(o => o.orderStatus === 'Đang giao hàng').length,
    'Đã giao hàng': orders.filter(o => o.orderStatus === 'Đã giao hàng').length,
    'Đã nhận hàng': orders.filter(o => o.orderStatus === 'Đã nhận hàng').length,
    'Đã huỷ đơn hàng': orders.filter(o => o.orderStatus === 'Đã huỷ đơn hàng').length,
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchOrders}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Bảng điều khiển</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-xl border bg-white shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500">Ngày hôm nay</p>
            <p className="text-xl font-semibold">{todayRevenue.toLocaleString()}</p>
          </div>
          <LineChart className="w-6 h-6 text-blue-500" />
        </div>

        <div className="rounded-xl border bg-white shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500">Tổng doanh thu</p>
            <p className="text-xl font-semibold">{totalRevenue.toLocaleString()}</p>
          </div>
          <LineChart className="w-6 h-6 text-indigo-500" />
        </div>

        <div className="rounded-xl border bg-white shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500">Đơn hàng mới</p>
            <p className="text-xl font-semibold">{newOrders}</p>
          </div>
          <ShoppingCart className="w-6 h-6 text-green-500" />
        </div>

        <div className="rounded-xl border bg-white shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500">Tổng đơn hàng</p>
            <p className="text-xl font-semibold">{orders.length}</p>
          </div>
          <Package className="w-6 h-6 text-yellow-500" />
        </div>

        <div className="rounded-xl border bg-white shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500">Đã giao hàng</p>
            <p className="text-xl font-semibold">{completedOrders}</p>
          </div>
          <Users className="w-6 h-6 text-purple-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-white shadow p-4">
          <p className="text-lg font-semibold mb-2">Thống kê đơn hàng</p>
          <div className="h-56 bg-gray-100 flex items-center justify-center rounded-md">
            <BarChart className="w-12 h-12 text-gray-400" />
            <span className="ml-2 text-gray-500">Biểu đồ thống kê</span>
          </div>
        </div>

        <div className="rounded-xl border bg-white shadow p-4">
          <p className="text-lg font-semibold mb-4">Tình trạng đơn hàng</p>
          <ul className="space-y-3">
            <li className="flex items-center justify-between bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-md">
              <span className="text-yellow-700 font-medium">Chờ xử lý</span>
              <span className="font-semibold text-yellow-700">{statusStats['Chờ xử lý']}</span>
            </li>
            <li className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-2 rounded-md">
              <span className="text-blue-700 font-medium">Đã xử lý</span>
              <span className="font-semibold text-blue-700">{statusStats['Đã xử lý']}</span>
            </li>
            <li className="flex items-center justify-between bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-md">
              <span className="text-indigo-700 font-medium">Đang giao hàng</span>
              <span className="font-semibold text-indigo-700">{statusStats['Đang giao hàng']}</span>
            </li>
            <li className="flex items-center justify-between bg-green-50 border border-green-200 px-4 py-2 rounded-md">
              <span className="text-green-700 font-medium">Đã giao hàng</span>
              <span className="font-semibold text-green-700">{statusStats['Đã giao hàng']}</span>
            </li>
            <li className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-md">
              <span className="text-emerald-700 font-medium">Đã nhận hàng</span>
              <span className="font-semibold text-emerald-700">{statusStats['Đã nhận hàng']}</span>
            </li>
            <li className="flex items-center justify-between bg-red-50 border border-red-200 px-4 py-2 rounded-md">
              <span className="text-red-700 font-medium">Đã huỷ</span>
              <span className="font-semibold text-red-700">{statusStats['Đã huỷ đơn hàng']}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow p-4">
        <p className="text-lg font-semibold mb-4">Đơn hàng gần đây</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Mã đơn hàng</th>
                <th className="text-left py-2">Khách hàng</th>
                <th className="text-left py-2">Tổng tiền</th>
                <th className="text-left py-2">Trạng thái</th>
                <th className="text-left py-2">Phương thức thanh toán</th>
                <th className="text-left py-2">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-medium">{order._id}</td>
                  <td className="py-2">{order.fullName}</td>
                  <td className="py-2 text-red-600 font-semibold">{(order.originalAmount ?? order.totalAmount).toLocaleString()}</td>
                  <td className="py-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      order.orderStatus === 'Đã giao hàng' || order.orderStatus === 'Đã nhận hàng' ? 'bg-green-100 text-green-800' :
                      order.orderStatus === 'Chờ xử lý' || order.orderStatus === 'Đã xử lý' ? 'bg-yellow-100 text-yellow-800' :
                      order.orderStatus === 'Đang giao hàng' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-2">
                    {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán qua VNPay'}
                  </td>
                  <td className="py-2 text-gray-500">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}