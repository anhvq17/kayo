import { Link } from "react-router-dom";

const OrderManagerDetail = () => {
  return (
    <div className="overflow-x-auto px-4 py-2 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng - #2711</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <strong>Khách hàng:</strong> Nguyễn Văn A
        </div>
        <div>
          <strong>Ngày đặt hàng:</strong> 2025-05-21
        </div>
        <div>
          <strong>Mã khách hàng:</strong> PH53812
        </div>
        <div>
          <strong>Trạng thái:</strong> Đang xử lý
        </div>
        <div>
          <strong>Phương thức thanh toán:</strong> Tiền mặt
        </div>
        <div className="col-span-2">
          <strong>Địa chỉ giao hàng:</strong> 13 Trịnh Văn Bô, Nam Từ Liêm, Hà
          Nội
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Sản phẩm</h3>
        <table className="w-full border border-gray-300 mb-4">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="border px-4 py-2">Tên sản phẩm</th>
              <th className="border px-4 py-2">Biến thể</th>
              <th className="border px-4 py-2">Số lượng</th>
              <th className="border px-4 py-2">Đơn giá</th>
              <th className="border px-4 py-2">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Bánh trung thu nhân đậu đỏ</td>
              <td className="border px-4 py-2">500ml</td>
              <td className="border px-4 py-2">2</td>
              <td className="border px-4 py-2">50.000đ</td>
              <td className="border px-4 py-2">100.000đ</td>
            </tr>
          </tbody>
        </table>
        
        <div className="text-right font-semibold pb-2">
          Tổng tiền: <span className="text-red-600">160.000đ</span>
          <div className="pt-4">
            <Link to={'/dashboard/orderDetails/edit/:id'}>
            <button
            type="submit"
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-black hover:text-white"
            >
              Sửa
            </button>
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderManagerDetail