import ClientLayout from "../layouts/ClientLayout";
import Homepage from "../pages/Client/Home/Homepage";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import About from "../pages/Client/About/About";
import AboutDetails from "../pages/Client/About/AboutDetails";

import Work from "../pages/Client/Work/Work";
import WorkDetails from "../pages/Client/Work/WorkDetails";

import NotFound from "../pages/NotFound";

const ClientRoutes = {
  path: '/',
  element: <ClientLayout />,
  children: [
    { path: '', element: <Homepage /> },

    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },

    { path: 'about', element: <About /> },
    { path: 'about/details/:id', element: <AboutDetails /> },

    { path: 'work', element: <Work /> },
    { path: 'work/details/:id', element: <WorkDetails /> },

    { path: '*', element: <NotFound homePath="/"/> },
  ]
}

export default ClientRoutes;