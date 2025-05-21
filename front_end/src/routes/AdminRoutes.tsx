import AdminLayout from "../layouts/AdminLayout"
import Dashboard from "../pages/Admin/Dashboard"

import Statistics from "../pages/Admin/Statistics"
import CategoryManager from "../pages/Admin/CategoryManager"
import ProductManager from "../pages/Admin/ProductManager"
import ReviewManager from "../pages/Admin/ReviewManager"
import UserManager from "../pages/Admin/UserManager"
import VariantManager from "../pages/Admin/VariantManager"
import VoucherManager from "../pages/Admin/VoucherManager"

import NotFound from "../pages/NotFound"
import OrderManager from "../pages/Admin/OrderManager/OrderManager"
import Edit_OrderManager from "../pages/Admin/OrderManager/Edit_OrderManager"
import OrderManagerDetail from "../pages/Admin/OrderManager/OrderManagerDetail"

const AdminRoutes = {
  path: '/dashboard',
  element: <AdminLayout />,
  children: [
    { path: '', element: <Dashboard /> },
    { path: 'statistics', element: <Statistics /> },
    { path: 'categories', element: <CategoryManager /> },
    { path: 'orders', element: <OrderManager /> },
    { path: 'orderDetails', element: <OrderManagerDetail /> },
    { path: 'orderDetails/edit/:id', element: <Edit_OrderManager /> },
    { path: 'products', element: <ProductManager /> },
    { path: 'reviews', element: <ReviewManager /> },
    { path: 'users', element: <UserManager /> },
    { path: 'variants', element: <VariantManager /> },
    { path: 'vouchers', element: <VoucherManager /> },

    // Khi đường dẫn sai hoặc không tồn tại, dẫn đến trang NotFound
    { path: '*', element: <NotFound homePath="/dashboard"/> },
  ]
}

export default AdminRoutes
