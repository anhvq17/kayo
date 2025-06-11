import AdminLayout from "../layouts/AdminLayout"

import Dashboard from "../pages/Admin/Dashboard"
import Statistics from "../pages/Admin/Statistics"

import BrandManager from "../pages/Admin/Brand/BrandManager"
import AddBrand from "../pages/Admin/Brand/AddBrand"
import EditBrand from "../pages/Admin/Brand/EditBrand"

import CategoryManager from "../pages/Admin/Category/CategoryManager"
import AddCategory from "../pages/Admin/Category/AddCategory"
import EditCategory from "../pages/Admin/Category/EditCategory"

import OrderManager from "../pages/Admin/Order/OrderManager"
import DetailOrder from "../pages/Admin/Order/DetailOrder"

import ProductManager from "../pages/Admin/Product/ProductManager"
import AddProduct from "../pages/Admin/Product/AddProduct"
import EditProduct from "../pages/Admin/Product/EditProduct"

import ReviewManager from "../pages/Admin/Review/ReviewManager"

import UserManager from "../pages/Admin/User/UserManager"

import VariantManager from "../pages/Admin/Variant/VariantManager"
import AddVariant from "../pages/Admin/Variant/AddVariant"
import EditVariant from "../pages/Admin/Variant/EditVariant"

import VoucherManager from "../pages/Admin/Voucher/VoucherManager"
import AddVoucher from "../pages/Admin/Voucher/AddVoucher"
import EditVoucher from "../pages/Admin/Voucher/EditVoucher"

import NotFound from "../pages/NotFound"

const AdminRoutes = {
  path: '/admin',
  element: <AdminLayout />,
  children: [
    { path: '', element: <Dashboard /> },
    { path: 'statistics', element: <Statistics /> },

    { path: 'brands', element: <BrandManager /> },
    { path: 'brands/add', element: <AddBrand /> },
    { path: 'brands/edit/:id', element: <EditBrand /> },

    { path: 'categories', element: <CategoryManager /> },
    { path: 'categories/add', element: <AddCategory /> },
    { path: 'categories/edit/:id', element: <EditCategory /> },

    { path: 'orders', element: <OrderManager /> },
    { path: 'orderDetails', element: <DetailOrder /> },

    { path: 'products', element: <ProductManager /> },
    { path: 'products/add', element: <AddProduct /> },
    { path: 'products/edit/:id', element: <EditProduct /> },

    { path: 'reviews', element: <ReviewManager /> },

    { path: 'users', element: <UserManager /> },

    { path: 'variants', element: <VariantManager /> },
    { path: 'variants/add', element: <AddVariant /> },
    { path: 'variants/edit/:id', element: <EditVariant /> },

    { path: 'vouchers', element: <VoucherManager /> },
    { path: 'vouchers/add', element: <AddVoucher /> },
    { path: 'vouchers/edit/:id', element: <EditVoucher /> },

    // Khi đường dẫn sai hoặc không tồn tại, dẫn đến trang NotFound
    { path: '*', element: <NotFound homePath="/admin"/> },
  ]
}

export default AdminRoutes;