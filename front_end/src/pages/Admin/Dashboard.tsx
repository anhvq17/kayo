import { useState, useEffect } from "react";
import { Users, Package, ShoppingCart } from "lucide-react";
import { getAllOrders } from "../../services/Order";
import type { Order } from "../../types/Order";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

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
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // tháng hiện tại

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

  // Lọc đơn hàng theo tháng được chọn
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate.getMonth() + 1 === selectedMonth;
  });

  const today = new Date();
  const todayOrders = filteredOrders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.originalAmount ?? order.totalAmount), 0);
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.originalAmount ?? order.totalAmount), 0);
  const newOrders = filteredOrders.filter(order => order.orderStatus === 'Chờ xử lý').length;
  const completedOrders = filteredOrders.filter(order =>
    order.orderStatus === 'Đã giao hàng' || order.orderStatus === 'Đã nhận hàng'
  ).length;

  const statusStats = {
    'Chờ xử lý': filteredOrders.filter(o => o.orderStatus === 'Chờ xử lý').length,
    'Đã xử lý': filteredOrders.filter(o => o.orderStatus === 'Đã xử lý').length,
    'Đang giao hàng': filteredOrders.filter(o => o.orderStatus === 'Đang giao hàng').length,
    'Đã giao hàng': filteredOrders.filter(o => o.orderStatus === 'Đã giao hàng').length,
    'Đã nhận hàng': filteredOrders.filter(o => o.orderStatus === 'Đã nhận hàng').length,
    'Đã huỷ đơn hàng': filteredOrders.filter(o => o.orderStatus === 'Đã huỷ đơn hàng').length,
  };

  // === Tạo dữ liệu cho biểu đồ ===
  const revenueByDate = filteredOrders.reduce((acc: Record<string, number>, order) => {
    const dateKey = new Date(order.createdAt).toLocaleDateString("vi-VN");
    acc[dateKey] = (acc[dateKey] || 0) + (order.originalAmount ?? order.totalAmount);
    return acc;
  }, {});

  const chartData = Object.entries(revenueByDate).map(([date, revenue]) => ({
    date,
    revenue,
  }));

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

      {/* Bộ lọc tháng */}
      <div className="flex items-center gap-4">
        <label className="font-medium">Chọn tháng:</label>
        <select
          className="border px-3 py-1 rounded"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
            <option key={month} value={month}>
              Tháng {month}
            </option>
          ))}
        </select>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-xl border bg-white shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500">Ngày hôm nay</p>
            <p className="text-xl font-semibold">{todayRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="rounded-xl border bg-white shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500">Tổng doanh thu</p>
            <p className="text-xl font-semibold">{totalRevenue.toLocaleString()}</p>
          </div>
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
            <p className="text-xl font-semibold">{filteredOrders.length}</p>
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

      {/* Bar Chart */}
      <div className="rounded-xl border bg-white shadow p-4">
        <p className="text-lg font-semibold mb-2">Biểu đồ doanh thu</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => value.toLocaleString("vi-VN") + " ₫"} />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trạng thái đơn hàng */}
      <div className="rounded-xl border bg-white shadow p-4">
        <p className="text-lg font-semibold mb-4">Tình trạng đơn hàng</p>
        <ul className="space-y-3">
          {Object.entries(statusStats).map(([status, count]) => (
            <li key={status} className="flex items-center justify-between bg-gray-50 border px-4 py-2 rounded-md">
              <span className="font-medium">{status}</span>
              <span className="font-semibold">{count}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Đơn hàng gần đây */}
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
              {filteredOrders.slice(0, 5).map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-medium">{order._id}</td>
                  <td className="py-2">{order.fullName}</td>
                  <td className="py-2 text-red-600 font-semibold">{(order.originalAmount ?? order.totalAmount).toLocaleString()}</td>
                  <td className="py-2">{order.orderStatus}</td>
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
