import { AuthProvider } from "./context/auth.context";
import AppRoutes from "./routes/app.routes";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
