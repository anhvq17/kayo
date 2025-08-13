import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getAllOrders, updateOrder } from "../../../services/Order";
import type { Order } from "../../../types/Order";

interface OrderWithUser extends Omit<Order, 'userId'> {
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
}

const getStatusBadge = (status: string) => {
  let color = '';
  switch (status) {
    case 'Đã giao hàng': 
    case 'Đã nhận hàng': 
      color = 'bg-green-100 text-green-800'; 
      break;
    case 'Chờ xử lý': 
    case 'Đã xử lý': 
      color = 'bg-yellow-100 text-yellow-800'; 
      break;
    case 'Đang giao hàng': 
      color = 'bg-blue-100 text-blue-800'; 
      break;
    case 'Đã huỷ đơn hàng': 
      color = 'bg-red-100 text-red-800'; 
      break;
    default: 
      color = 'bg-gray-100 text-gray-800';
  }
  return <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{status}</span>;
};

const getPaymentStatusText = (status: string) => {
  if (status === 'paid' || status === 'Đã thanh toán') return 'Đã thanh toán';
  if (status === 'unpaid' || status === 'Chưa thanh toán') return 'Chưa thanh toán';
  if (status === 'Đã hoàn tiền') return 'Đã hoàn tiền';
  return status;
};

const getPaymentBadge = (paymentStatus: string) => {
  const statusText = getPaymentStatusText(paymentStatus);
  let badgeClass = 'bg-yellow-100 text-yellow-800';
  
  if (statusText === 'Đã thanh toán') {
    badgeClass = 'bg-green-100 text-green-800';
  } else if (statusText === 'Đã hoàn tiền') {
    badgeClass = 'bg-blue-100 text-blue-800';
  }
  
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
      {statusText}
    </span>
  );
};

const getPaymentMethodText = (method: string) => {
  switch (method) {
    case 'cod': return 'Thanh toán khi nhận hàng (COD)';
    case 'vnpay': return 'Thanh toán online (VNPay)';
    case 'wallet': return 'Thanh toán bằng Ví điện tử';
    default: return method;
  }
};

