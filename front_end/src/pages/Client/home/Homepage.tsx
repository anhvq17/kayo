import { Link } from "react-router-dom"
import { ArrowRight, Package, Shield, CreditCard } from "lucide-react"
import ProductMale from "../../../components/home/productMale";
import ProductFemale from "../../../components/home/productFemale";

const Homepage = () => {
  return (
    <div className="relative w-full">
      <img src="/img/banner.jpg" className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] object-cover object-center" />

      <ProductMale />

      <ProductFemale />

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

export default Homepage;