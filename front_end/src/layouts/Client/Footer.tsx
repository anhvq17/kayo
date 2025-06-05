import { Link } from "react-router-dom"

const ClientFooter = () => {
  return (
    <footer>
      <div className="bg-[#696faa] text-white py-10 px-4 text-center">
        <h2 className="text-xl md:text-xl font-semibold mb-2">
          Nhận thông tin của chúng tôi
        </h2>
        <p className="text-sm uppercase md:text-sm mb-6">
          Đăng ký bản tin để nhận những ưu đãi đặc biệt và tin tức độc quyền về các sản phẩm của SEVEND
        </p>
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center">
          <input type="email" placeholder="Nhập email của bạn" className="px-4 py-2 w-full sm:w-2/3 rounded-l-full text-sm text-black outline-none" />
          <button className="bg-[#5f518e] px-6 py-2 rounded-r-full mt-2 sm:mt-0 text-white text-sm">Xác nhận</button>
        </div>
      </div>

      <div className="bg-[#696faa] text-white px-6 py-8 border-t">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-14 text-sm">
          <div>
            <img src="/img/logo.png" alt="Logo" className="w-28 mb-4" />
            <p className="mb-2"><i className="fas fa-envelope mr-2"></i>support@sevendperfume.com</p>
            <p className="mb-2"><i className="fas fa-phone mr-2"></i>0897 777 007</p>
            <p className="mb-2"><i className="fas fa-map-marker-alt mr-2"></i>Tầng 5, Toà nhà Lotus Building<br />Số 2 Duy Tân, DVH, Cầu Giấy, Hà Nội</p>
            <div className="flex space-x-4 mt-2 text-lg text-black">
              <Link to="#"><i className="fab fa-facebook"></i></Link>
              <Link to="#"><i className="fab fa-instagram"></i></Link>
              <Link to="#"><i className="fab fa-x-twitter"></i></Link>
              <Link to="#"><i className="fab fa-youtube"></i></Link>
              <Link to="#"><i className="fab fa-whatsapp"></i></Link>
            </div>
          </div>

          <div className="ml-12">
            <h3 className="font-bold text-base mb-3">DỊCH VỤ KHÁCH HÀNG</h3>
            <ul className="space-y-2">
              <li><Link to="#">Trung tâm hỗ trợ</Link></li>
              <li><Link to="#">Tư vấn chọn nước hoa</Link></li>
              <li><Link to="#">Chính sách giao hàng & đổi trả</Link></li>
              <li><Link to="#">Điều khoản sử dụng dịch vụ</Link></li>
              <li><Link to="#">Chính sách hoàn tiền & bảo đảm</Link></li>
            </ul>
          </div>

          <div className="ml-28">
            <h3 className="font-bold text-base mb-3">VỀ SEVEND</h3>
            <ul className="space-y-2">
              <li><Link to="#">Góc thương hiệu</Link></li>
              <li><Link to="#">Cam kết chất lượng</Link></li>
              <li><Link to="#">Đối tác & phân phối</Link></li>
              <li><Link to="#">Tuyển dụng</Link></li>
              <li><Link to="#">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          <div className="ml-28">
            <h3 className="font-bold text-base mb-3">KHÁM PHÁ</h3>
            <ul className="space-y-2">
              <li><Link to="#">Bộ sưu tập nước hoa</Link></li>
              <li><Link to="#">Quà tặng & ưu đãi</Link></li>
              <li><Link to="#">Blog phong cách sống</Link></li>
              <li><Link to="#">Hỏi đáp nhanh (FAQ)</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#696faa] border-t border-white text-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="mb-2 sm:mb-0 text-white">Copyright © 2025 by SEVEND</p>
          <div className="flex space-x-3">
            <img src="/img/mc.jpg" className="h-5 object-contain bg-white shadow" />
            <img src="/img/vs.jpg" className="h-5 object-contain bg-white shadow" />
            <img src="/img/ae.jpg" className="h-5 object-contain bg-white shadow" />
            <img src="/img/pp.jpg" className="h-5 object-contain bg-white shadow" />
            <img src="/img/mt.jpg" className="h-5 object-contain bg-white shadow" />
          </div>
          <button className="text-white mt-3 sm:mt-0 flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Scroll to Top<i className="fas fa-angle-up ml-2"></i></button>
        </div>
      </div>
    </footer>
  )
}

export default ClientFooter
