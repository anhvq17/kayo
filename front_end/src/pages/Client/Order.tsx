import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrdersByUserWithItems } from '../../services/Order';
import type { Order } from '../../types/Order';

// Thêm type cho OrderItem
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

const ORDER_TABS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chờ xử lý', value: 'Chờ xử lý' },
  { label: 'Đã xử lý', value: 'Đã xử lý' },
  { label: 'Đang giao hàng', value: 'Đang giao hàng' },
  { label: 'Đã giao hàng', value: 'Đã giao hàng' },
  { label: 'Đã nhận hàng', value: 'Đã nhận hàng' },
  { label: 'Đã huỷ đơn hàng', value: 'Đã huỷ đơn hàng' },
];

const OrderList = () => {
  const [orderList, setOrderList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const data = await getOrdersByUserWithItems(user._id);
        if (Array.isArray(data)) {
          setOrderList(data);
        }
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
      case 'Đã thanh toán':
        return 'Đã thanh toán';
      case 'Chưa thanh toán':
        return 'Chưa thanh toán';
      case 'Chờ thanh toán':
        return 'Chờ thanh toán';
      default:
        return status;
    }
  };

  // Lọc đơn theo tab
  const filteredOrders = tab === 'all' ? orderList : orderList.filter((o) => o.orderStatus === tab);
  // Sắp xếp đơn hàng mới nhất lên đầu
  const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm mb-6">
        <Link to="/" className="text-gray-500 hover:text-gray-900">Trang chủ</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-black">Danh sách đơn hàng</span>
      </div>

      <div className="mx-auto mt-10 text-center">
        <h1 className="text-3xl font-bold flex items-center gap-2 justify-center">
          <span role="img" aria-label="order-list">📋</span> DANH SÁCH ĐƠN HÀNG
        </h1>
      </div>

      {/* Tabs lọc trạng thái */}
      <div className="flex flex-wrap gap-2 justify-center mt-8 mb-8">
        {ORDER_TABS.map((t) => (
          <button
            key={t.value}
            className={`px-4 py-2 rounded-full font-semibold border transition text-sm ${tab === t.value ? 'bg-[#5f518e] text-white border-[#5f518e]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setTab(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mx-auto my-10 max-w-5xl space-y-6 px-2 md:px-0">
        {loading ? (
          <div className="text-center text-blue-500 py-8">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : sortedOrders.length > 0 ? (
          sortedOrders.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col gap-4 hover:shadow-xl transition">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2">
                    <div>
                      <p className="text-lg text-gray-500 flex items-center gap-1">
                        <span role="img" aria-label="id">#️⃣</span> Mã đơn: <span className="font-semibold text-gray-800">{item._id}</span>
                      </p>
                      <p className="text-lg text-gray-500 flex items-center gap-1 mt-1">
                        <span role="img" aria-label="date">📅</span> Ngày tạo: <span className="font-medium">{new Date(item.createdAt).toLocaleString("vi-VN")}</span>
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 mt-2 md:mt-0">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        item.orderStatus === 'Đã xử lý' ? 'bg-green-100 text-green-800' :
                        item.orderStatus === 'Chờ xử lý' ? 'bg-yellow-100 text-yellow-800' :
                        item.orderStatus === 'Đang giao hàng' ? 'bg-blue-100 text-blue-800' :
                        item.orderStatus === 'Đã giao hàng' ? 'bg-green-100 text-green-800' :
                        item.orderStatus === 'Đã nhận hàng' ? 'bg-green-200 text-green-900' :
                        'bg-red-100 text-red-800'
                      }`}>
                        <span role="img" aria-label="status">🔖</span>
                        {getStatusText(item.orderStatus)}
                      </span>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        getPaymentStatusText(item.paymentStatus) === 'Đã thanh toán' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        <span role="img" aria-label="payment">💰</span>
                        {getPaymentStatusText(item.paymentStatus)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2 mt-4">
                    <p className="text-lg text-gray-500 flex items-center gap-1">
                      <span role="img" aria-label="money">💵</span> Tổng tiền: <span className="text-red-500 font-bold">{item.totalAmount.toLocaleString()}₫</span>
                    </p>
                    <p className="text-lg text-gray-500 flex items-center gap-1">
                      <span role="img" aria-label="paymethod">💳</span> {getPaymentMethodText(item.paymentMethod)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end md:justify-center mt-4 md:mt-0">
                  <Link to={`/orders/${item._id}`}
                    className="inline-flex items-center gap-2 bg-[#5f518e] text-white px-5 py-2 rounded-lg font-semibold shadow hover:opacity-90 transition text-sm">
                    <span role="img" aria-label="detail">🔎</span> Xem chi tiết
                  </Link>
                </div>
              </div>
              {/* Hiển thị danh sách sản phẩm */} 
              <div className="border-t pt-4 mt-4">
                {item.items && item.items.length > 0 ? (
                  item.items.map((prod: OrderItem) => (
                    <div key={prod._id} className="flex items-center gap-4 py-2 border-b last:border-b-0">
                      <img src={prod.variantId?.productId?.image || prod.variantId?.image} alt={prod.variantId?.productId?.name} className="w-20 h-20 object-cover rounded border" />
                      <div className="flex-1">
                        <div className="text-xl font-medium text-gray-900">{prod.variantId?.productId?.name || 'Sản phẩm'}</div>
                        <div className="text-xs text-gray-500">
                          {prod.variantId?.attributes?.map((attr, i) => (
                            <span key={i} className="mr-2">{attr.attributeId?.name}: {attr.valueId?.value}</span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500">Số lượng: {prod.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl text-red-500">{prod.price.toLocaleString()}₫</div>
                       
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm">Không có sản phẩm</div>
                )}
              </div>
              
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">Danh sách trống</div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
