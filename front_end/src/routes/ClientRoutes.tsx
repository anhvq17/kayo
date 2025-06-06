import ClientLayout from "../layouts/ClientLayout"
import Homepage from "../pages/Client/Homepage"
import Login from "../pages/Auth/Login"
import Register from "../pages/Auth/Register"
import Cart from "../pages/Client/Cart"
import NotFound from "../pages/NotFound"
import ProductDetails from "../pages/Client/ProductDetails"
import ProductList from "../pages/Client/ProductList"
import Order from "../pages/Client/Order"
import OrderNews from "../pages/Client/OrderNews"
import Checkout from "../pages/Client/Checkout"
import OrderSuccessfully from "../pages/Client/OrderSuccessfully"

const ClientRoutes = {
  path: '/',
  element: <ClientLayout />,
  children: [
    { path: '', element: <Homepage /> },
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
    { path: 'cart', element: <Cart /> },
    { path: 'productdetails', element: <ProductDetails /> },
    { path: 'products', element: <ProductList /> },
    { path: 'orders', element: <Order/>},
    { path: 'ordernews', element: <OrderNews/>},

    { path: 'checkout', element: <Checkout/>},
    { path: 'ordersuccessfully', element: <OrderSuccessfully/>},

    // Khi đường dẫn sai hoặc không tồn tại, dẫn đến trang NotFound
    { path: '*', element: <NotFound homePath="/"/> },
  ]
}

export default ClientRoutes
