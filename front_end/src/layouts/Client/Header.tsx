import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const ClientHeader = () => {
  const [keyword, setKeyword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const updateLoginStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  updateLoginStatus(); 
  // kiểm tra khi load lần đầu

  window.addEventListener("loginChanged", updateLoginStatus);
  return () => window.removeEventListener("loginChanged", updateLoginStatus);
}, []);


  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
      setKeyword("");
    }
  };

  const handleLogout = () => {
  const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
  if (confirmed) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setIsMenuOpen(false);

    // Gửi sự kiện để đồng bộ UI
    window.dispatchEvent(new Event('loginChanged'));

    navigate("/login");
  }
};



  return (
    <header className="w-full h-[60px] bg-[#fdfdfd] shadow-md">
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="h-full flex items-center">
          <Link to={"/"}>
            <img src="/img/logo.png" alt="Logo" className="h-6 object-contain" />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex items-center space-x-8 text-sm font-bold uppercase">
          <div className="relative group cursor-pointer">
            <span className="hover:text-gray-700">Nước hoa nam <i className="fas fa-angle-down ml-1"></i></span>
          </div>
          <div className="relative group cursor-pointer">
            <span className="hover:text-gray-700">Nước hoa nữ <i className="fas fa-angle-down ml-1"></i></span>
          </div>
          <div className="relative group cursor-pointer">
            <span className="hover:text-gray-700">Thương hiệu <i className="fas fa-angle-down ml-1"></i></span>
          </div>
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center space-x-6 text-xl text-black relative">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="border border-gray-300 rounded-full px-4 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button type="submit">
              <i className="fas fa-search absolute right-3 top-1 text-base text-gray-600"></i>
            </button>
          </form>

          <div className="h-5 border-l border-gray-300"></div>

          {/* Tài khoản */}
          {isLoggedIn ? (
            <div className="relative">
              <img
                src="https://i.pravatar.cc/40"
                alt="avatar"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
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
          ) : (
            <Link to={"/login"} className="hover:text-gray-600">
              <i className="fas fa-user text-base"></i>
            </Link>
          )}

          <div className="h-5 border-l border-gray-300"></div>

          {/* Giỏ hàng */}
          <Link to={"/cart"} className="hover:text-gray-600">
            <i className="fas fa-cart-shopping text-base"></i>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;
