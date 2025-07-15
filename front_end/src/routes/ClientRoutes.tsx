import ClientLayout from "../layouts/ClientLayout"
import Homepage from "../pages/Client/home/Homepage"
import Login from "../pages/Auth/Login"
import Register from "../pages/Auth/Register"
import Cart from "../pages/Client/Cart"
import NotFound from "../pages/NotFound"
import ProductDetails from "../pages/Client/ProductDetails"
import ProductList from "../pages/Client/ProductList"
import OrderList from "../pages/Client/Order"
import OrderDetail from "../pages/Client/OrderDetail"
import OrderNews from "../pages/Client/OrderNews"
import Checkout from "../pages/Client/Checkout"
import OrderSuccessfully from "../pages/Client/OrderSuccessfully"
import SearchResults from "../pages/Client/SearchResults"
import Profile from "../pages/Client/Profile"
import CheckPayment from "../pages/Client/CheckPayment"
// import PaymentResult from "../pages/Client/PaymentReturn"


const ClientRoutes = {
  path: '/',
  element: <ClientLayout />,
  children: [
    { path: '', element: <Homepage /> },
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
    { path: 'cart', element: <Cart /> },
    { path: 'productdetails/:id', element: <ProductDetails /> },
    { path: 'products', element: <ProductList /> },
    { path: 'orders', element: <OrderList/>},
    { path: 'orders/:orderId', element: <OrderDetail/>},
    { path: 'ordernews', element: <OrderNews/>},
    { path: 'checkout', element: <Checkout/>},
    { path: 'ordersuccessfully', element: <OrderSuccessfully/>},
    { path: 'search', element: <SearchResults /> },
    { path: 'profile', element: <Profile /> },
    // { path: 'payment-result', element: <PaymentResult /> },
    { path: 'payment-result', element: <CheckPayment /> },


    // Khi đường dẫn sai hoặc không tồn tại, dẫn đến trang NotFound
    { path: '*', element: <NotFound homePath="/"/> },
  ]
}

export default ClientRoutes;