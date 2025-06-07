import { useState } from "react";
import { Link } from "react-router-dom";

const DetailOrder = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Chi tiết đơn hàng - 1</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <strong>Khách hàng:</strong> Nguyễn Văn A
        </div>
        <div>
          <strong>Ngày đặt hàng:</strong> 20-05-2025
        </div>
        <div>
          <strong>Mã khách hàng:</strong> 1
        </div>
        <div>
          <strong>Trạng thái:</strong> Giao thành công
        </div>
        <div>
          <strong>Phương thức thanh toán:</strong> Nhận hàng thanh toán (COD)
        </div>
        <div className="col-span-2">
          <strong>Địa chỉ giao hàng:</strong> 13 Trịnh Văn Bô, Nam Từ Liêm, Hà Nội
        </div>
      </div>

      <div>
        <table className="w-full border border-gray-300 mb-4">
          <thead className="bg-black text-white text-left text-sm">
            <tr>
              <th className="px-4 py-2">Tên sản phẩm</th>
              <th className="px-4 py-2">Dung tích</th>
              <th className="px-4 py-2">Số lượng</th>
              <th className="px-4 py-2">Đơn giá</th>
              <th className="px-4 py-2">Thành tiền</th>
              <th className="px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr>
              <td className="border px-4 py-2">Dior Perfume</td>
              <td className="border px-4 py-2">500ml</td>
              <td className="border px-4 py-2">2</td>
              <td className="border px-4 py-2">80.000</td>
              <td className="border px-4 py-2">160.000</td>
              <td className="border px-4 py-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="border bg-green-600 hover:bg-green-700 text-white hover:text-white px-3 py-1 rounded-md text-xs transition duration-200"
                >
                  Sửa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end mt-3">
          <Link to={'/admin/orders'}>
            <button type="submit" className="border bg-gray-600 hover:bg-gray-700 text-white hover:text-white px-3 py-1 rounded-md text-xs transition duration-200">Quay lại</button>
          </Link>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg relative">
            <h3 className="text-lg font-semibold mb-4">Thay đổi trạng thái đơn hàng</h3>
            <div className="mb-4">
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="shipped">
                <option disabled value="">-- Chọn trạng thái --</option>
                <option value="pending">Đang xử lý</option>
                <option value="transport">Đang giao hàng</option>
                <option value="shipped">Giao thành công</option>
                <option value="refund">Đã hoàn hàng</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
            <div className="flex justify-end space-x-1">
              <button type="reset" onClick={() => setIsModalOpen(false)} className="border bg-gray-600 hover:bg-gray-700 text-white hover:text-white px-3 py-1 rounded-md text-xs transition duration-200">Hủy</button>
              <button type="submit" className="border bg-blue-600 hover:bg-blue-700 text-white hover:text-white px-3 py-1 rounded-md text-xs transition duration-200">Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailOrder;