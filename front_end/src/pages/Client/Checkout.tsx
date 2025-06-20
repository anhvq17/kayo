import { useState } from "react";
import { Link } from "react-router-dom";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm">
        <Link to="/" className="text-gray-500 hover:text-gray-900">Trang chủ</Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to="/cart" className="text-gray-500 hover:text-gray-900">Giỏ hàng</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-black">Thanh toán</span>
      </div>

      <div className="flex flex-col md:flex-row w-full min-h-screen p-4 md:p-6 gap-6">
        <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Thông tin nhận hàng
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Họ và tên"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#696faa]"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#696faa]"
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#696faa]"
            />
          </div>

          <h2 className="mt-10 mb-4 text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Địa chỉ nhận hàng
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Tỉnh/Thành phố
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#696faa]">
                <option>Hà Nội</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Quận/Huyện
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#696faa]">
                <option>Bắc Từ Liêm</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Phường/Xã
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#696faa]">
                <option>Đức Thắng</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Địa chỉ chi tiết
              </label>
              <input
                type="text"
                placeholder="Số nhà, tên đường..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#696faa]"
              />
            </div>
          </div>

          <h2 className="mt-10 mb-4 text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Phương thức thanh toán
          </h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="w-5 h-5 text-[#696faa] focus:ring-[#696faa] border-gray-300"
              />
              <span className="text-gray-700 font-medium">Thanh toán khi nhận hàng</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "vnpay"}
                onChange={() => setPaymentMethod("vnpay")}
                className="w-5 h-5 text-[#696faa] focus:ring-[#696faa] border-gray-300"
              />
              <span className="text-gray-700 font-medium">Tài khoản ngân hàng liên kết VNPay</span>
            </label>
          </div>
        </div>

        <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-md flex flex-col justify-between">
          <div className="space-y-8">
            <div className="flex items-center space-x-5">
              <img
                src="https://byvn.net/CD9y"
                className="w-24 h-24 object-cover rounded-md shadow-sm"
              />
              <div className="flex-1">
                <p className="font-semibold text-base text-gray-800">JEAN PAUL GAULTIERH</p>
                <p className="text-sm text-gray-500">Dung tích: 100ml</p>
                <p className="text-sm text-gray-500">Hương vị: Nhẹ nhàng</p>
              </div>
              <div className="text-right">
                <p className="text-red-600 font-bold text-lg">70.000</p>
                <p className="text-sm text-gray-400">x1</p>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-6 text-gray-700 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Tổng tiền hàng</span>
                <span>245.000</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 mt-6 pt-6 flex justify-between items-center">
            <span className="text-xl font-bold text-red-600">Tổng tiền</span>
            <span className="text-xl font-bold text-red-600">245.000</span>
          </div>

          <Link to={`/ordersuccessfully`}>
            <button
              className="mt-8 w-full bg-[#5f518e] hover:bg-[#696faa] transition-colors text-white font-semibold py-3 rounded-md shadow-lg"
              type="button"
            >
              Xác nhận
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

