import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById, updateOrder } from '../../services/Order';
import type { Order } from '../../types/Order';
import OrderProgressBar from '../../components/OrderProgressBar';
  
interface OrderItem {
  _id: string;
  variantId: {
    _id: string;
    image: string;
    productId: {
      _id: string;
      name: string;
      image: string;
    };
    attributes?: {
      attributeId: {
        _id: string;
        name: string;
      };
      valueId: {
        _id: string;
        value: string;
      };
    }[];
  };
  quantity: number;
  price: number;
}

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingReceived, setConfirmingReceived] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchOrderData = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const data = await getOrderById(orderId);
      setOrder(data.order);
      setOrderItems(data.items || []);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [orderId]);

  const canConfirmReceived = (orderStatus: string) => {
    return orderStatus === 'Đã giao hàng';
  };

  const handleConfirmReceived = async () => {
    if (!orderId) return;

    try {
      setConfirmingReceived(true);
      setError(null);
      setSuccessMessage(null);
      
      await updateOrder(orderId, { 
        orderStatus: 'Đã nhận hàng'
      });
      
      await fetchOrderData();
      
      setSuccessMessage('Đã xác nhận nhận hàng thành công! Trạng thái thanh toán đã được cập nhật.');
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi xác nhận nhận hàng.');
    } finally {
      setConfirmingReceived(false);
    }
  };

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

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cod': return 'Thanh toán khi nhận hàng';
      case 'vnpay': return 'Thanh toán qua VNPay';
      case 'wallet': return 'Thanh toán bằng Ví điện tử';
      default: return method;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Đã thanh toán';
      case 'unpaid':
        return 'Chưa thanh toán';
      case 'pending':
        return 'Chờ thanh toán';
      case 'Đã hoàn tiền':
        return 'Đã hoàn tiền';
      default:
        return status;
    }
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5f518e] mx-auto mb-4"></div>
        <p className="text-gray-500">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error || 'Không tìm thấy đơn hàng'}</p>
        <Link to="/orders" className="text-[#5f518e] underline mt-4 inline-block">
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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

      <div className="flex items-center text-sm mb-6">
        <Link to="/" className="text-gray-500 hover:text-gray-900">Trang chủ</Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to="/orders" className="text-gray-500 hover:text-gray-900">Đơn hàng</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-black">Chi tiết đơn hàng</span>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Chi tiết đơn hàng - {order._id}</h2>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            Tiến trình đơn hàng
          </h2>
          <OrderProgressBar currentStatus={order.orderStatus} />
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">Thông tin người nhận</h2>
            <div className="space-y-2 text-gray-700 text-sm">
              <p><strong>Họ và tên:</strong> {order.fullName}</p>
              <p><strong>Số điện thoại:</strong> {order.phone}</p>
              <div>
                <strong>Email:</strong> {(order.userId as { email?: string })?.email || 'N/A'}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between h-full">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 mb-4">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">Thông tin đơn hàng</h2>
              <div className="space-y-2 text-gray-700 text-sm">
                <p><strong>Ngày đặt hàng: </strong>{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                <div><strong>Trạng thái:</strong> {getStatusBadge(order.orderStatus)}</div>
                <div><strong>Thanh toán:</strong> {getPaymentBadge(order.paymentStatus)}</div>
                <p><strong>Phương thức:</strong> {getPaymentMethodText(order.paymentMethod)}</p>
              </div>
            </div>
            
            {order.orderStatus === 'Đã huỷ đơn hàng' && order.cancelReason && (
              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-800">
                  Lý do hủy đơn hàng
                </h2>
                <div className="text-red-700 text-sm">
                  <p>{order.cancelReason}</p>
                </div>
              </div>
            )}
            
            {(order.orderStatus === 'Yêu cầu hoàn hàng' || order.orderStatus === 'Đã hoàn hàng' || order.orderStatus === 'Từ chối hoàn hàng') && order.returnReason && (
              <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-800">
                  Lý do hoàn hàng
                </h2>
                <div className="text-orange-700 text-sm">
                  <p>{order.returnReason}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
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

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-8">
        <h2 className="text-lg font-bold mt-8 mb-4 flex items-center gap-2">Danh sách sản phẩm</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Tên sản phẩm</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Số lượng</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Đơn giá</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orderItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.variantId?.productId?.image && (
                        <img
                          src={item.variantId.productId.image}
                          alt={item.variantId.productId.name}
                          className="w-14 h-14 object-cover rounded border"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{item.variantId?.productId?.name || 'Sản phẩm'}</p>
                        <p className="text-xs text-gray-500">
                          {item.variantId?.attributes?.map((attr, i) => (
                            <span key={i} className="mr-2">
                              {attr.attributeId?.name}: {attr.valueId?.value}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{item.quantity}</td>
                  <td className="px-4 py-3 text-gray-900">{item.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-900">{(item.price * item.quantity).toLocaleString()}</td>
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

      <div className="mt-8 flex justify-end gap-2">
        {canConfirmReceived(order.orderStatus) && (
          <button
            onClick={handleConfirmReceived}
            disabled={confirmingReceived}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition disabled:opacity-50"
          > 
            {confirmingReceived ? 'Đang xác nhận...' : 'Đã nhận hàng'}
          </button>
        )}
        <Link
          to="/orders"
          className="bg-[#5f518e] text-white px-4 py-2 rounded-lg font-semibold shadow hover:opacity-90 transition"
        >
          Quay lại
        </Link>
      </div>
    </div>
  );
};

export default OrderDetail;