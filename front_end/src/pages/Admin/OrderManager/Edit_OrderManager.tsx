import { Link } from "react-router-dom";

const Edit_OrderManager = () => {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Sửa đơn hàng - #2711</h2>
      <form>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="orderId"
          >
            Mã đơn hàng
          </label>
          <input
            type="text"
            id="orderId"
            name="orderId"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={"#2711"}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="customerName"
          >
            Tên khách hàng
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={"Nguyễn Văn A"}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="orderDate"
          >
            Ngày đặt hàng
          </label>
          <input
            type="date"
            id="orderDate"
            name="orderDate"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={"2025-05-20"}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="status"
          >
            Trạng thái
          </label>
          <select
            id="status"
            name="status"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={"pending"}
          >
            <option>-- Chọn trạng thái --</option>
            <option value="pending">Đang xử lý</option>
            <option value="shipped">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <Link to={'/dashboard/orderDetails'}>
            <button
              type="reset"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
          </Link>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit_OrderManager;
