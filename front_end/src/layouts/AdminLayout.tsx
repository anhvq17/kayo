import AdminHeader from "./Admin/Header"
import AdminSidebar from "./Admin/Sidebar"
import { Outlet } from "react-router-dom"

const AdminLayout = () => {
  return (
    <main className="flex">
      <AdminSidebar />
      <AdminHeader />
      <div className="flex-1 min-h-screen bg-white pl-[240px] pt-[64px]">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </main>
  )
}

export default AdminLayout
