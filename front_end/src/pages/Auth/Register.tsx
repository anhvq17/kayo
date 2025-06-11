import { EyeOff, Eye } from 'lucide-react';
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim()) {
      setMessage('Vui lòng nhập họ và tên');
      return;
    }
    if (username.trim().split(' ').length < 1) {
      setMessage('Họ và tên phải có ít nhất 1 từ');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Email không hợp lệ');
      return;
    }

    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setMessage('Số điện thoại không hợp lệ');
      return;
    }

    if (password.length < 6) {
      setMessage('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

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
        setMessage(data.message || 'Đăng ký thất bại!');
      } else {
        setMessage('Đăng ký thành công!');
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
      setMessage('Lỗi server khi đăng ký!');
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="mt-14 mb-14 rounded-md shadow-lg w-full max-w-3xl p-8">
        <h2 className="text-[#5f518e] text-3xl font-bold text-center mb-6">ĐĂNG KÝ NGAY ĐỂ TRỞ THÀNH SEVENDER</h2>

        {message && <p className="text-center text-red-500 mb-4">{message}</p>}

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5f518e]"
              value={username}
              placeholder="Họ và tên"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5f518e]"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <input
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5f518e]"
              value={phone}
              placeholder="Số điện thoại"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5f518e]"
              value={password}
              placeholder="Mật khẩu"
              onChange={(e) => setPassword(e.target.value)}
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
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5f518e]"
              value={confirmPassword}
              placeholder="Nhập lại mật khẩu"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-2.5 text-sm text-gray-500 cursor-pointer hover:text-[#5f518e]"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end justify-end">
            <button
              type="submit"
              className="w-full bg-[#696faa] hover:bg-[#5f518e] text-white font-semibold py-2 rounded transition"
            >
              XÁC NHẬN
            </button>
          </div>
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
          <a href="/login" className="text-[#5f518e] hover:underline ml-1">
            Đăng nhập
          </a>{' '}
          ngay
        </div>
      </div>
    </div>
  );
};

export default Register;