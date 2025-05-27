import { Link } from "react-router-dom";

const ProductManager = () => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold mb-4">Danh sách sản phẩm</h1>
        <Link to={`/dashboard/products/add`}>
          <button className="border bg-blue-600 hover:bg-blue-700 text-white hover:text-white px-3 py-1 rounded-md text-xs transition duration-200">Thêm</button>
        </Link>
      </div>
      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Danh mục</th>
            <th className="px-4 py-2">Thương hiệu</th>
            <th className="px-4 py-2">Tên sản phẩm</th>
            <th className="px-4 py-2">Mô tả</th>
            <th className="px-4 py-2">Trạng thái</th>
            <th className="px-4 py-2">Số lượng</th>
            <th className="px-4 py-2">Mùi hương</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2">1</td>
            <td className="px-4 py-2">Nam</td>
            <td className="px-4 py-2">Dior</td>
            <td className="px-4 py-2">Dior Perfume</td>
            <td className="px-4 py-2">Dòng nước hoa dành cho phái mạnh.</td>
            <td className="px-4 py-2">Còn hàng</td>
            <td className="px-4 py-2">10</td>
            <td className="px-4 py-2">Mạnh mẽ</td>
            <td className="px-4 py-2 space-x-1">
              <button className="border bg-red-600 hover:bg-red-700 text-white hover:text-white px-3 py-1 rounded-md text-xs transition duration-200">Xoá</button>
              <Link to={`/dashboard/products/edit/:id`}>
                <button className="border bg-green-600 hover:bg-green-700 text-white hover:text-white px-3 py-1 rounded-md text-xs transition duration-200">Sửa</button>
              </Link>
            </td>
          </tr>  
        </tbody>
      </table>
    </div>
  );
};

export default ProductManager;
