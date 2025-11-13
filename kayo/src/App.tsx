import { useRoutes } from "react-router-dom";
import ClientRoutes from "./routes/ClientRoutes";
import { Toaster } from "sonner";
function App() {
  const routes = useRoutes([ ClientRoutes ]);
  return (
    <>
      {routes}
      <Toaster richColors position="top-center" />
    </>
  );
}

export default App;