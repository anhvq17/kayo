import ClientLayout from "../layouts/ClientLayout";
import Homepage from "../pages/Client/Home/Homepage";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import NotFound from "../pages/NotFound";
import About from "../pages/Client/About/About";
import Work from "../pages/Client/Work/Work";

const ClientRoutes = {
  path: '/',
  element: <ClientLayout />,
  children: [
    { path: '', element: <Homepage /> },
    { path: 'about', element: <About /> },
    { path: 'work', element: <Work /> },
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
    { path: '*', element: <NotFound homePath="/"/> },
  ]
}

export default ClientRoutes;