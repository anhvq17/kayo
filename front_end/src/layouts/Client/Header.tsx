import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const ClientHeader = () => {
  const [keyword, setKeyword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemTypes, setCartItemTypes] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setAvatarUrl(user.avatar || "");
      } catch (error) {
        console.error("Lỗi parse user:", error);
      }
    } else {
      setAvatarUrl("");
    }

    const handleLoginChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("loginChanged", handleLoginChange);
    return () => window.removeEventListener("loginChanged", handleLoginChange);
  }, []);

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItemTypes(cart.length);
    };

    updateCart();
    window.addEventListener("cartChanged", updateCart);
    const interval = setInterval(updateCart, 1000);
    return () => {
      window.removeEventListener("cartChanged", updateCart);
      clearInterval(interval);
    };
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
      setKeyword("");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");

      setIsLoggedIn(false);
      setIsMenuOpen(false);

      window.dispatchEvent(new Event("loginChanged"));
      window.dispatchEvent(new Event("cartChanged"));

      navigate("/login");
    }
  };

  return (
    <header className="w-full h-[60px] bg-[#fdfdfd] shadow-md">
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/">
          <img src="/img/logo.png" alt="Logo" className="h-6 object-contain" />
        </Link>

        <nav className="flex items-center space-x-10 text-sm font-bold uppercase">
          <Link to="/products" className="hover:text-gray-700">Nước hoa nam</Link>
          <Link to="/products" className="hover:text-gray-700">Nước hoa nữ</Link>
          <Link to="/products" className="hover:text-gray-700">Thương hiệu</Link>
        </nav>

        <div className="flex items-center space-x-6 text-xl text-black">
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

          <div className="h-5 border-l border-gray-300" />

          {isLoggedIn ? (
            <div className="relative">
              <img
                src={avatarUrl || "https://i.pravatar.cc/40"}
                alt="avatar"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer object-cover"
              />
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <i className="fas fa-user w-4 h-4 mr-2" /> Tài khoản
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <i className="fas fa-shopping-cart w-4 h-4 mr-2" /> Đơn hàng
                  </Link>
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
            <Link to="/login" className="hover:text-gray-600">
              <i className="fas fa-user text-base"></i>
            </Link>
          )}

          <div className="h-5 border-l border-gray-300" />

          <Link to="/cart" className="relative hover:text-gray-600">
            <i className="fas fa-cart-shopping text-lg"></i>
            {cartItemTypes > 0 && (
              <span className="absolute -top-1 -right-4 bg-[#5f518e] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {cartItemTypes}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;