import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../services/Order';
import type { Order } from '../../types/Order';

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

  const getStatusText = (orderStatus: string) => {
    switch (orderStatus) {
      case 'Chờ xử lý': return 'Chờ xử lý';
      case 'Đã xử lý': return 'Đã xử lý';
      case 'Đang giao hàng': return 'Đang giao hàng';
      case 'Đã giao hàng': return 'Đã giao hàng';
      case 'Đã nhận hàng': return 'Đã nhận hàng';
      case 'Đã huỷ đơn hàng': return 'Đã huỷ đơn hàng';
      default: return orderStatus;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cod': return 'Thanh toán khi nhận hàng';
      case 'vnpay': return 'Thanh toán qua VNPay';
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
      default:
        return status;
    }
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
      <div className="flex items-center text-sm mb-6">
        <Link to="/" className="text-gray-500 hover:text-gray-900">Trang chủ</Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to="/orders" className="text-gray-500 hover:text-gray-900">Đơn hàng</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-black">Chi tiết đơn hàng</span>
      </div>

      {/* Card Thông tin đơn hàng */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span role="img" aria-label="order">📦</span> Đơn hàng #{order._id}
            </h1>
            <p className="text-gray-500 mt-1">Ngày đặt: <span className="font-medium">{new Date(order.createdAt).toLocaleString("vi-VN")}</span></p>
          </div>
          <div className="flex flex-col md:items-end gap-2">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
              order.orderStatus === 'Đã xử lý' ? 'bg-green-100 text-green-800' :
              order.orderStatus === 'Chờ xử lý' ? 'bg-yellow-100 text-yellow-800' :
              order.orderStatus === 'Đang giao hàng' ? 'bg-blue-100 text-blue-800' :
              order.orderStatus === 'Đã giao hàng' ? 'bg-green-100 text-green-800' :
              order.orderStatus === 'Đã nhận hàng' ? 'bg-green-200 text-green-900' :
              'bg-red-100 text-red-800'
            }`}>
              <span role="img" aria-label="status">🔖</span>
              {getStatusText(order.orderStatus)}
            </span>
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
              getPaymentStatusText(order.paymentStatus) === 'Đã thanh toán' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
            >
              <span role="img" aria-label="payment">💰</span>
              {getPaymentStatusText(order.paymentStatus)}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Thông tin người nhận */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><span role="img" aria-label="user">👤</span>Thông tin người nhận</h2>
            <div className="space-y-2 text-gray-700 text-sm">
              <p><strong>Họ và tên:</strong> {order.fullName}</p>
              <p><strong>Số điện thoại:</strong> {order.phone}</p>
              <p><strong>Địa chỉ:</strong> {order.address.detail}, {order.address.ward}, {order.address.district}, {order.address.province}</p>
              <p><strong>Phương thức thanh toán:</strong> {getPaymentMethodText(order.paymentMethod)}</p>
            </div>
          </div>
          {/* Tổng tiền */}
          <div className="flex flex-col justify-between h-full">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 mb-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><span role="img" aria-label="money">🧾</span>Thông tin thanh toán</h2>
              <div className="space-y-2 text-gray-700 text-sm">
                <p><strong>Trạng thái đơn hàng:</strong> {getStatusText(order.orderStatus)}</p>
                <p><strong>Trạng thái thanh toán:</strong> {getPaymentStatusText(order.paymentStatus)}</p>
                <p><strong>Tổng tiền:</strong> <span className="text-red-500 font-bold text-2xl">{order.totalAmount.toLocaleString()}₫</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2"><span role="img" aria-label="cart">🛒</span>Sản phẩm đã đặt</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Sản phẩm</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Số lượng</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Đơn giá</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Thành tiền</th>
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
                  <td className="px-4 py-3 text-gray-900">{item.price.toLocaleString()}₫</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{(item.price * item.quantity).toLocaleString()}₫</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Link
          to="/orders"
          className="bg-[#5f518e] text-white px-8 py-3 rounded-lg font-semibold shadow hover:opacity-90 transition"
        >
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    </div>
  );
};

export default OrderDetail;
