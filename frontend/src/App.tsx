import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPasienPage";
import LoginAdminPage from "./pages/LoginAdminPage";
import LoginPasienPage from "./pages/LoginPasienPage";
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

const PrivateRouteAdmin = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, isAdmin, isLoading } = useContext(AuthContext);
  if (isLoading) return <LoadingScreen />;
  return isLoggedIn && isAdmin ? (
    children
  ) : (
    <Navigate to="/admin-login" replace />
  );
};

const PrivateRoutePasien = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, isPasien, isLoading } = useContext(AuthContext);
  if (isLoading) return <LoadingScreen />;
  return isLoggedIn && isPasien ? (
    children
  ) : (
    <Navigate to="/pasien-login" replace />
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
          <Route path="/pasien-login" element={<LoginPasienPage />} />

          {/* ✅ Halaman Pasien */}
          <Route
            path="/sistem-pakar"
            element={
              <PrivateRoutePasien>
                <SistemPakarPage />
              </PrivateRoutePasien>
            }
          />

          {/* ✅ Halaman Admin */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRouteAdmin>
                <AdminSidebar>
                  <Dashboard />
                </AdminSidebar>
              </PrivateRouteAdmin>
            }
          />
          <Route
            path="/data-penyakit-dan-solusi"
            element={
              <PrivateRouteAdmin>
                <AdminSidebar>
                  <DataPenyakitDanSolusi />
                </AdminSidebar>
              </PrivateRouteAdmin>
            }
          />
          <Route
            path="/data-gejala"
            element={
              <PrivateRouteAdmin>
                <AdminSidebar>
                  <DataGejala />
                </AdminSidebar>
              </PrivateRouteAdmin>
            }
          />
          <Route
            path="/data-relasi-gejala"
            element={
              <PrivateRouteAdmin>
                <AdminSidebar>
                  <DataRelasiGejala />
                </AdminSidebar>
              </PrivateRouteAdmin>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
