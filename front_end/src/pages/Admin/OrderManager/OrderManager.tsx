import { Link } from "react-router-dom";

const OrderManager = () => {
  return (
    <div className="overflow-x-auto px-4 py-2 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Danh sách đơn hàng</h2>
      <table className="table-auto border-collapse w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border border-gray-300 px-4 py-2">STT</th>
            <th className="border border-gray-300 px-4 py-2">Mã đơn hàng</th>
            <th className="border border-gray-300 px-4 py-2">Mã khách hàng</th>
            <th className="border border-gray-300 px-4 py-2">Ngày tạo</th>
            <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
            <th className="border border-gray-300 px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-auto">1</td>
            <td className="border border-gray-300 px-4 py-2">#2711</td>
            <td className="border border-gray-300 px-4 py-2">PH53812</td>
            <td className="border border-gray-300 px-4 py-2">2025-05-20</td>
            <td className="border border-gray-300 px-4 py-2 text-yellow-400 font-semibold">
              Đang xử lý
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <Link
                to={"/dashboard/orderDetails"}
                className="text-blue-500 hover:underline mr-2"
              >
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
