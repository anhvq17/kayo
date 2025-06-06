import { useState } from "react";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");

  return (
    <div className="flex w-full min-h-screen">
      <div className="w-1/2 p-10 ml-10">
        <a href="cart" className="text-sm text-purple-700">&lt; Quay lại giỏ hàng</a>

        <h2 className="mt-6 mb-2 text-lg font-semibold">Thông tin nhận hàng</h2>
        <div className="ml-5 space-y-3 mt-4">
            <input type="text" placeholder="Họ và tên" className="w-full p-2 border rounded" />
            <input type="email" placeholder="gmail" className="w-full p-2 border rounded" />
            <input type="text" placeholder="Số điện thoại" className="w-full p-2 border rounded" />
        </div>


        <h2 className="mt-6 mb-2 text-lg font-semibold">Địa chỉ nhận hàng</h2>
        <div className="grid grid-cols-2 gap-4 mt-4 ml-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tỉnh/Thành phố</label>
            <select className="w-full p-2 border rounded">
              <option>Hà Nội</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Quận/Huyện</label>
            <select className="w-full p-2 border rounded">
              <option>Bắc Từ Liêm</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Phường/Xã</label>
            <select className="w-full p-2 border rounded">
              <option>Đức Thắng</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Địa chỉ chi tiết</label>
            <input type="text" placeholder="" className="w-full p-2 border rounded" />
          </div>
        </div>

        <h2 className="mt-6 mb-2 text-lg font-semibold">Phương thức thanh toán</h2>
        <div className="mt-4 ml-5">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
              className="form-radio text-purple-600"
            />
            <span>Thanh toán khi nhận hàng</span>
          </label>
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "vnpay"}
              onChange={() => setPaymentMethod("vnpay")}
              className="form-radio text-purple-600"
            />
            <span>Tài khoản ngân hàng liên kết VNPay</span>
          </label>
        </div>
      </div>

      <div className="w-1/2 bg-[#eaf0f2] p-10">
        <div className="space-y-6">
          {/* Product 1 */}
          <div className="flex items-center space-x-4">
            <img src="https://byvn.net/QbEB" alt="Product" className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <p className="font-semibold text-sm">JEAN PAUL GAULTIERH</p>
              <p className="text-xs text-gray-600">Dung tích: 100ml</p>
              <p className="text-xs text-gray-600">Hương vị: Nhẹ nhàng</p>
            </div>
            <div className="text-right">
              <p className="text-red-600 font-semibold text-sm">2.480.000 VND</p>
              <p className="text-xs text-gray-500">x1</p>
            </div>
          </div>

          {/* Product 2 */}
          <div className="flex items-center space-x-4">
            <img src="https://byvn.net/CD9y" alt="Product" className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <p className="font-semibold text-sm">JEAN PAUL GAULTIERH</p>
              <p className="text-xs text-gray-600">Dung tích: 100ml</p>
              <p className="text-xs text-gray-600">Hương vị: Nhẹ nhàng</p>
            </div>
            <div className="text-right">
              <p className="text-red-600 font-semibold text-sm">2.480.000 VND</p>
              <p className="text-xs text-gray-500">x1</p>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4 text-sm text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span>Tổng tiền hàng</span>
              <span>4.960.000 VND</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>30.000 VND</span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-bold text-red-600 border-t border-gray-300 pt-4">
            <span>Tổng tiền</span>
            <span>4.990.000 VND</span>
          </div>

          <div className="text-center pt-6">
            <button className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-2 rounded">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
