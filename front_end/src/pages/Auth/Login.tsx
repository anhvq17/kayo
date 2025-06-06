import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Đăng nhập thất bại');
      } else {
        setMessage('Đăng nhập thành công');
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);

        setTimeout(() => {
          if (data.user.role === 'admin') {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
        }, 1000);
      }
    } catch (err) {
      setMessage('Lỗi server');
      console.error(err);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-[#736DA9]">
      <div className="w-full max-w-md p-8">
        <h1 className="text-white text-2xl md:text-3xl font-bold text-center mb-8 uppercase">
          Đăng nhập tài khoản
        </h1>

        {message && <p className="text-center text-red-500 mb-4">{message}</p>}

        <form onSubmit={handleLogin} className="bg-white rounded-lg p-8 shadow-md space-y-6">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9f86c0]"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-700 mb-1">Mật khẩu</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9f86c0]"
              required
            />
            <span
              className="absolute right-3 top-9 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁️
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#9f86c0] hover:bg-[#a892c9] text-white font-semibold rounded-md transition duration-300"
          >
            Xác nhận
          </button>

          <div className="flex items-center my-2">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 text-gray-500 text-sm">hoặc</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <p className="text-center text-sm text-gray-600">
            Bạn chưa có tài khoản?
            <a href="/register" className="text-[#9f86c0] font-medium ml-1 hover:underline">
              Đăng ký
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
