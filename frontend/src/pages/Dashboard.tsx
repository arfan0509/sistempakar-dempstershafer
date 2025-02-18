import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard: React.FC = () => {
  const [penyakitCount, setPenyakitCount] = useState(0);
  const [gejalaCount, setGejalaCount] = useState(0);

  // Ambil data jumlah penyakit dan gejala
  const fetchDashboardData = async () => {
    try {
      const penyakitResponse = await axios.get(
        "http://localhost:5000/api/penyakit"
      );
      const gejalaResponse = await axios.get(
        "http://localhost:5000/api/gejala"
      );

      console.log("Penyakit Data:", penyakitResponse.data); // Debugging log
      console.log("Gejala Data:", gejalaResponse.data); // Debugging log

      setPenyakitCount(penyakitResponse.data.length);
      setGejalaCount(gejalaResponse.data.length);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
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

      {/* Konten Lainnya */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Statistik Terbaru</h2>
        {/* Anda bisa menambahkan grafik atau tabel di sini */}
        {/* Contoh: Grafik distribusi penyakit atau gejala */}
      </div>
    </div>
  );
};

export default Dashboard;
