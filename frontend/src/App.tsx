import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import Layouts
import AdminSidebar from "./components/AdminSidebar"; // Ganti dengan AdminSidebar

// Import Halaman
import LandingPage from "./pages/LandingPage"; // Halaman landing
import LoginPage from "./pages/LoginPage"; // Halaman login
import SistemPakarPage from "./pages/SistemPakarPage"; // Halaman sistem pakar untuk pasien
import Dashboard from "./pages/Dashboard";
import DataPenyakitDanSolusi from "./pages/DataPenyakitDanSolusi";
import DataGejala from "./pages/DataGejala";
import DataRelasiGejala from "./pages/DataRelasiGejala"; // Tambahkan halaman relasi

function App() {
  // Mendapatkan token dari localStorage
  const token = localStorage.getItem("token");
  let isLoggedIn = false;
  let isAdmin = false;
  let isPasien = false;

  // Memeriksa apakah token ada dan memverifikasi role
  if (token) {
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode token JWT
    if (decodedToken.role === "admin") {
      isLoggedIn = true;
      isAdmin = true;
    } else if (decodedToken.role === "pasien") {
      isLoggedIn = true;
      isPasien = true;
    }
  }

  return (
    <Router>
      <Routes>
        {/* Halaman LandingPage bisa diakses oleh siapapun */}
        <Route path="/" element={<LandingPage />} />

        {/* Halaman Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Halaman Sistem Pakar untuk Pasien */}
        {isLoggedIn && isPasien ? (
          <Route path="/sistem-pakar" element={<SistemPakarPage />} />
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

        {/* Halaman Admin, hanya jika user sudah login dan adalah admin */}
        {isLoggedIn && isAdmin ? (
          <Route
            path="/admin-dashboard"
            element={
              <AdminSidebar>
                <Dashboard />
              </AdminSidebar>
            }
          />
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

        {/* Halaman lainnya */}
        <Route
          path="/data-penyakit-dan-solusi"
          element={
            <AdminSidebar>
              <DataPenyakitDanSolusi />
            </AdminSidebar>
          }
        />
        <Route
          path="/data-gejala"
          element={
            <AdminSidebar>
              <DataGejala />
            </AdminSidebar>
          }
        />
        <Route
          path="/data-relasi-gejala"
          element={
            <AdminSidebar>
              <DataRelasiGejala />
            </AdminSidebar>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
