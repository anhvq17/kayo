import { useEffect, useState } from "react";

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  avatar: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const UserManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi fetch users:", err);
        setLoading(false);
      });
  }, []);

  const toggleUserStatus = async (userId: string) => {
  try {
    const res = await fetch(`http://localhost:3000/users/${userId}/status`, {
      method: 'PATCH',
    });

    const data = await res.json();

    if (res.ok) {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, isActive: data.isActive } : user
        )
      );
    } else {
      alert(data.message || "Không thể cập nhật trạng thái");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    alert("Lỗi kết nối đến máy chủ");
  }
};


  if (loading) return <div className="p-4">Đang tải dữ liệu...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Danh sách khách hàng</h1>
      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-black text-white text-left">
            
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
              
              <td className="px-3 py-2 border-b">
                <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
              </td>
              <td className="px-3 py-2 border-b">{user.username}</td>
              <td className="px-3 py-2 border-b">{user.email}</td>
              <td className="px-3 py-2 border-b text-gray-500">••••••</td>
              <td className="px-3 py-2 border-b">{user.phone}</td>
              <td className="px-3 py-2 border-b">{user.address}</td>
              <td className="px-3 py-2 border-b">{user.role}</td>
              <td
                className={`px-3 py-2 border-b font-medium ${user.isActive ? "text-green-600" : "text-red-600"
                  }`}
              >
                {user.isActive ? "Hoạt động" : "Tạm khóa"}
              </td>
              <td className="px-3 py-2 border-b space-x-1">
                {user.role !== "admin" && (
                  <button
                    onClick={() => toggleUserStatus(user._id)}
                    className={`px-2 py-1 text-white rounded text-xs ${user.isActive
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                      }`}
                  >
                    {user.isActive ? "Khóa" : "Mở"}
                  </button>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManager;