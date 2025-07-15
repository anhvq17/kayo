import { useState, useEffect } from "react";
import { getAllOrders } from "../../../services/Order";
import type { Order } from "../../../types/Order";

interface OrderWithUser extends Omit<Order, 'userId'> {
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
}

const OrderReport = () => {
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [statusFilter, setStatusFilter] = useState('all');

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

  // Lọc đơn hàng theo ngày và trạng thái
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const startDate = dateRange.startDate ? new Date(dateRange.startDate) : null;
    const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;

    const matchesDate = (!startDate || orderDate >= startDate) && 
                       (!endDate || orderDate <= endDate);
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;

    return matchesDate && matchesStatus;
  });

  // Tính toán thống kê
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = filteredOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const statusStats = {
    'Chờ xử lý': filteredOrders.filter(o => o.orderStatus === 'Chờ xử lý').length,
    'Đã xử lý': filteredOrders.filter(o => o.orderStatus === 'Đã xử lý').length,
    'Đang giao hàng': filteredOrders.filter(o => o.orderStatus === 'Đang giao hàng').length,
    'Đã giao hàng': filteredOrders.filter(o => o.orderStatus === 'Đã giao hàng').length,
    'Đã nhận hàng': filteredOrders.filter(o => o.orderStatus === 'Đã nhận hàng').length,
    'Đã huỷ đơn hàng': filteredOrders.filter(o => o.orderStatus === 'Đã huỷ đơn hàng').length,
  };

  const exportToCSV = () => {
    const headers = [
      'Mã đơn hàng',
      'Khách hàng',
      'Số điện thoại',
      'Địa chỉ',
      'Tổng tiền',
      'Trạng thái đơn hàng',
      'Trạng thái thanh toán',
      'Phương thức thanh toán',
      'Ngày tạo'
    ];

    const csvData = filteredOrders.map(order => [
      order._id,
      order.fullName,
      order.phone,
      `${order.address.detail}, ${order.address.ward}, ${order.address.district}, ${order.address.province}`,
      order.totalAmount,
      order.orderStatus,
      order.paymentStatus,
      order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán qua VNPay',
      new Date(order.createdAt).toLocaleString("vi-VN")
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bao-cao-don-hang-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
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
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <span role="img" aria-label="report">📊</span> Báo cáo đơn hàng
        </h2>
        <button
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition duration-200"
        >
          Xuất CSV
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-4">Bộ lọc</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đến ngày
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="Chờ xử lý">Chờ xử lý</option>
              <option value="Đã xử lý">Đã xử lý</option>
              <option value="Đang giao hàng">Đang giao hàng</option>
              <option value="Đã giao hàng">Đã giao hàng</option>
              <option value="Đã nhận hàng">Đã nhận hàng</option>
              <option value="Đã huỷ đơn hàng">Đã huỷ đơn hàng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{totalOrders}</div>
          <div className="text-sm text-gray-600">Tổng đơn hàng</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">₫{totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Tổng doanh thu</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">₫{averageOrderValue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Giá trị trung bình</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-orange-600">
            {filteredOrders.filter(o => o.paymentStatus === 'Đã thanh toán').length}
          </div>
          <div className="text-sm text-gray-600">Đã thanh toán</div>
        </div>
      </div>

      {/* Thống kê theo trạng thái */}
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-4">Thống kê theo trạng thái</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(statusStats).map(([status, count]) => (
            <div key={status} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-800">{count}</div>
              <div className="text-sm text-gray-600">{status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Danh sách đơn hàng ({filteredOrders.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thanh toán</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{order.fullName}</div>
                        <div className="text-gray-500">{order.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                      ₫{order.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        order.orderStatus === 'Đã giao hàng' || order.orderStatus === 'Đã nhận hàng' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'Chờ xử lý' || order.orderStatus === 'Đã xử lý' ? 'bg-yellow-100 text-yellow-800' :
                        order.orderStatus === 'Đang giao hàng' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        order.paymentStatus === 'Đã thanh toán' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Không có dữ liệu phù hợp với bộ lọc
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderReport; 