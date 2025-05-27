const users = [
  {
    _id: "1",
    name: "Nguyễn Văn A",
    email: "a@gmail.com",
    password: "123456",
    phone: "0123456789",
    address: "Hà Nội",
    avatar: "https://i.pravatar.cc/200",
    role: "Admin",
    isActive: true,
    createdAt: "2024-05-01T10:00:00Z",
    updatedAt: "2024-05-10T12:00:00Z",
  },
  {
    _id: "2",
    name: "Trần Thị B",
    email: "b@gmail.com",
    password: "abcdef",
    phone: "0987654321",
    address: "TP.HCM",
    avatar: "https://i.pravatar.cc/300",
    role: "User",
    isActive: false,
    createdAt: "2024-04-20T08:30:00Z",
    updatedAt: "2024-05-11T15:45:00Z",
  },
];

const UserManager = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Danh sách khách hàng</h1>
        <table className="min-w-full bg-white border text-sm">
          <thead>
            <tr className="bg-black text-white text-left">
              <th className="px-3 py-2 border-b">ID</th>
              <th className="px-3 py-2 border-b">Avatar</th>
              <th className="px-3 py-2 border-b">Họ tên</th>
              <th className="px-3 py-2 border-b">Email</th>
              <th className="px-3 py-2 border-b">Mật khẩu</th>
              <th className="px-3 py-2 border-b">SĐT</th>
              <th className="px-3 py-2 border-b">Địa chỉ</th>
              <th className="px-3 py-2 border-b">Vai trò</th>
              <th className="px-3 py-2 border-b">Trạng thái</th>
              <th className="px-3 py-2 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-3 py-2 border-b">{user._id}</td>
                <td className="px-3 py-2 border-b">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                </td>
                <td className="px-3 py-2 border-b">{user.name}</td>
                <td className="px-3 py-2 border-b">{user.email}</td>
                <td className="px-3 py-2 border-b text-gray-500">••••••</td>
                <td className="px-3 py-2 border-b">{user.phone}</td>
                <td className="px-3 py-2 border-b">{user.address}</td>
                <td className="px-3 py-2 border-b">{user.role}</td>
                <td
                  className={`px-3 py-2 border-b font-medium ${
                    user.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {user.isActive ? "Hoạt động" : "Tạm khóa"}
                </td>
                <td className="px-3 py-2 border-b space-x-1">
                  <button
                    className={`px-2 py-1 text-white rounded text-xs ${
                      user.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {user.isActive ? "Khóa" : "Mở"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};

export default UserManager;