import { Link } from "react-router-dom";

const brands = [
  {
    _id: "1",
    name: "Chanel",
    image: "https://picsum.photos/200",
    createdAt: "2024-05-01T10:00:00Z",
    updatedAt: "2024-05-10T12:00:00Z",
  },
  {
    _id: "2",
    name: "Dior",
    image: "https://picsum.photos/300",
    createdAt: "2024-05-02T11:00:00Z",
    updatedAt: "2024-05-12T12:00:00Z",
  },
  {
    _id: "3",
    name: "Gucci",
    image: "https://picsum.photos/400",
    createdAt: "2024-05-03T12:00:00Z",
    updatedAt: "2024-05-14T12:00:00Z",
  },
];

const BrandManager = () => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold mb-4">Danh sách thương hiệu</h1>
        <Link to={`/dashboard/brands/add`}>
          <button className="border bg-blue-600 hover:bg-blue-700 text-white hover:text-white px-3 py-1 rounded-md text-xs transition duration-200">Thêm</button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead>
            <tr className="bg-black text-white text-left">
              <th className="px-3 py-2 border-b">ID</th>
              <th className="px-3 py-2 border-b">Tên thương hiệu</th>
              <th className="px-3 py-2 border-b">Hình ảnh</th>
              <th className="px-3 py-2 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand._id} className="hover:bg-gray-50">
                <td className="px-3 py-2 border-b">{brand._id}</td>
                <td className="px-3 py-2 border-b">{brand.name}</td>
                <td className="px-3 py-2 border-b">
                  <img src={brand.image} alt={brand.name} className="h-8" />
                </td>
                <td className="px-3 py-2 border-b space-x-1">
                  <button className="border bg-red-600 hover:bg-red-700 text-white hover:text-white px-3 py-1 rounded-md text-xs transition duration-200">Xoá</button>
                  <Link to={`/dashboard/brands/edit/${brand._id}`}>
                    <button className="border bg-green-600 hover:bg-green-700 text-white hover:text-white px-3 py-1 rounded-md text-xs transition duration-200">Sửa</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrandManager;
