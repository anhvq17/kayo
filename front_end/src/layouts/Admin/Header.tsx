import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ collapsed }: { collapsed: boolean }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
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
    <header
      className={`h-[64px] bg-white border-b flex items-center justify-end px-6 fixed top-0 z-40 transition-all duration-300 ${
        collapsed ? 'left-[60px] w-[calc(100%-60px)]' : 'left-[240px] w-[calc(100%-240px)]'
      }`}
    >
      <div className="relative">
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
        />
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
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