import ClientHeader from "./Client/Header"
import ScrollToTop from "../components/ScrollToTop"
import { Outlet } from "react-router-dom"
import ClientFooter from "./Client/Footer"

const ClientLayout = () => {
  return (
    <main>
      <ClientHeader />
      <ScrollToTop />
      <Outlet />
      <ClientFooter />
    </main>
  )
}

export default ClientLayout