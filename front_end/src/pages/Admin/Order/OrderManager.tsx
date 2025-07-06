import { Link } from "react-router-dom";

const orders = [
  {
    id: '1',
    customerId: 'KH001',
    status: 'Đã giao hàng',
    paymentStatus: 'Đã thanh toán',
    total: 160000,
    voucher: 'Không có',
  },
  {
    id: '2',
    customerId: 'KH002',
    status: 'Chờ xử lý',
    paymentStatus: 'Chưa thanh toán',
    total: 250000,
    voucher: 'SUMMER2024',
  },
  {
    id: '3',
    customerId: 'KH003',
    status: 'Đang giao hàng',
    paymentStatus: 'Đã thanh toán',
    total: 320000,
    voucher: 'Không có',
  },
];

const getStatusBadge = (status: string) => {
  let color = '';
  switch (status) {
    case 'Đã giao hàng': color = 'bg-green-100 text-green-800'; break;
    case 'Chờ xử lý': color = 'bg-yellow-100 text-yellow-800'; break;
    case 'Đang giao hàng': color = 'bg-blue-100 text-blue-800'; break;
    case 'Đã nhận hàng': color = 'bg-green-200 text-green-900'; break;
    case 'Đã huỷ đơn hàng': color = 'bg-red-100 text-red-800'; break;
    default: color = 'bg-gray-100 text-gray-800';
  }
  return <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{status}</span>;
};

const getPaymentStatusText = (status: string) => {
  if (status === 'paid' || status === 'Đã thanh toán') return 'Đã thanh toán';
  if (status === 'unpaid' || status === 'Chưa thanh toán') return 'Chưa thanh toán';
  return status;
};

const getPaymentBadge = (paymentStatus: string) => (
  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
    getPaymentStatusText(paymentStatus) === 'Đã thanh toán' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
  }`}>
    {getPaymentStatusText(paymentStatus)}
  </span>
);

const OrderManager = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2"><span role="img" aria-label="order">📦</span> Quản lý đơn hàng</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border text-sm rounded-xl shadow-lg">
          <thead>
            <tr className="bg-black text-white text-left">
              <th className="px-4 py-2">Mã đơn hàng</th>
              <th className="px-4 py-2">Mã khách hàng</th>
              <th className="px-4 py-2">Trạng thái đơn hàng</th>
              <th className="px-4 py-2">Trạng thái thanh toán</th>
              <th className="px-4 py-2">Tổng tiền</th>
              <th className="px-4 py-2">Mã giảm giá</th>
              <th className="px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 font-semibold">{order.id}</td>
                <td className="px-4 py-2">{order.customerId}</td>
                <td className="px-4 py-2">{getStatusBadge(order.status)}</td>
                <td className="px-4 py-2">{getPaymentBadge(order.paymentStatus)}</td>
                <td className="px-4 py-2 text-red-600 font-semibold">{order.total.toLocaleString()}₫</td>
                <td className="px-4 py-2">{order.voucher}</td>
                <td className="px-4 py-2">
                  <Link to={"/admin/orderDetails"} className="inline-flex items-center gap-2 border bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs font-semibold shadow transition duration-200">
                    <span role="img" aria-label="detail">🔎</span> Xem chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManager;
