import { Link } from "react-router-dom";

const OrderSuccessfully = () => {
  return (
    <div className="flex flex-col items-center px-4 mt-20 mb-24">
      <div className="w-full flex flex-col items-center justify-center p-8">
        <img src="img/successfully.png" className="w-32 h-32 mb-4" />
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">
          Đơn hàng đã được đặt thành công!
        </h2>
        <p className="text-gray-500 text-base text-center max-w-md mb-4">
          Cảm ơn bạn đã mua hàng. <br /> Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất.
        </p>
        <div className="flex justify-center gap-2 mt-10 flex-wrap">
          <Link
            to="/"
            className="bg-[#6B5CA5] text-white px-4 py-2 rounded font-semibold hover:opacity-90"
          >
            Tiếp tục mua sắm
          </Link>
          <Link
            to="/orders"
            className="bg-[#6B5CA5] text-white px-4 py-2 rounded font-semibold hover:opacity-90"
          >
            Theo dõi đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessfully;