import { Link } from "react-router-dom";
const products = [
    {
      name: "Hermès Terre D’Hermès",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnXWCmQ8C31imSYQW7NCdTw_MacvkN8aUm5g&s",
      price: "2.369.000 VND",
    },
    {
      name: "Montblanc Explorer",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA8Uanpw_1K0nQkRA9EUh366Npb19lf3FWdw&s",
      price: "2.369.000 VND",
    },
    {
      name: "Le Labo Santal 33",
      image: "https://classic.vn/wp-content/uploads/2021/10/nuoc-hoa-le-labo-santal-33-50ml.webp",
      price: "2.369.000 VND",
    },
    {
      name: "Dolce & Gabbana The One EDP",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh4zAB73Cnc0TyH7KnWoM_EUKJMfy18wSWGQ&s",
      price: "2.369.000 VND",
    },
  ];
const OrderSuccessfully = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-black">
        ĐƠN HÀNG ĐÃ ĐƯỢC ĐẶT THÀNH CÔNG!
      </h1>
      <h2 className="text-xl md:text-2xl font-semibold text-center text-black mt-2">
        ĐANG CHỜ XỬ LÝ...
      </h2>

      <div className="flex justify-center gap-6 mt-6 flex-wrap">
        <Link
          to="/"
          className="bg-[#6B5CA5] text-white px-6 py-3 rounded font-semibold hover:opacity-90"
        >
          Tiếp tục mua sắm
        </Link>
        <Link
          to="/orders"
          className="bg-[#6B5CA5] text-white px-6 py-3 rounded font-semibold hover:opacity-90"
        >
          Theo dõi đơn hàng
        </Link>
      </div>

      <div className="w-full mt-10">
        <h3 className="text-xl font-bold border-b-2 border-purple-600 inline-block mb-6">
          XEM THÊM CÁC SẢN PHẨM KHÁC
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {products.map((product, index) => (
            <div key={index} className="relative text-center">
              <span className="absolute top-2 left-12 bg-[#6B5CA5] text-white text-xs font-semibold px-3 py-1 rounded-md">
                MỚI
                </span>
              <img
                src={product.image}
                alt={product.name}
                className="h-60 object-contain mx-auto"
              />
              <div className="text-sm font-medium mt-3">{product.name}</div>
              <div className="text-xs text-gray-400 mb-1">★★★★★</div>
              <div className="text-red-600 font-bold">{product.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    
  );
};

export default OrderSuccessfully;
