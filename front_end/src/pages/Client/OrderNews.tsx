import React from "react";
import { Link } from "react-router-dom";

const OrderNews = () => {
  return (
    <div>
      <div className="pt-8 px-8">
        <Link to={"/"} className="text-gray-400">
          <span className="text-xl">&lt;</span> Quay về trang chủ
        </Link>
      </div>
      <div className="mx-auto">
        <h1 className="mx-auto text-center text-3xl">
          <b>THÔNG TIN ĐƠN HÀNG</b>
        </h1>
      </div>
      {/* thông tin đơn hàng */}
      <div className="max-w-4xl mx-auto my-8 p-6 bg-white border border-gray-400 shadow-lg rounded-2xl flex flex-col md:flex-row justify-between gap-6">
        {/* Left: Order Info */}
        <div className="flex-1 text-sm space-y-2">
          <p>
            <b>Mã đơn hàng:</b> 
          </p>
          <p>
            <b>Ngày đặt hàng:</b> 
          </p>
          <p>
            <b>Nội dung:</b> 
          </p>
          <p>
            <b>Phương thức thanh toán:</b> 
          </p>
          <p>
            <b>Tình trạng:</b> 
          </p>
        </div>

        {/* Right: User + Items */}
        <div className="flex-1">
          {/* User Info */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />
            <div>
              <p>
                <b>Đức Dũng</b> <span className="ml-2">0921 386 232</span>
              </p>
              <p className="text-sm text-gray-600">
                46 Ngõ 1 Văn Hội, BTL, Hà Nội
              </p>
            </div>
          </div>

          {/* Product List */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-start">
                <img
                  src="/product1.jpg"
                  alt="product"
                  className="w-10 h-10 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">JEAN PAUL GAULTIERH</p>
                  <p className="text-xs text-gray-500">Dung tích: 100ml</p>
                  <p className="text-xs text-gray-500">Hương vị: Nhẹ nhàng</p>
                </div>
              </div>
              <div className="text-right text-red-500 font-semibold">
                2.480.000 VND{" "}
                <span className="block text-xs text-black">x1</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-start">
                <img
                  src="/product2.jpg"
                  alt="product"
                  className="w-10 h-10 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">JEAN PAUL GAULTIERH</p>
                  <p className="text-xs text-gray-500">Dung tích: 100ml</p>
                  <p className="text-xs text-gray-500">Hương vị: Nhẹ nhàng</p>
                </div>
              </div>
              <div className="text-right text-red-500 font-semibold">
                2.480.000 VND{" "}
                <span className="block text-xs text-black">x1</span>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="text-right mt-4 text-lg font-bold">
            Thành tiền: 4.990.000 VND
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderNews;
