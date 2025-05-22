import { Link } from "react-router-dom";

const vouchers = [
  {
    _id: 1,
    code: "NAM15",
    discountType: "percent",
    discountValue: 15,
    minOrderValue: 500000,
    expDate: "2025-06-30T23:59:59Z",
    isActive: true,
    createdAt: "2024-05-01T10:00:00Z",
    updatedAt: "2024-05-10T12:00:00Z"
  },
  {
    _id: 2,
    code: "NU100K",
    discountType: "amount",
    discountValue: 100000,
    minOrderValue: 700000,
    expDate: "2025-07-15T23:59:59Z",
    isActive: false,
    createdAt: "2024-05-01T10:00:00Z",
    updatedAt: "2024-05-10T12:00:00Z"
  },
  {
    _id: 3,
    code: "UNISEX10",
    discountType: "percent",
    discountValue: 10,
    minOrderValue: 300000,
    expDate: "2025-12-31T23:59:59Z",
    isActive: true,
    createdAt: "2024-05-01T10:00:00Z",
    updatedAt: "2024-05-10T12:00:00Z"
  }
];

const VoucherManager = () => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold mb-4">Quản lý mã giảm giá</h1>
        <Link to={``}>
          <button className="border bg-white hover:bg-blue-600 hover:text-white px-3 py-1 rounded-md text-xs transition duration-200">Thêm</button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow text-sm">
          <thead>
            <tr className="bg-black text-white text-left">
              <th className="px-3 py-2 border-b">ID</th>
              <th className="px-3 py-2 border-b">Mã giảm giá</th>
              <th className="px-3 py-2 border-b">Loại</th>
              <th className="px-3 py-2 border-b">Số</th>
              <th className="px-3 py-2 border-b">Giá tối thiểu</th>
              <th className="px-3 py-2 border-b">Trạng thái</th>
              <th className="px-3 py-2 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher) => (
              <tr key={voucher._id} className="hover:bg-gray-50">
                <td className="px-3 py-2 border-b">{voucher._id}</td>
                <td className="px-3 py-2 border-b">{voucher.code}</td>
                <td className="px-3 py-2 border-b">{voucher.discountType}</td>
                <td className="px-3 py-2 border-b">{voucher.discountValue}</td>
                <td className="px-3 py-2 border-b">{voucher.minOrderValue}</td>
                <td className="px-3 py-2 border-b">
                  {voucher.isActive ? "Hoạt động" : "Không hoạt động"}
                </td>
                <td className="px-3 py-2 border-b space-x-1">
                  <button className="border hover:bg-red-600 hover:text-white px-3 py-1 rounded-md text-xs transition duration-200">Xoá</button>
                  <button className="border hover:bg-green-600 hover:text-white px-3 py-1 rounded-md text-xs transition duration-200">Sửa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VoucherManager;