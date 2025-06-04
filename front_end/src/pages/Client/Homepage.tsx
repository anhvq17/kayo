import { Link } from "react-router-dom"
import { ArrowRight, Package, Shield, CreditCard } from "lucide-react"

const products = [
  {
    id: 1,
    name: "GUCCI",
    price: 30.0,
    status: "IN STOCK",
    image: "https://byvn.net/990K",
  },
  {
    id: 2,
    name: "Jean Paul Gaultier",
    price: 35.0,
    status: "IN STOCK",
    image: "https://byvn.net/QbEB",
  },
  {
    id: 3,
    name: "Jean Paul Gaultier",
    price: 35.0,
    status: "IN STOCK",
    image: "https://byvn.net/CD9y",
  },
  {
    id: 4,
    name: "ULTRANET Black",
    price: 30.0,
    status: "IN STOCK",
    image: "https://byvn.net/w4FI",
  },
];

const Homepage = () => {
  return (
    <div className="relative w-full">
      <img src="/img/banner.jpg" className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] object-cover object-center" />

      <section className="py-12 bg-white">
        <div className="container mx-auto px-6 md:px-10 xl:px-16">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold mb-5 text-black">NƯỚC HOA NAM</h2>
            <Link to="/products" className="text-base transition-colors duration-200">
              Xem thêm →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div className="mb-3 aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium text-black text-sm">{product.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs font-medium text-green-600">{product.status}</div>
                  <div className="text-sm font-medium text-red-500">{product.price.toFixed(3)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-6 md:px-10 xl:px-16">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold mb-5 text-black">NƯỚC HOA NỮ</h2>
            <Link to="/products" className="text-base transition-colors duration-200">
              Xem thêm →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div className="mb-3 aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium text-black text-sm">{product.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs font-medium text-green-600">{product.status}</div>
                  <div className="text-sm font-medium text-red-500">{product.price.toFixed(3)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-center md:justify-between gap-10">
            <div className="md:w-1/2 mb-8 md:mb-0 ml-12">
              <h2 className="text-3xl text-white font-bold mb-4">KHÁM PHÁ THIÊN ĐƯỜNG NƯỚC HOA!</h2>
              <p className="text-white mb-6">
                Khám phá bộ sưu tập nước hoa cao cấp, đa dạng hương thơm từ Sevend – nơi tôn vinh cá tính, cảm xúc và gu thẩm mỹ riêng của bạn qua từng tầng hương...
              </p>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 text-base bg-white text-[#1a1a1a] font-medium rounded-full transition-colors"
              >
                Khám phá ngay
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="/img/featured.jpg"
                height={"500px"} width={"500px"}
                className="max-w-full h-auto rounded-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-10 xl:px-16">
          <div className="flex justify-center mb-8">
            <div className="inline-flex border-b">
              <button className="px-4 py-2 text-base font-medium border-b-2 text-black border-gray-900">Nổi bật</button>
              <button className="px-4 py-2 text-base font-medium text-gray-500">Mới nhất</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div className="mb-3 aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium text-black text-sm">{product.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs font-medium text-green-600">{product.status}</div>
                  <div className="text-sm font-medium text-red-500">{product.price.toFixed(3)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gray-">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 text-[#5f518e] bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-black mb-2">Miễn Phí Vận Chuyển</h3>
              <p className="text-gray-600 text-sm">
                Nâng tầm phong cách – nhận ngay MIỄN PHÍ vận <br /> chuyển cho mọi đơn hàng. Đặt mua ngay!
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 text-[#5f518e] bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-black mb-2">Cam Kết Hài Lòng</h3>
              <p className="text-gray-600 text-sm">
                Mua sắm an tâm với chính sách hoàn tiền nếu không hài <br /> lòng. Sự hài lòng của bạn là ưu tiên của chúng tôi!
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 text-[#5f518e] bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-black mb-2">An Toàn & Bảo Mật</h3>
              <p className="text-gray-600 text-sm">
                Mọi giao dịch đều được mã hóa và bảo vệ. <br /> Thanh toán dễ dàng, bảo mật tuyệt đối!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Homepage