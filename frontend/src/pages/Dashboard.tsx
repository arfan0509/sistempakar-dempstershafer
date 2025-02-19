import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard: React.FC = () => {
  const [penyakitCount, setPenyakitCount] = useState(0);
  const [gejalaCount, setGejalaCount] = useState(0);
  const [loading, setLoading] = useState(true); // Tambahkan loading state

  // ✅ Fungsi untuk mengambil token autentikasi dari localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Token tidak ditemukan, redirect ke login.");
      window.location.href = "/admin-login"; // Redirect jika token tidak ada
      return null;
    }
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // ✅ Ambil Data Dashboard
  const fetchDashboardData = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return; // Jika token tidak ada, hentikan eksekusi

      const penyakitResponse = await axios.get(
        "http://localhost:5000/api/penyakit",
        headers
      );
      const gejalaResponse = await axios.get(
        "http://localhost:5000/api/gejala",
        headers
      );

      setPenyakitCount(penyakitResponse.data.length);
      setGejalaCount(gejalaResponse.data.length);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.status === 401) {
        alert("Sesi telah habis. Silakan login ulang.");
        localStorage.removeItem("accessToken");
        window.location.href = "/admin-login";
      }
    } finally {
      setLoading(false); // Matikan loading setelah data selesai diambil
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ✅ Tampilkan Loading jika Data Masih Diproses
  if (loading) {
    return <p className="text-center text-gray-700 mt-4">Memuat data...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <p>Selamat datang di dashboard admin!</p>

      {/* Statistik Jumlah Penyakit dan Gejala */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div className="p-4 bg-[#4F81C7] text-white rounded-md shadow-lg">
          <h3 className="text-lg font-semibold">Jumlah Penyakit</h3>
          <p className="text-2xl">{penyakitCount}</p>
        </div>
        <div className="p-4 bg-[#4F81C7] text-white rounded-md shadow-lg">
          <h3 className="text-lg font-semibold">Jumlah Gejala</h3>
          <p className="text-2xl">{gejalaCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
