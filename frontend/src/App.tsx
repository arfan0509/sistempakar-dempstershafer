import React, { useState, useEffect } from "react";
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPasien, setIsPasien] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      console.log("Token dari localStorage:", token); // 🔥 Debug Token

      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          console.log("Decoded Token:", decodedToken); // 🔥 Debug Decode Token
          setIsLoggedIn(true);
          setIsAdmin(decodedToken.role === "admin");
          setIsPasien(decodedToken.role === "pasien");
        } catch (error) {
          console.error("Error decoding token", error);
          setIsLoggedIn(false);
          setIsAdmin(false);
          setIsPasien(false);
        }
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setIsPasien(false);
      }
    };

    checkAuth();

    // 🔥 Hapus interval karena tidak perlu dicek terus-menerus
  }, []); // ✅ Dependency list kosong agar hanya berjalan saat pertama kali render

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<LoginAdminPage />} />

        {isLoggedIn && isPasien ? (
          <Route path="/sistem-pakar" element={<SistemPakarPage />} />
        ) : (
          <Route
            path="/sistem-pakar"
            element={<Navigate to="/login" replace />}
          />
        )}

        {isLoggedIn && isAdmin ? (
          <>
            <Route
              path="/admin-dashboard"
              element={
                <AdminSidebar>
                  <Dashboard />
                </AdminSidebar>
              }
            />
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
          </>
        ) : (
          <Route
            path="/admin-dashboard"
            element={<Navigate to="/admin-login" replace />}
          />
        )}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
