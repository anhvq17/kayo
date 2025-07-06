import { EyeOff, Eye } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!username || !email || !phone || !password || !confirmPassword) {
      setMessage('Vui lòng điền đầy đủ thông tin');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Mật khẩu không khớp');
      setLoading(false);
      return;
    }

    try {
      let avatarUrl = '';
      if (avatarFile) {
        avatarUrl = await uploadImageToCloudinary(avatarFile);
      }

      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          phone,
          password,
          address,
          avatar: avatarUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Đăng ký thất bại');
      } else {
        setMessage('Đăng ký thành công!');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (error) {
      console.error(error);
      setMessage('Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="mt-14 mb-14 bg-white rounded-md shadow-lg w-full max-w-md p-8">
        <h2 className="text-[#5f518e] text-3xl font-bold text-center mb-6">ĐĂNG KÝ TÀI KHOẢN</h2>

        {message && <p className="text-center text-red-500 mb-4">{message}</p>}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Họ tên"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5f518e]"
            />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5f518e]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Số điện thoại"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5f518e]"
            />
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Địa chỉ"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5f518e]"
            />
          </div>

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
              className="w-full"
            />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="mt-2 max-w-[120px] h-auto object-contain border rounded shadow"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5f518e] pr-10"
              />
              <span
                className="absolute right-3 top-2.5 text-sm text-gray-500 cursor-pointer hover:text-[#5f518e]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5f518e] pr-10"
              />
              <span
                className="absolute right-3 top-2.5 text-sm text-gray-500 cursor-pointer hover:text-[#5f518e]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#696faa] hover:bg-[#5f518e] text-white font-semibold py-2 rounded transition"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'ĐĂNG KÝ'}
          </button>
        </form>


        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-400 text-sm">hoặc</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => alert('Chưa tích hợp Google!')}
            className="flex items-center justify-center border border-gray-300 rounded py-2 hover:bg-gray-50"
          >
            <img src="https://cdn-icons-png.flaticon.com/512/281/281764.png" className="w-5 h-5 mr-2" />
            Tiếp tục với Google
          </button>
        </div>

        <div className="text-center mt-4">
          Bạn đã có tài khoản?
          <a href="/login" className="text-[#5f518e] hover:underline ml-1">Đăng nhập</a> ngay
        </div>
      </div>
    </div>
  );
};

export default Register;