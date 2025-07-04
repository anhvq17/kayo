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
      setTimeout(() => navigate('/'), 1500);
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
  <div className="max-w-xl mx-auto mt-10 mb-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
    <h2 className="text-2xl font-bold text-[#5f518e] mb-6 text-center">THÔNG TIN CỦA BẠN</h2>
    {message && (
      <p
        className={`text-center mb-4 font-medium ${
          message.includes('thành công') ? 'text-green-600' : 'text-red-500'
        }`}
      >
        {message}
      </p>
    )}
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Họ tên</label>
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f518e]"
            placeholder="Họ tên"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f518e]"
            placeholder="Email"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Số điện thoại</label>
          <input
            type="tel"
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f518e]"
            placeholder="Số điện thoại"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Địa chỉ</label>
          <input
            type="text"
            value={user.address}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f518e]"
            placeholder="Địa chỉ"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Ảnh đại diện</label>
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
          className="block w-full text-sm text-gray-500"
        />
        {avatarPreview && (
          <div className="flex justify-center mt-4">
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-24 h-24 rounded-full border shadow-md object-cover"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg text-white font-semibold transition ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#5f518e] hover:bg-[#473e85]'
        }`}
      >
        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
      </button>
    </form>
  </div>
  );
};

export default Profile;