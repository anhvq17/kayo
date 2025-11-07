import { Link } from "react-router-dom"

type Props = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
};

const AdminSidebar = ({ collapsed, setCollapsed }: Props) => {
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
        <nav>
          <ul className="space-y-2 mt-10 text-sm text-gray-800">
            <Link to="/admin" className="text-4xl tracking-loose font-impact">
              KAY<span className="text-[#5f518e]">O</span>
            </Link>
            <SidebarItem to="/admin/products" icon="fas fa-cube" label="Sản phẩm" collapsed={collapsed} />
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