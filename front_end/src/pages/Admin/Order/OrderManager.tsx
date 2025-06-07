import { Link } from "react-router-dom";

const OrderManager = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Danh sách đơn hàng</h2>
      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="px-4 py-2">Mã đơn hàng</th>
            <th className="px-4 py-2">Mã khách hàng</th>
            <th className="px-4 py-2">Trạng thái</th>
            <th className="px-4 py-2">Tổng tiền</th>
            <th className="px-4 py-2">Mã giảm giá</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2">1</td>
            <td className="px-4 py-2">1</td>
            <td className="px-4 py-2 text-green-600 font-semibold">
              Giao thành công
            </td>
            <td className="px-4 py-22 text-red-600 font-semibold">160.000</td>
            <td className="px-4 py-22">Không có</td>
            <td className="px-4 py-2">
              <Link to={"/admin/orderDetails"} className="border bg-blue-600 hover:bg-blue-700 text-white hover:text-white px-3 py-1 rounded-md text-xs transition duration-200">
                Xem chi tiết
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderManager;
