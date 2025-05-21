import { Link } from "react-router-dom";

const categories = [
  {
    _id: 1,
    name: "Nam",
    description: "Hương gỗ trầm ấm và cay nồng, mang lại cảm giác mạnh mẽ và nam tính.",
    status: "Hoạt động",
    createdAt: "2024-05-01T10:00:00Z",
    updatedAt: "2024-05-10T12:00:00Z",
  },
  {
    _id: 2,
    name: "Nữ",
    description: "Hương hoa ngọt ngào và thanh lịch, tôn lên vẻ dịu dàng và quyến rũ.",
    status: "Hoạt động",
    createdAt: "2024-05-01T10:00:00Z",
    updatedAt: "2024-05-10T12:00:00Z",
  },
  {
    _id: 3,
    name: "UNISEX",
    description: "Mùi hương trung tính, tươi mát và phóng khoáng, phù hợp cho mọi giới.",
    status: "Hoạt động",
    createdAt: "2024-05-01T10:00:00Z",
    updatedAt: "2024-05-10T12:00:00Z",
  },
];

const CategoryManager = () => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold mb-4">Quản lý danh mục</h1>
        <Link to={``}>
          <button className="border bg-white hover:bg-blue-600 hover:text-white px-3 py-1 rounded-md text-xs transition duration-200">Thêm</button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow text-sm">
          <thead>
            <tr className="bg-black text-white text-left">
              <th className="px-3 py-2 border-b">ID</th>
              <th className="px-3 py-2 border-b">Tên danh mục</th>
              <th className="px-3 py-2 border-b">Trạng thái</th>
              <th className="px-3 py-2 border-b">Mô tả</th>
              <th className="px-3 py-2 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="px-3 py-2 border-b">{category._id}</td>
                <td className="px-3 py-2 border-b">{category.name}</td>
                <td className="px-3 py-2 border-b">{category.description}</td>
                <td className="px-3 py-2 border-b">{category.status}</td>
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

export default CategoryManager;