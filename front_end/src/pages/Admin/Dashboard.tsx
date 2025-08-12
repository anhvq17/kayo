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
  
  const today = new Date();
  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders.reduce(
    (sum, order) => sum + (order.originalAmount ?? order.totalAmount),
    0
  );
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.originalAmount ?? order.totalAmount),
    0
  );
  const newOrders = orders.filter(
    (order) => order.orderStatus === "Chờ xử lý"
  ).length;
  const completedOrders = orders.filter(
    (order) =>
      order.orderStatus === "Đã giao hàng" ||
      order.orderStatus === "Đã nhận hàng"
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

  const revenueByDate = orders.reduce((acc: Record<string, number>, order) => {
    const dateKey = new Date(order.createdAt).toLocaleDateString("vi-VN");
    acc[dateKey] =
      (acc[dateKey] || 0) + (order.originalAmount ?? order.totalAmount);
    return acc;
  }, {});

  const chartData = Object.entries(revenueByDate).map(([date, revenue]) => ({
    date,
    revenue,
  }));

const topCustomers = Object.values(
  orders.reduce((acc, order) => {
    if (!order.userId) return acc;

    const id = order.userId._id;
    const name = order.userId.username;
    const total = order.originalAmount ?? order.totalAmount ?? 0;

    if (!acc[id]) {
      acc[id] = { id, name, total: 0 };
    }
    acc[id].total += total;

    return acc;
  }, {} as Record<string, { id: string; name: string; total: number }>)
)
  .sort((a, b) => b.total - a.total)
  .slice(0, 5);

  const getRank = (total: number) => {
    if (total > 50000000) return "Vàng";
    if (total > 25000000) return "Bạc";
    return "Đồng";
  };

  const getRankColorClass = (rank: string) => {
    switch (rank) {
      case "Vàng":
        return "text-yellow-500 font-semibold";
      case "Bạc":
        return "text-gray-500 font-semibold";
      case "Đồng":
        return "text-orange-500 font-semibold";
      default:
        return "";
    }
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
      <h1 className="text-2xl font-bold">BẢNG ĐIỀU KHIỂN</h1>
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

      <div className="rounded-xl border bg-white shadow p-4">
        <p className="text-lg font-semibold mb-2">Biểu đồ doanh thu</p>
        <div className="h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                tickFormatter={(value) => value.toLocaleString("vi-VN")}
                width={110}
              />
              <Tooltip
                formatter={(value) => value.toLocaleString("vi-VN")}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={69}/>
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </div>

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
                label={({ name, value }) => `${name} (${value})`}
              >
                {Object.keys(statusStats).map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      [
                        "#f59e0b",
                        "#3b82f6",
                        "#10b981",
                        "#8b5cf6",
                        "#6b7280",
                        "#ef4444",
                      ][index % 6]
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any) => [`${value} đơn`, name]}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ marginRight: 20, marginTop: 30, display: "inline-block" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow p-4">
        <p className="text-lg font-semibold mb-2">Đơn hàng gần đây</p>
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
                  <td className="py-2">{order._id}</td>
                  <td className="py-2">{order.userId?.username}</td>
                  <td className="py-2 text-red-600 font-semibold">
                    {(
                      order.originalAmount ?? order.totalAmount
                    ).toLocaleString()}
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

      <div className="gap-6">
        <div className="rounded-xl border bg-white shadow p-4">
          <p className="text-lg font-semibold mb-2">
            Top khách hàng mua nhiều nhất
          </p>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Khách hàng</th>
                <th className="text-left py-2">Tổng chi tiêu</th>
                <th className="text-left py-2">Thứ hạng</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((c) => {
                const rank = getRank(c.total);
                return (
                  <tr key={c.id} className="border-b">
                    <td className="py-2">{c.name}</td>
                    <td className="py-2 text-red-600 font-bold">
                      {c.total.toLocaleString()}
                    </td>
                    <td className={`py-2 ${getRankColorClass(rank)}`}>{rank}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}