import { Link } from "react-router-dom"

const Wallet = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm mb-6">
        <Link to="/" className="text-gray-500 hover:text-gray-900">Trang chủ</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-black">Ví của tôi</span>
      </div>
      Wallet
    </div>
  )
}

export default Wallet