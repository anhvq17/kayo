import { Link } from "react-router-dom"
import { useState } from "react"

type Props = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
};

const AdminSidebar = ({ collapsed, setCollapsed }: Props) => {
  const [isVariantOpen, setIsVariantOpen] = useState(false)

  return (
    <aside
      className={`h-screen bg-white fixed top-0 left-0 z-50 border-r transition-all duration-300 ${
        collapsed ? 'w-[60px]' : 'w-[240px]'
      }`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-4 w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center z-50 shadow"
        title={collapsed ? "Mở rộng" : "Thu gọn"}
      >
        <i className={`fas ${collapsed ? "fa-chevron-right" : "fa-chevron-left"}`} />
      </button>

      <div className={`p-4 transition-all ${collapsed ? 'px-2' : 'px-6'}`}>
        <div className="mb-6">
          {!collapsed && (
            <img src="/img/logo.png" alt="Logo" className="mx-auto" />
          )}
        </div>

        <nav>
          <ul className="space-y-2 mt-10 text-sm text-gray-800">
            <SidebarItem to="/admin" icon="fas fa-home" label="Tổng quan" collapsed={collapsed} />
            <SidebarItem to="/admin/products" icon="fas fa-cube" label="Sản phẩm" collapsed={collapsed} />
            <li>
              <button
                onClick={() => setIsVariantOpen(!isVariantOpen)}
                className="flex items-center w-full p-2 rounded hover:bg-gray-100 hover:text-gray-500"
                title={collapsed ? "Biến thể" : ""}
              >
                <div className="w-5 mr-2 flex justify-center">
                  <i className="fas fa-sliders-h" />
                </div>
                <span
                  className={`transition-all duration-300 ${
                    collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
                  }`}
                >
                  Biến thể
                </span>

                {!collapsed && (
                  <i
                    className={`fas ml-auto transition-transform duration-200 ${
                      isVariantOpen ? 'fa-chevron-up' : 'fa-chevron-down'
                    }`}
                  />
                )}
              </button>

              {isVariantOpen && !collapsed && (
                <ul className="pl-6 mt-1 space-y-1 text-gray-700 text-sm bg-gray-100 rounded-md py-2">
                  <li>
                    <Link to="/admin/attributes" className="block px-2 py-1 rounded hover:bg-gray-200">
                      Thuộc tính
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/attribute-values" className="block px-2 py-1 rounded hover:bg-gray-200">
                      Giá trị thuộc tính
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/variants" className="block px-2 py-1 rounded hover:bg-gray-200">
                      Biến thể
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <SidebarItem to="/admin/categories" icon="fas fa-th-list" label="Danh mục" collapsed={collapsed} />
            <SidebarItem to="/admin/brands" icon="fas fa-gem" label="Thương hiệu" collapsed={collapsed} />
            <SidebarItem to="/admin/orders" icon="fas fa-receipt" label="Đơn hàng" collapsed={collapsed} />
            <SidebarItem to="/admin/orderReport" icon="fas fa-chart-bar" label="Báo cáo đơn hàng" collapsed={collapsed} />
            <SidebarItem to="/admin/users" icon="fas fa-users" label="Người dùng" collapsed={collapsed} />
            <SidebarItem to="/admin/reviews" icon="fas fa-comment-dots" label="Đánh giá" collapsed={collapsed} />
            <SidebarItem to="/admin/vouchers" icon="fas fa-ticket-alt" label="Mã giảm giá" collapsed={collapsed} />
          </ul>
        </nav>
      </div>
    </aside>
  )
};

const SidebarItem = ({
  to,
  icon,
  label,
  collapsed
}: {
  to: string;
  icon: string;
  label: string;
  collapsed: boolean;
}) => (
  <li>
    <Link
      to={to}
      className="flex items-center p-2 rounded hover:bg-gray-100 hover:text-gray-500"
      title={collapsed ? label : ""}
    >
      <div className="w-5 mr-2 flex justify-center">
        <i className={icon} />
      </div>
      <span
        className={`transition-all duration-300 ${
          collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
        }`}
      >
        {label}
      </span>
    </Link>
  </li>
);

export default AdminSidebar;