import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import Layout
import AdminLayout from "./components/AdminSidebar";

// Import Halaman
import Dashboard from "./pages/Dashboard";
import DataPenyakitDanSolusi from "./pages/DataPenyakitDanSolusi";
import DataGejala from "./pages/DataGejala";
import DataRelasiGejala from "./pages/DataRelasiGejala"; // Tambahkan halaman relasi

function App() {
  return (
    <Router>
      <AdminLayout>
        <Routes>
          {/* Route Default Redirect ke Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {/* Route Halaman Utama */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/data-penyakit-dan-solusi"
            element={<DataPenyakitDanSolusi />}
          />
          <Route path="/data-gejala" element={<DataGejala />} />
          <Route
            path="/data-relasi-gejala"
            element={<DataRelasiGejala />}
          />{" "}
          {/* Route baru */}
        </Routes>
      </AdminLayout>
    </Router>
  );
}

export default App;
