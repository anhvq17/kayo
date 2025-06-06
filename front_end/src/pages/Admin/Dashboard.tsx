import { BarChart, LineChart, Users, Package, ShoppingCart } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Bảng điều khiển</h1>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Doanh thu hôm nay */}
        <div className="rounded-xl border bg-white shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500">Doanh thu hôm nay</p>
            <p className="text-xl font-semibold">₫3.200.000</p>
          </div>
          <LineChart className="w-6 h-6 text-blue-500" />
        </div>

        {/* Tổng doanh thu */}
        <div className="rounded-xl border bg-white shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500">Tổng doanh thu</p>
            <p className="text-xl font-semibold">₫62.450.000</p>
          </div>
          <LineChart className="w-6 h-6 text-indigo-500" />
        </div>

        {/* Đơn hàng mới */}
        <div className="rounded-xl border bg-white shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500">Đơn hàng mới</p>
            <p className="text-xl font-semibold">42</p>
          </div>
          <ShoppingCart className="w-6 h-6 text-green-500" />
        </div>

        {/* Sản phẩm */}
        <div className="rounded-xl border bg-white shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500">Sản phẩm</p>
            <p className="text-xl font-semibold">134</p>
          </div>
          <Package className="w-6 h-6 text-yellow-500" />
        </div>

        {/* Người dùng */}
        <div className="rounded-xl border bg-white shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500">Người dùng</p>
            <p className="text-xl font-semibold">832</p>
          </div>
          <Users className="w-6 h-6 text-purple-500" />
        </div>
      </div>

      {/* Biểu đồ và đơn hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ doanh thu */}
        <div className="rounded-xl border bg-white shadow p-4">
          <p className="text-lg font-semibold mb-2">Doanh thu theo ngày</p>
          <div className="h-56 bg-gray-100 flex items-center justify-center rounded-md">
            <BarChart className="w-12 h-12 text-gray-400" />
            <span className="ml-2 text-gray-500">Biểu đồ doanh thu</span>
          </div>
        </div>

        {/* Tình trạng đơn hàng */}
        <div className="rounded-xl border bg-white shadow p-4">
          <p className="text-lg font-semibold mb-4">Tình trạng đơn hàng</p>
          <ul className="space-y-3">
            <li className="flex items-center justify-between bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-md">
              <span className="text-yellow-700 font-medium">Đang xử lý</span>
              <span className="font-semibold text-yellow-700">20</span>
            </li>
            <li className="flex items-center justify-between bg-green-50 border border-green-200 px-4 py-2 rounded-md">
              <span className="text-green-700 font-medium">Đã giao</span>
              <span className="font-semibold text-green-700">15</span>
            </li>
            <li className="flex items-center justify-between bg-red-50 border border-red-200 px-4 py-2 rounded-md">
              <span className="text-red-700 font-medium">Đã huỷ</span>
              <span className="font-semibold text-red-700">7</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
