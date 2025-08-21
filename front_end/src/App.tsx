import { useRoutes } from 'react-router-dom'
import ClientRoutes from './routes/ClientRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ChatbotWidget from './components/ChatBotWidget';
import { Toaster } from "sonner";
function App() {
  const routes = useRoutes([AdminRoutes, ClientRoutes]);
  return (
    <>
      {routes}
      <ChatbotWidget />
       <Toaster richColors position="top-center" />
    </>
  )
}

export default App
