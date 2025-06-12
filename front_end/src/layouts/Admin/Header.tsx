import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Nếu không có token hoặc không phải admin => tự động đăng xuất
    if (!token || role !== 'admin') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user'); // nếu có
      navigate('/login');
    }
  }, [navigate]);

   const handleLogout = () => {
  const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
  if (confirmed) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
  }
};

  return (
    <header className="h-[64px] bg-white border-b flex items-center justify-between px-6 fixed top-0 left-[240px] z-40 w-[calc(100%-240px)]">
      <button className="p-2">
        <i className="fa-solid fa-bars w-4 h-4 mr-2" />
      </button>
      <div className="relative">
        <img
          src="https://i.pravatar.cc/40?img=12"
          alt="avatar"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300"
        />
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
            <button className="flex items-center px-4 py-2 w-full text-sm hover:bg-gray-100">
              <i className="fas fa-user w-4 h-4 mr-2" /> Tài khoản
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 w-full text-sm hover:bg-gray-100"
            >
              <i className="fas fa-sign-out-alt w-4 h-4 mr-2" /> Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
