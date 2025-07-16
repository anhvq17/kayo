import AdminLayout from "../layouts/AdminLayout"

import Dashboard from "../pages/Admin/Dashboard"

import BrandManager from "../pages/Admin/Brand/BrandManager"
import AddBrand from "../pages/Admin/Brand/AddBrand"
import EditBrand from "../pages/Admin/Brand/EditBrand"
import TrashBrand from "../pages/Admin/Brand/TrashBrand"

import CategoryManager from "../pages/Admin/Category/CategoryManager"
import AddCategory from "../pages/Admin/Category/AddCategory"
import EditCategory from "../pages/Admin/Category/EditCategory"

import OrderManager from "../pages/Admin/Order/OrderManager"
import DetailOrder from "../pages/Admin/Order/DetailOrder"
import OrderReport from "../pages/Admin/Order/OrderReport"

import ProductManager from "../pages/Admin/Product/ProductManager"
import AddProduct from "../pages/Admin/Product/AddProduct"
import EditProduct from "../pages/Admin/Product/EditProduct"
import TrashProduct from "../pages/Admin/Product/TrashProduct"

import ReviewManager from "../pages/Admin/Review/ReviewManager"

import UserManager from "../pages/Admin/User/UserManager"

import VariantManager from "../pages/Admin/Variant/VariantManager"
import AddVariant from "../pages/Admin/Variant/AddVariant"
import EditVariant from "../pages/Admin/Variant/EditVariant"

import VoucherManager from "../pages/Admin/Voucher/VoucherManager"
import AddVoucher from "../pages/Admin/Voucher/AddVoucher"
import EditVoucher from "../pages/Admin/Voucher/EditVoucher"

import NotFound from "../pages/NotFound"

import AttributeManager from "../pages/Admin/Attribute/AttributeManager"
import AddAttribute from "../pages/Admin/Attribute/AddAttribute"
import EditAttribute from "../pages/Admin/Attribute/EditAttribute"
import TrashAttribute from "../pages/Admin/Attribute/TrashAttribute"

import AddAttributeValue from "../pages/Admin/AttributeValue/AddAttributeValue"
import AttributeValueManager from "../pages/Admin/AttributeValue/AttributeValueManager"
import TrashAttributeValue from "../pages/Admin/AttributeValue/TrashAttributeValue"
import EditAttributeValue from "../pages/Admin/AttributeValue/EditAttributeValue"
import DetailProduct from "../pages/Admin/Product/DetailProduct"
import TrashVoucher from "../pages/Admin/Voucher/TrashVourcher"
import DetailVoucher from "../pages/Admin/Voucher/DetailVourcher"



const AdminRoutes = {
  path: '/admin',
  element: <AdminLayout />,
  children: [
    { path: '', element: <Dashboard /> },

    { path: 'brands', element: <BrandManager /> },
    { path: 'brands/add', element: <AddBrand /> },
    { path: 'brands/edit/:id', element: <EditBrand /> },
    { path: 'brands/trash', element: <TrashBrand /> },

    { path: 'categories', element: <CategoryManager /> },
    { path: 'categories/add', element: <AddCategory /> },
    { path: 'categories/edit/:id', element: <EditCategory /> },

    { path: 'orders', element: <OrderManager /> },
    { path: 'orderDetails/:id', element: <DetailOrder /> },
    { path: 'orderReport', element: <OrderReport /> },

    { path: 'products', element: <ProductManager /> },
    { path: 'products/trash', element: <TrashProduct /> },
    { path: 'products/add', element: <AddProduct /> },
    { path: 'products/edit/:id', element: <EditProduct /> },
    { path: 'products/:id', element: <DetailProduct /> },

    { path: 'reviews', element: <ReviewManager /> },

    { path: 'users', element: <UserManager /> },

    { path: 'attributes/add', element: <AddAttribute /> },
    { path: 'attributes', element: <AttributeManager /> },
    { path: 'attributes/trash', element: <TrashAttribute /> },
    { path: 'attributes/edit/:id', element: <EditAttribute /> },

    { path: 'attribute-values/add', element: <AddAttributeValue /> },
    { path: 'attribute-values', element: <AttributeValueManager /> },
    { path: 'attribute-values/trash', element: <TrashAttributeValue /> },
    { path: 'attribute-values/edit/:id', element: <EditAttributeValue /> },

    { path: 'variants', element: <VariantManager /> },
    { path: 'variants/add', element: <AddVariant /> },
    { path: 'variants/edit/:id', element: <EditVariant /> },

    { path: 'vouchers', element: <VoucherManager /> },
    { path: 'vouchers/trash', element: <TrashVoucher /> },
    { path: 'vouchers/add', element: <AddVoucher /> },
    { path: 'vouchers/edit/:id', element: <EditVoucher /> },
    { path: 'vouchers/:id', element: <DetailVoucher /> },

    // Khi đường dẫn sai hoặc không tồn tại, dẫn đến trang NotFound
    { path: '*', element: <NotFound homePath="/admin" /> },
  ]
}

export default AdminRoutes;