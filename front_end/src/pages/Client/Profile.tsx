import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setAvatarPreview(userData.avatar || '');
    }
  }, []);

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "DATN_SEVEND");
    formData.append("cloud_name", "dm9f2fi07");

    const res = await fetch("https://api.cloudinary.com/v1_1/dm9f2fi07/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) return;

  setLoading(true);
  setMessage('');

  try {
    let avatarUrl = user.avatar;
    if (avatarFile) {
      avatarUrl = await uploadImageToCloudinary(avatarFile);
    }

    const res = await fetch(`http://localhost:3000/users/${user._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user, avatar: avatarUrl }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || 'Cập nhật thất bại');
    } else {
      setMessage('Cập nhật thành công');
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setTimeout(() => navigate('/'), 1500); // ✅ Chuyển hướng sau khi cập nhật
    }
  } catch (err) {
    console.error(err);
    setMessage('Lỗi server');
  } finally {
    setLoading(false);
  }
};


  if (!user) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold text-[#5f518e] mb-4 text-center">Cập nhật thông tin</h2>

      {message && <p className="text-center text-red-500 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          placeholder="Họ và tên"
          className="input-style"
        />
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
          className="input-style"
        />
        <input
          type="tel"
          value={user.phone}
          onChange={(e) => setUser({ ...user, phone: e.target.value })}
          placeholder="Số điện thoại"
          className="input-style"
        />
        <input
          type="text"
          value={user.address}
          onChange={(e) => setUser({ ...user, address: e.target.value })}
          placeholder="Địa chỉ"
          className="input-style"
        />

        <div>
          <label className="text-sm block mb-1">Ảnh đại diện</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setAvatarFile(file);
                setAvatarPreview(URL.createObjectURL(file));
              }
            }}
          />
          {avatarPreview && (
            <img src={avatarPreview} alt="Avatar" className="mt-2 w-24 h-auto rounded border shadow" />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#5f518e] text-white py-2 rounded hover:bg-[#473e85]"
        >
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </form>
    </div>
  );
};

export default Profile;

// CSS thêm nếu chưa có
// .input-style {
//   @apply w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5f518e];
// }
