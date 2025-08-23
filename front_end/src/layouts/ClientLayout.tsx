import ClientHeader from "./Client/Header"
import ScrollToTop from "../components/ScrollToTop"
import { Outlet } from "react-router-dom"
import ClientFooter from "./Client/Footer"
import ChatbotWidget from "../components/ChatBotWidget"

const ClientLayout = () => {
  return (
    <main>
      <ClientHeader />
      <ScrollToTop />
      <Outlet />
      <ClientFooter />
       <ChatbotWidget />
    </main>
  )
}

export default ClientLayout