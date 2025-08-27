import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById, updateOrder } from "../../../services/Order";
import type { Order } from "../../../types/Order";
import OrderProgressBar from "../../../components/OrderProgressBar";
import { getOrderStatusBadgeClass, getPaymentStatusBadgeClass } from "../../../utils/statusStyles";

interface OrderItem {
  _id: string;
  variantId: string;
  quantity: number;
  price: number;
  snapshot: {
    productName: string;
    productImage?: string;
    attributes?: {
      name: string;
      value: string;
    }[];
  };
}

interface OrderWithItems {
  order: Order & {
    userId: {
      _id: string;
      fullName: string;
      email: string;
    };
  };
  items: OrderItem[];
}

const DetailOrder = () => {
  const { id } = useParams<{ id: string }>();
  const [orderData, setOrderData] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [statusError, setStatusError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnAction, setReturnAction] = useState<'approve' | 'reject'>('approve');

  const API_URL = 'http://localhost:3000';
  const resolveImageUrl = (url?: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${API_URL}${url}`;
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(id!);
      setOrderData(data);
      setNewStatus(data.order.orderStatus === 'Yêu cầu hoàn hàng' ? '' : data.order.orderStatus);
      setStatusError('');
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus || !orderData || !id) return;
    if (orderData.order.orderStatus === 'Đã huỷ đơn hàng') {
      setStatusError('Đơn hàng đã bị huỷ, không thể cập nhật trạng thái.');
      return;
    }

    if (!validateStatusTransition(orderData.order.orderStatus, newStatus)) {
      setStatusError('Không thể chuyển từ trạng thái hiện tại sang trạng thái này. Chỉ có thể chuyển lên trạng thái tiếp theo hoặc hủy đơn hàng.');
      return;
    }

    try {
      setUpdating(true);
      setStatusError('');
      
      const updateData: Partial<Order> = { orderStatus: newStatus as Order['orderStatus'] };
      
      if (newStatus === 'Đã nhận hàng') {
        updateData.paymentStatus = 'Đã thanh toán';
      }
      
      if (newStatus === 'Đã huỷ đơn hàng' && orderData.order.paymentMethod === 'vnpay') {
        updateData.paymentStatus = 'Đã hoàn tiền';
      }
      
      await updateOrder(id, updateData);

      await fetchOrderDetails();
      setIsModalOpen(false);
      
      if (newStatus === 'Đã nhận hàng') {
        setSuccessMessage('Cập nhật trạng thái đơn hàng và thanh toán thành công!');
      } else if (newStatus === 'Đã huỷ đơn hàng' && orderData.order.paymentMethod === 'vnpay') {
        setSuccessMessage('Hủy đơn hàng thành công! Trạng thái thanh toán đã được cập nhật thành "Đã hoàn tiền".');
      } else {
        setSuccessMessage('Cập nhật trạng thái đơn hàng thành công!');
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi cập nhật.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderData || !id || !cancelReason.trim()) return;

    try {
      setUpdating(true);
      
      const updateData: Partial<Order> = { 
        orderStatus: 'Đã huỷ đơn hàng',
        cancelReason: cancelReason.trim()
      };
      
      if (orderData.order.paymentMethod === 'vnpay') {
        updateData.paymentStatus = 'Đã hoàn tiền';
      }
      
      await updateOrder(id, updateData);
      
      await fetchOrderDetails();
      setShowCancelModal(false);
      setCancelReason('');
      
      if (orderData.order.paymentMethod === 'vnpay') {
        setSuccessMessage('Hủy đơn hàng thành công! Trạng thái thanh toán đã được cập nhật thành "Đã hoàn tiền".');
      } else {
        setSuccessMessage('Hủy đơn hàng thành công!');
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi hủy đơn hàng.');
    } finally {
      setUpdating(false);
    }
  };

  const handleProcessReturn = async () => {
    if (!orderData || !id) return;

    try {
      setUpdating(true);
      const newStatus = returnAction === 'approve' ? 'Đã hoàn hàng' : 'Từ chối hoàn hàng';
      
      await updateOrder(id, { 
        orderStatus: newStatus
      });
      
      await fetchOrderDetails();
      setShowReturnModal(false);
      
      setSuccessMessage(`${returnAction === 'approve' ? 'Đồng ý' : 'Từ chối'} hoàn hàng thành công!`);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi xử lý hoàn hàng.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusBadgeClass(status)}`}>{status}</span>
  );

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cod': return 'Thanh toán khi nhận hàng (COD)';
      case 'vnpay': return 'Thanh toán qua VNPay';
      case 'wallet': return 'Thanh toán bằng Ví điện tử';
      default: return method;
    }
  };

  const getPaymentStatusText = (status: string) => {
    if (status === 'paid' || status === 'Đã thanh toán') return 'Đã thanh toán';
    if (status === 'unpaid' || status === 'Chưa thanh toán') return 'Chưa thanh toán';
    if (status === 'Đã hoàn tiền') return 'Đã hoàn tiền';
    return status;
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const statusText = getPaymentStatusText(paymentStatus);
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusBadgeClass(statusText)}`}>
        {statusText}
      </span>
    );
  };

  const validateStatusTransition = (currentStatus: string, newStatus: string): boolean => {
    const statusOrder = [
      'Chờ xử lý',
      'Đã xử lý', 
      'Đang giao hàng',
      'Đã giao hàng',
      'Đã nhận hàng'
    ];

    const currentIndex = statusOrder.indexOf(currentStatus);
    const newIndex = statusOrder.indexOf(newStatus);

    if (currentIndex === newIndex) return true;

    if (newIndex === currentIndex + 1) return true;

    if (newStatus === 'Đã huỷ đơn hàng') return true;

    return false;
  };

  const canCancelOrder = (orderStatus: string) => {
    return orderStatus === 'Chờ xử lý' || orderStatus === 'Đã xử lý';
  };

  const canProcessReturn = (orderStatus: string) => {
    return orderStatus === 'Yêu cầu hoàn hàng';
  };



  const getAvailableStatuses = (currentStatus: string): string[] => {
    const statusOrder = [
      'Chờ xử lý',
      'Đã xử lý', 
      'Đang giao hàng',
      'Đã giao hàng',
      'Đã nhận hàng'
    ];

    if (currentStatus === 'Yêu cầu hoàn hàng') {
      return [];
    }

    const currentIndex = statusOrder.indexOf(currentStatus);
    const availableStatuses = [];

    availableStatuses.push(currentStatus);

    // Only offer the next status when current status is inside the main flow
    if (currentIndex >= 0 && currentIndex < statusOrder.length - 1) {
      availableStatuses.push(statusOrder[currentIndex + 1]);
    }

    if (canCancelOrder(currentStatus)) {
      availableStatuses.push('Đã huỷ đơn hàng');
    }

    // Bỏ trạng thái 'Yêu cầu hoàn hàng' khỏi danh sách cập nhật thủ công

    return availableStatuses;
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

  if (error || !orderData) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error || 'Không tìm thấy đơn hàng'}</p>
          <Link to="/admin/orders">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Quay lại
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const { order, items } = orderData;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Chi tiết đơn hàng - {order._id}</h2>
        <div className="flex gap-2">
          {canCancelOrder(order.orderStatus) && (
            <button
              onClick={() => {
                setShowCancelModal(true);
                setCancelReason('');
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition duration-200"
            >
              Hủy đơn hàng
            </button>
          )}
          {canProcessReturn(order.orderStatus) && (
            <button
              onClick={() => {
                setShowReturnModal(true);
                setReturnAction('approve');
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm transition duration-200"
            >
              Xử lý hoàn hàng
            </button>
          )}
          <button
            onClick={() => {
              if (order.orderStatus !== 'Đã huỷ đơn hàng' && order.orderStatus !== 'Yêu cầu hoàn hàng') setIsModalOpen(true);
            }}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition duration-200${(order.orderStatus === 'Đã huỷ đơn hàng' || order.orderStatus === 'Yêu cầu hoàn hàng') ? ' opacity-50 cursor-not-allowed' : ''}`}
            disabled={order.orderStatus === 'Đã huỷ đơn hàng' || order.orderStatus === 'Yêu cầu hoàn hàng'}
          >
            Cập nhật trạng thái
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          Tiến trình đơn hàng
        </h3>
        <OrderProgressBar currentStatus={order.orderStatus} theme="green" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            Thông tin khách hàng
          </h3>
          <div className="space-y-2 text-gray-700 text-sm">
            <div><strong>Tên khách hàng:</strong> {order.fullName}</div>
            <div><strong>Số điện thoại:</strong> {order.phone}</div>
            <div><strong>Email:</strong> {order.userId?.email || 'N/A'}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            Thông tin đơn hàng
          </h3>
          <div className="space-y-2 text-gray-700 text-sm">
            <div><strong>Ngày đặt hàng:</strong> {new Date(order.createdAt).toLocaleString("vi-VN")}</div>
            <div><strong>Trạng thái:</strong> {getStatusBadge(order.orderStatus)}</div>
            <div><strong>Thanh toán:</strong> {getPaymentBadge(order.paymentStatus)}</div>
            <div><strong>Phương thức:</strong> {getPaymentMethodText(order.paymentMethod)}</div>
            
            {order.orderStatus === 'Đã huỷ đơn hàng' && order.cancelReason && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start">
                  <div>
                    <p className="text-sm font-medium text-red-800 mb-1">Lý do hủy:</p>
                    <p className="text-sm text-red-700">{order.cancelReason}</p>
                  </div>
                </div>
              </div>
            )}
            
            {(order.orderStatus === 'Yêu cầu hoàn hàng' || order.orderStatus === 'Đã hoàn hàng' || order.orderStatus === 'Từ chối hoàn hàng') && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-800 mb-1">Lý do hoàn hàng:</p>
                    <p className="text-sm text-orange-700">{order.returnReason || '—'}</p>
                  </div>
                </div>
                {Array.isArray((order as any).returnImages) && (order as any).returnImages.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-800 mb-2">Ảnh minh chứng:</p>
                    <div className="grid grid-cols-6 gap-2">
                      {(order as any).returnImages.map((img: string, idx: number) => (
                        <a key={idx} href={resolveImageUrl(img)} target="_blank" rel="noreferrer" className="block w-16 h-16 border rounded overflow-hidden">
                          <img src={resolveImageUrl(img)} alt="return" className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          Địa chỉ giao hàng
        </h3>
        <div className="text-gray-700 text-sm">
          {order.address.fullAddress 
            ? order.address.fullAddress 
            : `${order.address.detail}, ${order.address.ward}, ${order.address.district}, ${order.address.province}`
          }
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold flex items-center gap-2">
            Danh sách sản phẩm
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Tên sản phẩm</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Số lượng</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Đơn giá</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={item.snapshot.productImage}
                        alt={item.snapshot.productName}
                        className="w-12 h-12 object-cover rounded border mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.snapshot?.productName || 'Sản phẩm'}
                        </div>
                      </div>
                      
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.price.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t">
          <div className="flex justify-end">
            <div className="text-right">
              <div className="text-lg font-bold text-red-600">
                Tổng tiền: <span>{order.totalAmount.toLocaleString()}
                  {order.voucherCode && (order.discount ?? 0) > 0 && (
                    <p className="text-sm text-gray-500 mt-1 font-medium">
                      Đã áp dụng mã giảm giá
                      <span className="font-semibold"> (-{(order.discount ?? 0).toLocaleString()})</span>
                    </p>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Link to="/admin/orders">
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition duration-200">
            Quay lại
          </button>
        </Link>
      </div>

      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            {successMessage}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg relative">
            <h3 className="text-lg font-bold mb-4">Cập nhật trạng thái đơn hàng</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Trạng thái hiện tại: <span className="font-semibold text-blue-600">{orderData?.order.orderStatus}</span>
              </label>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái mới:
              </label>
              <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                Quy tắc: Chỉ có thể chuyển sang trạng thái tiếp theo, không thể quay lại trạng thái trước đó.
              </div>
              {orderData?.order.paymentMethod === 'vnpay' && (
                <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                  VNPAY: Khi khách hàng nhận hàng, trạng thái thanh toán sẽ tự động chuyển thành "Đã thanh toán"
                </div>
              )}
              <select 
                value={newStatus}
                onChange={(e) => {
                  setNewStatus(e.target.value);
                  setStatusError('');
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {orderData && getAvailableStatuses(orderData.order.orderStatus).map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {statusError && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  {statusError}
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-1">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                disabled={updating}
                className="border bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition duration-200 disabled:opacity-50"
              >
                Hủy
              </button>
              <button 
                type="button"
                onClick={handleUpdateStatus}
                disabled={updating || !newStatus}
                className="border bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition duration-200 disabled:opacity-50"
              >
                {updating ? 'Đang cập nhật...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                  setCancelReason('');
                }}
                disabled={updating}
                className="border bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition duration-200 disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button 
                type="button"
                onClick={handleCancelOrder}
                disabled={updating || !cancelReason.trim()}
                className="border bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition duration-200 disabled:opacity-50"
              >
                {updating ? 'Đang hủy...' : 'Xác nhận hủy'}
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
              {order && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
                  {(order as any).returnReason && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-orange-800">Lý do khách hàng:</p>
                      <p className="text-sm text-orange-700">{(order as any).returnReason}</p>
                    </div>
                  )}
                  {Array.isArray((order as any).returnImages) && (order as any).returnImages.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-800 mb-2">Ảnh minh chứng:</p>
                      <div className="grid grid-cols-5 gap-2">
                        {(order as any).returnImages.map((img: string, idx: number) => (
                          <a key={idx} href={resolveImageUrl(img)} target="_blank" rel="noreferrer" className="block w-16 h-16 border rounded overflow-hidden">
                            <img src={resolveImageUrl(img)} alt="return" className="w-full h-full object-cover" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
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
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                Lưu ý: Đọc kỹ nội dung khi ấn đồng ý hoàn hàng hoặc từ chối hoàn hàng.
              </div>
            </div>
            <div className="flex justify-end space-x-1">
              <button 
                type="button" 
                onClick={() => {
                  setShowReturnModal(false);
                }}
                disabled={updating}
                className="border bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition duration-200 disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button 
                type="button"
                onClick={handleProcessReturn}
                disabled={updating}
                className={`border px-4 py-2 rounded-md text-sm transition duration-200 disabled:opacity-50 ${
                  returnAction === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {updating ? 'Đang xử lý...' : (returnAction === 'approve' ? 'Đồng ý' : 'Từ chối')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailOrder;