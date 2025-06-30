import AdminHeader from "./Admin/Header"
import AdminSidebar from "./Admin/Sidebar"
import { Outlet } from "react-router-dom"
import { useState } from "react"

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <main className="flex">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <AdminHeader collapsed={collapsed} />
      <div
        className={`flex-1 min-h-screen bg-white pt-[64px] transition-all duration-300 ${
          collapsed ? 'pl-[60px]' : 'pl-[240px]'
        }`}
      >
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </main>
  )
}

export default AdminLayout
