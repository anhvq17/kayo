import ClientLayout from "../layouts/ClientLayout";
import Homepage from "../pages/Client/home/Homepage";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Cart from "../pages/Client/Cart";
import NotFound from "../pages/NotFound";
import ProductDetails from "../pages/Client/ProductDetails";
import ProductList from "../pages/Client/ProductList";
import OrderList from "../pages/Client/Order";
import OrderDetail from "../pages/Client/OrderDetail";
import Checkout from "../pages/Client/Checkout";
import OrderSuccessfully from "../pages/Client/OrderSuccessfully";
import SearchResults from "../pages/Client/SearchResults";
import Profile from "../pages/Client/Profile";
import CheckPayment from "../pages/Client/CheckPayment";
import Voucher from "../pages/Client/vourcher/Voucher";
import MyVoucher from "../pages/Client/vourcher/myVoucher";
import ReviewPage from "../pages/Client/ReviewPage";
import NewsList from "../pages/Client/NewsList";
import Wallet from "../pages/Client/Wallet";
import FaqList from "../pages/Client/Chatbot";

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
    { path: 'vouchers', element: <Voucher /> },
    { path: 'myvoucher', element: <MyVoucher /> },
    { path: 'orders', element: <OrderList/>},
    { path: 'orders/:orderId', element: <OrderDetail/>},
    { path: 'checkout', element: <Checkout/>},
    { path: 'ordersuccessfully', element: <OrderSuccessfully/>},
    { path: 'search', element: <SearchResults /> },
    { path: 'profile', element: <Profile /> },
    { path: 'wallet', element: <Wallet /> },
    { path: 'payment-result', element: <CheckPayment /> },
    { path: 'newlist', element: <NewsList /> },
    { path: 'review/:productId/:orderItemId', element: <ReviewPage /> },
    { path: 'faqs', element: <FaqList /> },

    // Khi đường dẫn sai hoặc không tồn tại, dẫn đến trang NotFound
    { path: '*', element: <NotFound homePath="/"/> },
  ]
}

export default ClientRoutes;