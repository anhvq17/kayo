import AdminLayout from "../layouts/AdminLayout"
import Dashboard from "../pages/Admin/Dashboard"
import ProductManager from "../pages/Admin/Product/ProductManager"
import AddProduct from "../pages/Admin/Product/AddProduct"
import EditProduct from "../pages/Admin/Product/EditProduct"
import TrashProduct from "../pages/Admin/Product/TrashProduct"
import NotFound from "../pages/NotFound"

const AdminRoutes = {
  path: '/admin',
  element: <AdminLayout />,
  children: [
    { path: '', element: <Dashboard /> },
    { path: 'products', element: <ProductManager /> },
    { path: 'products/trash', element: <TrashProduct /> },
    { path: 'products/add', element: <AddProduct /> },
    { path: 'products/edit/:id', element: <EditProduct /> },
    { path: '*', element: <NotFound homePath="/admin" /> },
  ]
}

export default AdminRoutes;