import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PublicRoute from "./components/PublicRoute/PublicRoute";
import HomePage from "./pages/HomePage/HomePage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LogoutPage from "./pages/LogoutPage/LogoutPage";
import CreateFurniturePage from "./pages/createFurniturePage/CreateFurniturePage";
import MaterialDetailPage from "./pages/materialDetailPage/MaterialDetailPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route path="/logout" element={<LogoutPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/furniture/create"
              element={
                <ProtectedRoute>
                  <CreateFurniturePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/material/:keyword"
              element={
                <ProtectedRoute>
                  <MaterialDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/furniture/edit/:id"
              element={
                <ProtectedRoute>
                  <CreateFurniturePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
