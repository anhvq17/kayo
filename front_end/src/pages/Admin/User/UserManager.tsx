import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

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

// Custom confirm toast
const confirmToast = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    toast.custom((t) => (
      <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200 max-w-md w-full mx-auto animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-600" size={24} />
          <h3 className="text-lg font-semibold text-gray-800">Xác nhận hành động</h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
            onClick={() => {
              toast.dismiss(t);
              resolve(false);
            }}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            onClick={() => {
              toast.dismiss(t);
              resolve(true);
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    ), {
      duration: 0,
      position: "top-center",
      style: { background: "transparent", padding: 0, border: "none" },
    });
  });
};

const UserManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
        toast.success("Tải danh sách khách hàng thành công!", { duration: 2000 });
      })
      .catch((err) => {
        console.error("Lỗi khi fetch users:", err);
        toast.error("Lỗi khi tải danh sách khách hàng!", { duration: 2000 });
        setLoading(false);
      });
  }, []);

  const toggleUserStatus = async (userId: string, username: string, isActive: boolean) => {
    const action = isActive ? "khóa" : "mở khóa";
    const confirmed = await confirmToast(`Bạn có chắc muốn ${action} tài khoản ${username}?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3000/users/${userId}/status`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (res.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isActive: data.isActive } : user
          )
        );
        toast.success(`Đã ${action} tài khoản ${username} thành công!`, { duration: 2000 });
      } else {
        toast.error(data.message || "Không thể cập nhật trạng thái", { duration: 2000 });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error("Lỗi kết nối đến máy chủ", { duration: 2000 });
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
                className={`px-3 py-2 border-b font-medium ${
                  user.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {user.isActive ? "Hoạt động" : "Tạm khóa"}
              </td>
              <td className="px-3 py-2 border-b space-x-1">
                {user.role !== "admin" && (
                  <button
                    onClick={() => toggleUserStatus(user._id, user.username, user.isActive)}
                    className={`px-2 py-1 text-white rounded text-xs ${
                      user.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
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