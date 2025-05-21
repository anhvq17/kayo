import AdminLayout from "../layouts/AdminLayout"
import Dashboard from "../pages/Admin/Dashboard"

import Statistics from "../pages/Admin/Statistics"
import CategoryManager from "../pages/Admin/CategoryManager"
import OrderManager from "../pages/Admin/OrderManager"
import ProductManager from "../pages/Admin/ProductManager"
import ReviewManager from "../pages/Admin/ReviewManager"
import UserManager from "../pages/Admin/UserManager"
import VariantManager from "../pages/Admin/VariantManager"
import VoucherManager from "../pages/Admin/VoucherManager"

import NotFound from "../pages/NotFound"
import EditVariant from "../pages/Admin/variants/EditVariant"
import AddVariant from "../pages/Admin/variants/AddVariant"

const AdminRoutes = {
  path: '/dashboard',
  element: <AdminLayout />,
  children: [
    { path: '', element: <Dashboard /> },
    { path: 'statistics', element: <Statistics /> },
    { path: 'categories', element: <CategoryManager /> },
    { path: 'orders', element: <OrderManager /> },
    { path: 'products', element: <ProductManager /> },
    { path: 'reviews', element: <ReviewManager /> },
    { path: 'users', element: <UserManager /> },
    { path: 'variants', element: <VariantManager /> },
    { path: 'variants/:id', element: <EditVariant /> },  // <-- Thêm dòng này
    { path: 'variants/add', element: <AddVariant /> },  // <-- Thêm dòng này
    { path: 'vouchers', element: <VoucherManager /> },

    // Khi đường dẫn sai hoặc không tồn tại, dẫn đến trang NotFound
    { path: '*', element: <NotFound homePath="/dashboard"/> },
  ]
}

export default AdminRoutes
