import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ collapsed }: { collapsed: boolean }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      navigate('/login');
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setAvatarUrl(user.avatar || "");
      } catch (error) {
        console.error("Lỗi parse user:", error);
        setAvatarUrl("");
      }
    }
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      <div className="relative" ref={menuRef}>
        <img
          src={avatarUrl || "https://i.pravatar.cc/40"}
          alt="avatar"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer object-cover"
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