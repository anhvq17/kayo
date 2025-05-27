const ProductManager = () => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold mb-4">Quản lý sản phẩm</h1>

        <button className="border bg-white hover:bg-blue-600 hover:text-white px-3 py-1 rounded-md text-xs transition duration-200">Thêm</button>

      </div>
      {/* Bảng danh sách sản phẩm */}
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Tên sản phẩm</th>
            <th className="px-4 py-2 border">Ảnh </th>
            <th className="px-4 py-2 border">Giá </th>
            <th className="px-4 py-2 border">Mô tả </th>
            <th className="px-4 py-2 border">dung tích </th>
            <th className="px-4 py-2 border">Mùi hương</th>
            <th className="px-4 py-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border">Nước hoa</td>
            <td className="px-4 py-2 border"><img src="" alt="Nước hoa" /></td>
            <td className="px-4 py-2 border ">120.000đ</td>
            <td className="px-4 py-2 border ">Nước hoa ábcaskasa</td>
            <td className="px-4 py-2 border "></td>
            <td className="px-4 py-2 border ">ákdasa</td>
            <td className="px-4 py-2 border">
              <button className="bg-yellow-400 text-white px-2 py-1 rounded mr-2">Sửa</button>
              <button className="bg-red-500 text-white px-2 py-1 rounded">Xoá</button>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  );
};

export default ProductManager;
