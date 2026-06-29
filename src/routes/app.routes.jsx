import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import ProtectedRoute from "./protected.route";
import HomePage from "../pages/home/home.page";
import DashboardPage from "../pages/dashboard/dashboard.page";
import LoginPage from "../pages/login/login.page";
import RegisterPage from "../pages/register/register.page";
import ProfilePage from "../pages/profile/profile.page";

function PublicAuthRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function LoginRouteWrapper() {
  const location = useLocation();
  const successMessage = location.state?.successMessage;

  return (
    <>
      {successMessage && (
        <p className="login-success-banner">{successMessage}</p>
      )}
      <LoginPage />
    </>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/login"
        element={
          <PublicAuthRoute>
            <LoginRouteWrapper />
          </PublicAuthRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicAuthRoute>
            <RegisterPage />
          </PublicAuthRoute>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
