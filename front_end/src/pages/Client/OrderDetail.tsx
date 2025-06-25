import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../services/Order';
import type { Order } from '../../types/Order';

interface OrderItem {
  _id: string;
  variantId: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    image: string;
  };
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
      case 'paid': return 'Đã thanh toán';
      case 'shipped': return 'Đang giao hàng';
      case 'delivered': return 'Đã giao hàng';
      case 'cancelled': return 'Đã hủy';
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5f518e] mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500">{error || 'Không tìm thấy đơn hàng'}</p>
          <Link to="/orders" className="text-[#5f518e] underline mt-4 inline-block">
            Quay lại danh sách đơn hàng
          </Link>
        </div>
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
          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrderData}
              disabled={loading}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-gray-300"
            >
              {loading ? 'Đang tải...' : 'Làm mới'}
            </button>
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
            <div className="space-y-3">
              
              <div>
                <span className="font-medium">Số điện thoại:</span>
                <span className="ml-2 text-gray-600">{order.phone}</span>
              </div>
              <div>
                <span className="font-medium">Địa chỉ giao hàng:</span>
                <span className="ml-2 text-gray-600">
                  {order.address.detail}, {order.address.ward}, {order.address.district}, {order.address.province}
                </span>
              </div>
              <div>
                <span className="font-medium">Phương thức thanh toán:</span>
                <span className="ml-2 text-gray-600">
                  {getPaymentMethodText(order.paymentMethod)}
                </span>
              </div>
              <div>
                <span className="font-medium">Trạng thái thanh toán:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                  order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.paymentStatus === 'paid' ? 'Đã thanh toán' :
                   order.paymentStatus === 'pending' ? 'Chờ thanh toán' : 'Thanh toán thất bại'}
                </span>
              </div>
              <div>
                <span className="font-medium">Trạng thái đơn hàng:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  order.status === 'paid' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              <div>
                <span className="font-medium">Tổng tiền:</span>
                <span className="ml-2 text-lg font-bold text-red-500">
                  {order.totalAmount.toLocaleString()}₫
                </span>
              </div>
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
