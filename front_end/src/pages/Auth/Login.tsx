import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
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
        localStorage.setItem('role', data.user.role); // lưu role

        setTimeout(() => {
          if (data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 0);
      }
    } catch (err) {
      setMessage('Lỗi server');
      console.error(err);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center dark:bg-gray-900">
      <div className="grid gap-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-4">
          <div className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg p-10 m-2">
            <h1 className="pt-8 pb-6 font-bold dark:text-gray-400 text-5xl text-center">Log in</h1>

            {message && <p className="text-center text-red-500 mb-4">{message}</p>}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="phone" className="mb-2 dark:text-gray-400 text-lg">Số điện thoại</label>
                <input
                  id="phone"
                  className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 border-gray-300 rounded-lg w-full"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Số điện thoại"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 dark:text-gray-400 text-lg">Password</label>
                <input
                  id="password"
                  className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 border-gray-300 rounded-lg w-full"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>

              <button
                className="bg-gradient-to-r dark:text-gray-300 from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
                type="submit"
              >
                LOG IN
              </button>
            </form>

            <div className="flex flex-col mt-4 items-center justify-center text-sm">
              <h3 className="dark:text-gray-300">
                Don't have an account?
                <a className="text-blue-400 ml-2 underline" href="/register">Sign Up</a>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
