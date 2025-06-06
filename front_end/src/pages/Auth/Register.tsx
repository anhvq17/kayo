import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Mật khẩu không khớp');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Đăng ký thất bại');
      } else {
        setMessage('Đăng ký thành công');
        setUsername('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');

        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
    } catch (error) {
      setMessage('Lỗi server khi đăng ký');
      console.error(error);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-[#736DA9]">
      <div className="w-full max-w-4xl p-8">
        <h1 className="text-white text-2xl md:text-3xl font-bold text-center mb-8 uppercase">
          Đăng ký ngay để trở thành SEVEND-ER
        </h1>

        {message && <p className="text-center text-red-500 mb-4">{message}</p>}

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-white block mb-1">Nhập họ và tên của bạn</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-white block mb-1">Nhập email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-md focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-white block mb-1">Nhập số điện thoại</label>
            <input
              type="tel"
              className="w-full px-4 py-2 rounded-md focus:outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="text-white block mb-1">Nhập mật khẩu</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="absolute right-3 top-9 text-gray-500 cursor-pointer">👁️</span>
          </div>

          <div className="relative">
            <label className="text-white block mb-1">Nhập lại mật khẩu</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span className="absolute right-3 top-9 text-gray-500 cursor-pointer">👁️</span>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end justify-end">
            <button
              type="submit"
              className="bg-[#9079C4] text-white px-6 py-2 rounded-md w-full hover:scale-105 transition"
            >
              Xác nhận
            </button>
          </div>
        </form>

        <div className="mt-8 flex items-center justify-between text-white text-sm">
          <hr className="w-1/3 border-white opacity-50" />
          <span className="mx-2">hoặc</span>
          <hr className="w-1/3 border-white opacity-50" />
        </div>

        <div className="text-center mt-4 text-white">
          Bạn đã có tài khoản?
          <a href="/login" className="text-[#BCA3FF] underline ml-1">Đăng nhập</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
