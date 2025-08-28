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

type FilterType = "day" | "month" | "year";

export default function Dashboard() {
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartFilter, setChartFilter] = useState<FilterType>("day");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  
  // Khởi tạo giá trị mặc định
  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    setStartDate(yesterday.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

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

  const paidStatuses = ["Đã nhận hàng"];

  const validRevenueOrders = orders.filter(
    (order) => {
      // Đơn hàng đã hoàn tiền thì không tính
      if (order.paymentStatus === "Đã hoàn tiền") return false;
      
      // Đơn hàng VNPay đã thanh toán thành công
      if (order.paymentMethod === "vnpay" && order.paymentStatus === "Đã thanh toán") return true;
      
      // Đơn hàng COD đã nhận hàng
      if (paidStatuses.includes(order.orderStatus) && (order.isPaid === true || order.paymentStatus === "Đã thanh toán")) return true;
      
      return false;
    }
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
    "Đang giao hàng": orders.filter((o) => o.orderStatus === "Đang giao hàng").length,
    "Đã giao hàng": orders.filter((o) => o.orderStatus === "Đã giao hàng").length,
    "Đã nhận hàng": orders.filter((o) => o.orderStatus === "Đã nhận hàng").length,
    "Đã huỷ đơn hàng": orders.filter((o) => o.orderStatus === "Đã huỷ đơn hàng").length,
    "Đã hoàn hàng": orders.filter((o) => o.orderStatus === "Đã hoàn hàng").length,
    "Từ chối hoàn hàng": orders.filter((o) => o.orderStatus === "Từ chối hoàn hàng").length,
  };

  const STATUS_ORDER = [
    "Chờ xử lý",
    "Đã xử lý",
    "Đang giao hàng",
    "Đã giao hàng",
    "Đã nhận hàng",
    "Đã huỷ đơn hàng",
    "Đã hoàn hàng",
    "Từ chối hoàn hàng",
  ];

  const PIE_COLORS = [
    "#F59E0B",
    "#14B8A6", 
    "#8B5CF6", 
    "#22C55E", 
    "#3B82F6", 
    "#EF4444",
    "#10B981", 
    "#64748B", 
  ];

  const pieData = STATUS_ORDER.map((status, index) => ({
    name: status,
    value: statusStats[status as keyof typeof statusStats] || 0,
    fill: PIE_COLORS[index],
  }));

  // Hàm lọc đơn hàng theo khoảng thời gian
  const getFilteredOrders = () => {
    if (!startDate || !endDate) return validRevenueOrders;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Đặt thời gian cuối ngày
    
    return validRevenueOrders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= start && orderDate <= end;
    });
  };

    // Tạo dữ liệu cho biểu đồ theo khoảng thời gian
  const generateChartData = () => {
    const filteredOrders = getFilteredOrders();
    
    if (chartFilter === "day") {
      // Theo ngày trong khoảng thời gian
      const start = new Date(startDate);
      const end = new Date(endDate);
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      const dailyData = Array.from({ length: daysDiff }, (_, index) => {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + index);
        return {
          date: currentDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
          revenue: 0
        };
      });
      
      filteredOrders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        const dayIndex = Math.floor((orderDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (dayIndex >= 0 && dayIndex < daysDiff) {
          dailyData[dayIndex].revenue += order.originalAmount ?? order.totalAmount;
        }
      });
      
      return dailyData;
    } else if (chartFilter === "month") {
      // Theo tháng trong khoảng thời gian
      const start = new Date(startDate);
      const end = new Date(endDate);
      const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
      
      const monthlyData = Array.from({ length: monthsDiff }, (_, index) => {
        const currentDate = new Date(start);
        currentDate.setMonth(start.getMonth() + index);
        return {
          month: currentDate.toLocaleDateString("vi-VN", { month: "long", year: "numeric" }),
          revenue: 0
        };
      });
      
      filteredOrders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        const monthIndex = (orderDate.getFullYear() - start.getFullYear()) * 12 + (orderDate.getMonth() - start.getMonth());
        if (monthIndex >= 0 && monthIndex < monthsDiff) {
          monthlyData[monthIndex].revenue += order.originalAmount ?? order.totalAmount;
        }
      });
      
      return monthlyData;
    } else {
      // Theo năm trong khoảng thời gian
      const start = new Date(startDate);
      const end = new Date(endDate);
      const yearsDiff = end.getFullYear() - start.getFullYear() + 1;
      
      const yearlyData = Array.from({ length: yearsDiff }, (_, index) => {
        const currentYear = start.getFullYear() + index;
        return {
          year: `Năm ${currentYear}`,
          revenue: 0
        };
      });
      
      filteredOrders.forEach(order => {
        const orderYear = new Date(order.createdAt).getFullYear();
        const yearIndex = orderYear - start.getFullYear();
        if (yearIndex >= 0 && yearIndex < yearsDiff) {
          yearlyData[yearIndex].revenue += order.originalAmount ?? order.totalAmount;
        }
      });
      
      return yearlyData;
    }
  };

  const chartData = generateChartData();

  const getChartTitle = () => {
    const start = startDate ? new Date(startDate).toLocaleDateString("vi-VN") : "";
    const end = endDate ? new Date(endDate).toLocaleDateString("vi-VN") : "";
    
    switch (chartFilter) {
      case "day":
        return `Biểu đồ doanh thu theo ngày (${start} - ${end})`;
      case "month":
        return `Biểu đồ doanh thu theo tháng (${start} - ${end})`;
      case "year":
        return `Biểu đồ doanh thu theo năm (${start} - ${end})`;
      default:
        return "Biểu đồ doanh thu";
    }
  };

  const getXAxisLabel = () => {
    switch (chartFilter) {
      case "day":
        return "Ngày";
      case "month":
        return "Tháng";
      case "year":
        return "Năm";
      default:
        return "";
    }
  };

  const getPaymentMethodText = (method?: string) => {
    if (method === "cod") return "Thanh toán khi nhận hàng";
    if (method === "wallet") return "Thanh toán bằng Ví điện tử";
    if (method === "vnpay") return "Thanh toán qua VNPay";
    return "Không xác định";
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
      <h1 className="text-2xl font-bold">TỔNG QUAN</h1>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <p className="text-lg font-semibold">{getChartTitle()}</p>
          
          <div className="flex flex-wrap gap-3 mt-2 sm:mt-0">
            {/* Filter buttons */}
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setChartFilter("day")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  chartFilter === "day"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Ngày
              </button>
              <button
                onClick={() => setChartFilter("month")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  chartFilter === "month"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Tháng
              </button>
              <button
                onClick={() => setChartFilter("year")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  chartFilter === "year"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Năm
              </button>
            </div>

            {/* Date range inputs */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">đến</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={chartData} margin={{ top: 10, right: 20, bottom: 40, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={chartFilter === "day" ? "date" : chartFilter === "month" ? "month" : "year"} 
                label={{ value: getXAxisLabel(), position: "bottom", offset: 20 }}
              />
              <YAxis
                tickFormatter={(value) => value.toLocaleString("vi-VN")}
                width={110}
                label={{ value: "Doanh thu (VNĐ)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(value) => value.toLocaleString("vi-VN")}
                labelFormatter={(label) => {
                  if (chartFilter === "day") return `Ngày ${label}`;
                  if (chartFilter === "month") return `Tháng ${label}`;
                  return `Năm ${label}`;
                }}
              />
              <Bar 
                dataKey="revenue" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]} 
                barSize={50}
              />
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
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any) => [`${value} đơn`, name]}
              />
              <Legend
                content={() => (
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {STATUS_ORDER.map((status, index) => (
                      <div key={status} className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: PIE_COLORS[index] }}
                        />
                        <span className="text-sm text-gray-700">{status}</span>
                      </div>
                    ))}
                  </div>
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
              {[...orders]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{order._id}</td>
                  <td className="py-2">{order.userId?.username}</td>
                  <td className="py-2 text-red-600 font-semibold">
                    {(order.originalAmount ?? order.totalAmount).toLocaleString()}
                  </td>
                  <td className="py-2">{order.orderStatus}</td>
                  <td className="py-2">
                    {getPaymentMethodText(order.paymentMethod)}
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
    </div>
  );
}