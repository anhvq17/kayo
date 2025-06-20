import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { EyeOff, Eye } from 'lucide-react';

const Login = () => {
  
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  // ✅ Kiểm tra đăng nhập
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (token) {
    // ⛔ Đã đăng nhập thì chuyển hướng (không render form)
    return <Navigate to={role === 'admin' ? '/admin' : '/'} replace />;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!phone || !password) {
      setMessage('Vui lòng nhập đầy đủ số điện thoại và mật khẩu.');
      return;
    }

    const phoneRegex = /^(0[0-9]{9})$/;
    if (!phoneRegex.test(phone)) {
      setMessage('Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng 10 số bắt đầu bằng 0.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/login', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Đăng nhập thất bại!');
      } else {
        setMessage('Đăng nhập thành công!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('loginChanged'));

        setTimeout(() => {
          navigate(data.user.role === 'admin' ? '/admin' : '/');
        }, 1000);
      }
    } catch (err) {
      setMessage('Lỗi server!');
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="mt-14 mb-14 bg-white rounded-md shadow-lg w-full max-w-md p-8">
        <h2 className="text-[#5f518e] text-3xl font-bold text-center mb-6">ĐĂNG NHẬP TÀI KHOẢN</h2>

        {message && <p className="text-center text-red-500 mb-4">{message}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Số điện thoại"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5f518e]"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5f518e]"
            />
            <span
              className="absolute right-3 top-2.5 text-sm text-gray-500 cursor-pointer hover:text-[#5f518e]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button type="submit" className="w-full bg-[#696faa] hover:bg-[#5f518e] text-white font-semibold py-2 rounded transition">
            ĐĂNG NHẬP
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
          Bạn chưa có tài khoản?
          <a href="/register" className="text-[#5f518e] hover:underline ml-1">Đăng ký</a> ngay
        </div>
      </div>
    </div>
  );
};

export default Login;