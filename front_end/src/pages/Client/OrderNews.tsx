import { Link } from "react-router-dom";

const OrderNews = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm">
        <Link to="/" className="text-gray-500 hover:text-gray-900">Trang chủ</Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to="/orders" className="text-gray-500 hover:text-gray-900">Danh sách đơn hàng</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-black">Thông tin đơn hàng</span>
      </div>

      <div className="mx-auto mt-10">
        <h1 className="mx-auto text-center text-3xl">
          <b>THÔNG TIN ĐƠN HÀNG</b>
        </h1>
      </div>
      <div className="max-w-4xl mx-auto my-8 p-6 bg-white border border-gray-400 shadow-lg rounded-2xl flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1 text-sm space-y-5">
          <p>
            <b>Mã đơn hàng: </b>PH12345 
          </p>
          <p>
            <b>Ngày đặt hàng: </b> 06-06-2025
          </p>
          <p>
            <b>Nội dung: </b> Không có
          </p>
          <p>
            <b>Phương thức thanh toán: </b> COD
          </p>
          <p>
            <b>Tình trạng: </b> Đang xử lý
          </p>
        </div>

        <div className="flex-1">
          <div className="flex items-start gap-4 mb-4">
            <img src="https://i.pravatar.cc/40?img=12" className="w-10 h-10 rounded-full flex-shrink-0" />
            <div>
              <p>
                <b>Đức Dũng</b> <span className="ml-2">0921 386 232</span>
              </p>
              <p className="text-sm text-gray-600">
                46 Ngõ 1 Văn Hội, BTL, Hà Nội
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-start">
                <img
                  src="https://byvn.net/CD9y"
                  className="w-10 h-10 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">JEAN PAUL GAULTIERH</p>
                  <p className="text-xs text-gray-500">Dung tích: 100ml</p>
                  <p className="text-xs text-gray-500">Hương vị: Nhẹ nhàng</p>
                </div>
              </div>
              <div className="text-right text-red-500 font-bold">
                70.000
                <span className="block text-xs text-black">x2</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-start">
                <img
                  src="https://byvn.net/QbEB"
                  className="w-10 h-10 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">JEAN PAUL GAULTIERH</p>
                  <p className="text-xs text-gray-500">Dung tích: 100ml</p>
                  <p className="text-xs text-gray-500">Hương vị: Nhẹ nhàng</p>
                </div>
              </div>
              <div className="text-right text-red-500 font-bold">
                175.000
                <span className="block text-xs text-black">x5</span>
              </div>
            </div>
          </div>

          <div className="text-right mt-4 text-lg text-red-500 font-bold">
            Tổng tiền: 245.000
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderNews;