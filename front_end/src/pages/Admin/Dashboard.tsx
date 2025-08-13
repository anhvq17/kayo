import { useState, useEffect } from "react";
import {
  LineChart as LucideLineChart,
  Users,
  Package,
  ShoppingCart,
} from "lucide-react";
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
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface OrderWithUser extends Omit<Order, "userId"> {
  [x: string]: any;
  userId: {
    _id: string;
    username: string;
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
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  // Các trạng thái đơn hàng được tính vào doanh thu
  const paidStatuses = ["Đã giao hàng", "Đã nhận hàng"];

  // Lọc đơn hợp lệ để tính doanh thu
  const validRevenueOrders = orders.filter(
    (order) =>
      paidStatuses.includes(order.orderStatus) &&
      (order.isPaid === true || order.paymentStatus === "Đã thanh toán")
  );

  const today = new Date();
  const todayOrders = validRevenueOrders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders.reduce(
    (sum, order) => sum + (order.originalAmount ?? order.totalAmount),
    0
  );
  const totalRevenue = validRevenueOrders.reduce(
    (sum, order) => sum + (order.originalAmount ?? order.totalAmount),
    0
  );

  const newOrders = orders.filter(
    (order) => order.orderStatus === "Chờ xử lý"
  ).length;
  const completedOrders = orders.filter((order) =>
    paidStatuses.includes(order.orderStatus)
  ).length;

  const statusStats = {
    "Chờ xử lý": orders.filter((o) => o.orderStatus === "Chờ xử lý").length,
    "Đã xử lý": orders.filter((o) => o.orderStatus === "Đã xử lý").length,
    "Đang giao hàng": orders.filter((o) => o.orderStatus === "Đang giao hàng")
      .length,
    "Đã giao hàng": orders.filter((o) => o.orderStatus === "Đã giao hàng")
      .length,
    "Đã nhận hàng": orders.filter((o) => o.orderStatus === "Đã nhận hàng")
      .length,
    "Đã huỷ đơn hàng": orders.filter((o) => o.orderStatus === "Đã huỷ đơn hàng")
      .length,
  };

  // === Tạo dữ liệu cho biểu đồ Bar từ đơn hợp lệ ===
  const revenueByDate = validRevenueOrders.reduce(
    (acc: Record<string, number>, order) => {
      const dateKey = new Date(order.createdAt).toLocaleDateString("vi-VN");
      acc[dateKey] =
        (acc[dateKey] || 0) + (order.originalAmount ?? order.totalAmount);
      return acc;
    },
    {}
  );

  const chartData = Object.entries(revenueByDate).map(([date, revenue]) => ({
    date,
    revenue,
  }));

  // === Top 5 khách hàng (từ đơn hợp lệ) ===
  const topCustomers = Object.values(
    validRevenueOrders.reduce((acc, order) => {
      const id = order.userId._id;
      const name = order.userId.username;
      const total = order.originalAmount ?? order.totalAmount;
      if (!acc[id]) {
        acc[id] = { id, name, total: 0 };
      }
      acc[id].total += total;
      return acc;
    }, {} as Record<string, { id: string; name: string; total: number }>)
  )
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // === Top 5 sản phẩm (từ đơn hợp lệ) ===
  const topProducts = Object.values(
    validRevenueOrders.reduce((acc, order) => {
      order.orderItems?.forEach(
        (item: {
          productId: {
            _id: string;
            name: string;
          };
          quantity: number;
        }) => {
          const pid: string = item.productId._id;
          const pname: string = item.productId.name;
          if (!acc[pid]) {
            acc[pid] = { id: pid, name: pname, quantity: 0 };
          }
          acc[pid].quantity += item.quantity;
        }
      );
      return acc;
    }, {} as Record<string, { id: string; name: string; quantity: number }>)
  )
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

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
            <p className="text-xl font-semibold">
              {todayRevenue.toLocaleString()}
            </p>
          </div>
          <LucideLineChart className="w-6 h-6 text-blue-500" />
        </div>

        <div className="rounded-xl border bg-white shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500">Tổng doanh thu</p>
            <p className="text-xl font-semibold">
              {totalRevenue.toLocaleString()}
            </p>
          </div>
          <LucideLineChart className="w-6 h-6 text-indigo-500" />
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

      {/* Biểu đồ doanh thu (Bar) */}
      <div className="rounded-xl border bg-white shadow p-4">
        <p className="text-lg font-semibold mb-2">Biểu đồ doanh thu (Bar)</p>
        <div className="h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                tickFormatter={(value) => value.toLocaleString("vi-VN") + "đ"}
                width={110}
              />
              <Tooltip
                formatter={(value) => value.toLocaleString("vi-VN") + " ₫"}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Biểu đồ tròn */}
      <div className="rounded-xl border bg-white shadow p-4 mt-6">
        <p className="text-lg font-semibold mb-2">
          Tỷ lệ đơn hàng theo trạng thái
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={Object.entries(statusStats).map(([status, count]) => ({
                  name: status,
                  value: count,
                }))}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                // label={({ name, value }) => `${name} (${value})`}
              >
                {Object.keys(statusStats).map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      [
                        "#3b82f6",
                        "#10b981",
                        "#f59e0b",
                        "#8b5cf6",
                        "#ef4444",
                        "#6b7280",
                      ][index % 6]
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any) => [`${value} đơn`, name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trạng thái đơn hàng */}
      <div className="rounded-xl border bg-white shadow p-4">
        <p className="text-lg font-semibold mb-4">Tình trạng đơn hàng</p>
        <ul className="space-y-3">
          {Object.entries(statusStats).map(([status, count]) => (
            <li
              key={status}
              className="flex items-center justify-between bg-gray-50 border px-4 py-2 rounded-md"
            >
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
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-medium">{order._id}</td>
                  <td className="py-2">{order.userId.username}</td>
                  <td className="py-2 text-red-600 font-semibold">
                    {(order.originalAmount ?? order.totalAmount).toLocaleString()}
                  </td>
                  <td className="py-2">{order.orderStatus}</td>
                  <td className="py-2">
                    {order.paymentMethod === "cod"
                      ? "Thanh toán khi nhận hàng"
                      : "Thanh toán qua VNPay"}
                  </td>
                  <td className="py-2 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 5 khách hàng */}
      <div className="gap-6">
        <div className="rounded-xl border bg-white shadow p-4">
          <p className="text-lg font-semibold mb-4">
            Top 5 khách hàng mua nhiều nhất
          </p>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Khách hàng</th>
                <th className="text-left py-2">Tổng chi tiêu</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="py-2">{c.name}</td>
                  <td className="py-2 text-red-600 font-semibold">
                    {c.total.toLocaleString()} ₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
