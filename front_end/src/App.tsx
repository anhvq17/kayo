import { useRoutes } from 'react-router-dom'
import ClientRoutes from './routes/ClientRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ChatbotWidget from './components/ChatBotWidget';

function App() {
  const routes = useRoutes([AdminRoutes, ClientRoutes]);
  return (
    <>
      {routes}
      <ChatbotWidget />
    </>
  )
}

export default App
