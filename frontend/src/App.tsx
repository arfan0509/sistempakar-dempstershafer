import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import LoginAdminPage from "./pages/LoginAdminPage";
import SistemPakarPage from "./pages/SistemPakarPage";
import Dashboard from "./pages/Dashboard";
import DataPenyakitDanSolusi from "./pages/DataPenyakitDanSolusi";
import DataGejala from "./pages/DataGejala";
import DataRelasiGejala from "./pages/DataRelasiGejala";
import AdminSidebar from "./components/AdminSidebar";
import { AuthProvider, AuthContext } from "./context/AuthContext";

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700 animate-pulse">
        Memuat halaman...
      </p>
    </div>
  </div>
);

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, isAdmin, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingScreen />; // ✅ Tampilkan animasi loading
  }

  return isLoggedIn && isAdmin ? (
    children
  ) : (
    <Navigate to="/admin-login" replace />
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<LoginAdminPage />} />

          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute>
                <AdminSidebar>
                  <Dashboard />
                </AdminSidebar>
              </PrivateRoute>
            }
          />
          <Route
            path="/data-penyakit-dan-solusi"
            element={
              <PrivateRoute>
                <AdminSidebar>
                  <DataPenyakitDanSolusi />
                </AdminSidebar>
              </PrivateRoute>
            }
          />
          <Route
            path="/data-gejala"
            element={
              <PrivateRoute>
                <AdminSidebar>
                  <DataGejala />
                </AdminSidebar>
              </PrivateRoute>
            }
          />
          <Route
            path="/data-relasi-gejala"
            element={
              <PrivateRoute>
                <AdminSidebar>
                  <DataRelasiGejala />
                </AdminSidebar>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