const OrderManager = () => {
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [processingReturnId, setProcessingReturnId] = useState<string | null>(null);
  const [returnAction, setReturnAction] = useState<'approve' | 'reject'>('approve');
  const didMountRef = useRef(false);

  useEffect(() => {
    fetchOrders();
    didMountRef.current = true;
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && didMountRef.current) {
        fetchOrders();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const canCancelOrder = (orderStatus: string) => {
    return orderStatus === 'Chờ xử lý' || orderStatus === 'Đã xử lý';
  };

  const canProcessReturn = (orderStatus: string) => {
    return orderStatus === 'Yêu cầu hoàn hàng';
  };

  const handleCancelOrder = async () => {
    if (!selectedOrderId || !cancelReason.trim()) return;

    try {
      setCancellingOrderId(selectedOrderId);
      const order = orders.find(o => o._id === selectedOrderId);
      const updateData: any = { 
        orderStatus: 'Đã huỷ đơn hàng',
        cancelReason: cancelReason.trim()
      };
      if (order && order.paymentMethod === 'vnpay') {
        updateData.paymentStatus = 'Đã hoàn tiền';
      }
      await updateOrder(selectedOrderId, updateData);

      await fetchOrders();
      
      setShowCancelModal(false);
      setSelectedOrderId(null);
      setCancelReason('');
      
      if (order && order.paymentMethod === 'vnpay') {
        setSuccessMessage('Hủy đơn hàng thành công! Trạng thái thanh toán đã được cập nhật thành "Đã hoàn tiền".');
      } else {
        setSuccessMessage('Hủy đơn hàng thành công!');
      }
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi hủy đơn hàng.');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleProcessReturn = async () => {
    if (!selectedOrderId) return;

    try {
      setProcessingReturnId(selectedOrderId);
      const newStatus = returnAction === 'approve' ? 'Đã hoàn hàng' : 'Từ chối hoàn hàng';
      
      await updateOrder(selectedOrderId, { 
        orderStatus: newStatus
      });
      
      await fetchOrders();
      
      setShowReturnModal(false);
      setSelectedOrderId(null);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi xử lý hoàn hàng.');
    } finally {
      setProcessingReturnId(null);
    }
  };

  const openCancelModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const openReturnModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setReturnAction('approve');
    setShowReturnModal(true);
  };

  const statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'Chờ xử lý', label: 'Chờ xử lý' },
    { value: 'Đã xử lý', label: 'Đã xử lý' },
    { value: 'Đang giao hàng', label: 'Đang giao hàng' },
    { value: 'Đã giao hàng', label: 'Đã giao hàng' },
    { value: 'Đã nhận hàng', label: 'Đã nhận hàng' },
    { value: 'Yêu cầu hoàn hàng', label: 'Yêu cầu hoàn hàng' },
    { value: 'Đã hoàn hàng', label: 'Đã hoàn hàng' },
    { value: 'Từ chối hoàn hàng', label: 'Từ chối hoàn hàng' },
    { value: 'Đã huỷ đơn hàng', label: 'Đã huỷ đơn hàng' },
  ];

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
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            {error}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            {successMessage}
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        Quản lý đơn hàng
      </h2>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
          <div className="text-sm text-gray-600">Tổng đơn hàng</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.orderStatus === 'Chờ xử lý').length}
          </div>
          <div className="text-sm text-gray-600">Chờ xử lý</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">
            {orders.filter(o => o.orderStatus === 'Đang giao hàng').length}
          </div>
          <div className="text-sm text-gray-600">Đang giao hàng</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.orderStatus === 'Đã giao hàng' || o.orderStatus === 'Đã nhận hàng').length}
          </div>
          <div className="text-sm text-gray-600">Đã giao hàng</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border text-sm rounded-xl shadow-lg">
          <thead>
            <tr className="bg-black text-white text-left">
              <th className="px-4 py-2">Khách hàng</th>
              <th className="px-4 py-2">Trạng thái đơn hàng</th>

              <th className="px-4 py-2">Trạng thái thanh toán</th>
              <th className="px-4 py-2">Tổng tiền</th>
              <th className="px-4 py-2">Phương thức thanh toán</th>
              <th className="px-4 py-2">Ngày tạo</th>
              <th className="px-4 py-2">Lý do hủy</th>
              <th className="px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.length > 0 ? (
              sortedOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">
                    <div>
                      <div className="font-medium">{order.fullName}</div>
                      <div className="text-xs text-gray-500">{order.phone}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2">{getStatusBadge(order.orderStatus)}</td>
                  <td className="px-4 py-2">{getPaymentBadge(order.paymentStatus)}</td>
                  <td className="px-4 py-2 text-red-600 font-semibold">
                    {order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {getPaymentMethodText(order.paymentMethod)}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-4 py-2">
                    {order.orderStatus === 'Đã huỷ đơn hàng' && order.cancelReason ? (
                      <div className="max-w-xs">
                        <p className="text-xs text-red-700 bg-red-50 p-2 rounded border border-red-200">
                          {order.cancelReason.length > 50 
                            ? `${order.cancelReason.substring(0, 50)}...` 
                            : order.cancelReason
                          }
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <Link 
                        to={`/admin/orderDetails/${order._id}`} 
                        className="inline-flex items-center gap-2 border bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs font-semibold shadow transition duration-200"
                      >
                        Chi tiết
                      </Link>
                      {canCancelOrder(order.orderStatus) && (
                        <button
                          onClick={() => openCancelModal(order._id)}
                          className="inline-flex items-center gap-2 border bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-semibold shadow transition duration-200"
                        >
                          Huỷ
                        </button>
                      )}
                      {canProcessReturn(order.orderStatus) && (
                        <button
                          onClick={() => openReturnModal(order._id)}
                          className="inline-flex items-center gap-2 border bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-md text-xs font-semibold shadow transition duration-200"
                        >
                          Xử lý hoàn hàng 
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                  {searchTerm || statusFilter !== 'all' ? 'Không tìm thấy đơn hàng phù hợp' : 'Chưa có đơn hàng nào'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg relative">
            <h3 className="text-lg font-bold mb-1 text-gray-800">Hủy đơn hàng</h3>
            <div className="mb-4">
              <p className="text-gray-700 text-sm mb-4">
                Bạn có chắc chắn muốn hủy đơn hàng này không?
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do hủy <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Vui lòng nhập lý do hủy đơn hàng"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  rows={4}
                  required
                />
                {!cancelReason.trim() && (
                  <p className="text-red-500 text-xs mt-1">Vui lòng nhập lý do hủy đơn hàng</p>
                )}
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                Lưu ý: Hành động này không thể hoàn tác!
              </div>
            </div>
            <div className="flex justify-end space-x-1">
              <button 
                type="button" 
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedOrderId(null);
                  setCancelReason('');
                }}
                disabled={cancellingOrderId !== null}
                className="border bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition duration-200 disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button 
                type="button"
                onClick={handleCancelOrder}
                disabled={cancellingOrderId !== null || !cancelReason.trim()}
                className="border bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition duration-200 disabled:opacity-50"
              >
                {cancellingOrderId ? 'Đang hủy...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg relative">
            <h3 className="text-lg font-bold mb-1 text-gray-800">Xử lý yêu cầu hoàn hàng</h3>
            <div className="mb-4">
              <p className="text-gray-700 text-sm mb-4">
                Bạn muốn xử lý yêu cầu hoàn hàng này như thế nào?
              </p>
              
              <div className="mb-4">
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="approve"
                      checked={returnAction === 'approve'}
                      onChange={(e) => setReturnAction(e.target.value as 'approve' | 'reject')}
                      className="mr-2"
                    />
                    <span className="text-green-700 text-sm font-medium">Đồng ý hoàn hàng</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="reject"
                      checked={returnAction === 'reject'}
                      onChange={(e) => setReturnAction(e.target.value as 'approve' | 'reject')}
                      className="mr-2"
                    />
                    <span className="text-red-700 text-sm font-medium">Từ chối hoàn hàng</span>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700 mb-2"> 
                {returnAction === 'approve' 
                  ? 'Đồng ý hoàn hàng sẽ chuyển trạng thái đơn hàng thành "Đã hoàn hàng". Nếu thanh toán qua VNPAY, trạng thái thanh toán sẽ tự động chuyển thành "Đã hoàn tiền".'
                  : 'Từ chối hoàn hàng sẽ chuyển trạng thái đơn hàng thành "Từ chối hoàn hàng"'
                }
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                Lưu ý: Khi đơn hàng chuyển sang trạng thái "Đã nhận hàng", trạng thái thanh toán sẽ tự động chuyển thành "Đã thanh toán" (áp dụng cho cả COD và VNPAY)
              </div>
            </div>
            <div className="flex justify-end space-x-1">
              <button 
                type="button" 
                onClick={() => {
                  setShowReturnModal(false);
                  setSelectedOrderId(null);
                }}
                disabled={processingReturnId !== null}
                className="border bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition duration-200 disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button 
                type="button"
                onClick={handleProcessReturn}
                disabled={processingReturnId !== null}
                className={`border px-4 py-2 rounded-md text-sm transition duration-200 disabled:opacity-50 ${
                  returnAction === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {processingReturnId ? 'Đang xử lý...' : (returnAction === 'approve' ? 'Đồng ý' : 'Từ chối')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;