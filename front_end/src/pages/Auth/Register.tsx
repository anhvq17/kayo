import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

        // Điều hướng sang trang Login sau 2 giây
        setTimeout(() => {
          navigate('/login');
        }, 0);
      }
    } catch (error) {
      setMessage('Lỗi server khi đăng ký');
      console.error(error);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center dark:bg-gray-900">
      <div className="grid gap-8">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-[26px] m-4">
          <div className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg p-10 m-2">
            <h1 className="pt-8 pb-6 font-bold dark:text-gray-400 text-5xl text-center">Sign Up</h1>

            {message && <p className="text-center text-red-500 mb-4">{message}</p>}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="mb-2 dark:text-gray-400 text-lg">Username</label>
                <input
                  className="border p-3 dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 shadow-md border-gray-300 rounded-lg w-full"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Tên người dùng"
                  required
                />
              </div>
              <div>
                <label className="mb-2 dark:text-gray-400 text-lg">Email</label>
                <input
                  className="border p-3 dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 shadow-md border-gray-300 rounded-lg w-full"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>
              <div>
                <label className="mb-2 dark:text-gray-400 text-lg">Số điện thoại</label>
                <input
                  className="border p-3 dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 shadow-md border-gray-300 rounded-lg w-full"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Số điện thoại"
                  required
                />
              </div>
              <div>
                <label className="mb-2 dark:text-gray-400 text-lg">Password</label>
                <input
                  className="border p-3 dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 shadow-md border-gray-300 rounded-lg w-full"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
              <button
                className="bg-gradient-to-r dark:text-gray-300 from-green-500 to-blue-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 transition duration-300 ease-in-out"
                type="submit"
              >
                SIGN UP
              </button>
            </form>

            <div className="flex flex-col mt-4 items-center justify-center text-sm">
              <h3 className="dark:text-gray-300">
                Already have an account?
                <a className="text-blue-400 ml-2 underline" href="/login">Log In</a>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
