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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processed': return 'Đã xử lý';
      case 'shipping': return 'Đang giao hàng';
      case 'shipped': return 'Đã giao hàng';
      case 'delivered': return 'Đã nhận hàng';
      case 'cancelled': return 'Đã huỷ đơn hàng';
      default: return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cod': return 'Thanh toán khi nhận hàng';
      case 'vnpay': return 'Thanh toán qua VNPay';
      default: return method;
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng #{order._id}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            order.status === 'paid' ? 'bg-green-100 text-green-800' :
            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {getStatusText(order.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
            <div className="space-y-3 text-gray-700 text-sm">
              <p><strong>Mã đơn hàng:</strong> {order._id}</p>
              <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString("vi-VN")}</p>
              <p><strong>Họ và tên:</strong> {order.fullName}</p>
              <p><strong>Số điện thoại:</strong> {order.phone}</p>
              <p><strong>Địa chỉ giao hàng:</strong> {order.address.detail}, {order.address.ward}, {order.address.district}, {order.address.province}</p>
              <p><strong>Phương thức thanh toán:</strong> {getPaymentMethodText(order.paymentMethod)}</p>
              <p><strong>Trạng thái đơn hàng:</strong> {getStatusText(order.status)}</p>
              <p><strong>Trạng thái thanh toán:</strong> {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
              <p><strong>Tổng tiền:</strong> <span className="text-red-500 font-bold text-lg">{order.totalAmount.toLocaleString()}₫</span></p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Sản phẩm đã đặt</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Sản phẩm</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Số lượng</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Đơn giá</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orderItems.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        {item.variantId?.productId?.image && (
                          <img
                            src={item.variantId.productId.image}
                            alt={item.variantId.productId.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.variantId?.productId?.name || 'Sản phẩm'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.variantId?.attributes?.map((attr, i) => (
                              <span key={i}>
                                {attr.attributeId?.name}: {attr.valueId?.value}{' '}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.price.toLocaleString()}₫</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {(item.price * item.quantity).toLocaleString()}₫
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            to="/orders"
            className="bg-[#5f518e] text-white px-6 py-2 rounded-md font-semibold hover:opacity-90"
          >
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;