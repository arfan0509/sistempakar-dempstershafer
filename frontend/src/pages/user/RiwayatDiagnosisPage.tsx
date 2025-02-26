import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../../components/user/NavbarComponent";
import {
  FiArrowLeft,
  FiChevronDown,
  FiChevronUp,
  FiPrinter,
} from "react-icons/fi";
import { FaStethoscope, FaHeartbeat } from "react-icons/fa";
import PrintSingleDiagnosis from "../../components/user/PrintSingleDiagnosis";

const RiwayatDiagnosisPage: React.FC = () => {
  const [diagnosisList, setDiagnosisList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("baru"); // ⭐️ Filter default: Terbaru
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const id_pasien = localStorage.getItem("id_pasien");
        if (id_pasien) {
          const response = await axiosInstance.get(`/diagnosis/${id_pasien}`);
          const sortedData = sortDiagnoses(response.data, sortOrder);
          setDiagnosisList(sortedData);
        }
      } catch (error) {
        console.error("Error fetching diagnosis data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiagnosis();
  }, [sortOrder]); // ⏳ Akan di-fetch ulang saat sortOrder berubah

  // 🔄 Fungsi untuk mengurutkan diagnosis
  const sortDiagnoses = (data: any[], order: string) => {
    return data.sort((a, b) =>
      order === "baru"
        ? new Date(b.tanggal_diagnosis).getTime() -
          new Date(a.tanggal_diagnosis).getTime()
        : new Date(a.tanggal_diagnosis).getTime() -
          new Date(b.tanggal_diagnosis).getTime()
    );
  };

  const toggleDropdown = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handlePrint = (diagnosis: any) => {
    PrintSingleDiagnosis(diagnosis);
  };

  return (
    <>
      <NavbarComponent />
      <div className="container mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        {/* 🔙 Tombol Kembali */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate("/sistem-pakar")}
            className="flex items-center text-[#4F81C7] hover:text-[#3e6b99] font-semibold text-lg"
          >
            <FiArrowLeft className="mr-2" size={20} />
            Kembali
          </button>

          {/* 🔽 Filter Urutan */}
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Urutkan:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
            >
              <option value="baru">Terbaru</option>
              <option value="lama">Terlama</option>
            </select>
          </div>
        </div>

        {/* 📝 Judul Halaman */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Riwayat Diagnosis</h2>
          <p className="text-lg text-gray-600">
            Lihat riwayat diagnosis kucing Anda disini.
          </p>
        </div>

        {/* 🔄 Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin border-4 border-[#4F81C7] border-t-transparent rounded-full w-16 h-16"></div>
          </div>
        ) : diagnosisList.length === 0 ? (
          <div className="text-center py-20">
            <img
              src="/assets/no-diagnosis-cats.svg"
              alt="Belum ada diagnosis"
              className="mx-auto w-72 mb-6"
            />
            <p className="text-xl text-gray-700">
              Anda belum memiliki riwayat diagnosis.
            </p>
            <button
              onClick={() => navigate("/sistem-pakar")}
              className="mt-4 text-white bg-[#4F81C7] hover:bg-[#3e6b99] py-2 px-6 rounded-lg"
            >
              Mulai Diagnosis
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
            {diagnosisList.map((diagnosis, index) => (
              <div
                key={diagnosis.id_diagnosis}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
              >
                {/* 🐾 Identitas Kucing */}
                <div className="mb-4 space-y-2">
                  <p className="text-gray-600">
                    <strong>Nama Kucing:</strong> {diagnosis.nama_kucing}
                  </p>
                  <p className="text-gray-600">
                    <strong>Jenis Kelamin:</strong> {diagnosis.jenis_kelamin}
                  </p>
                  <p className="text-gray-600">
                    <strong>Usia:</strong> {diagnosis.usia}
                  </p>
                  <p className="text-gray-600">
                    <strong>Warna Bulu:</strong> {diagnosis.warna_bulu}
                  </p>
                </div>

                {/* 💉 Diagnosis Utama */}
                <div className="bg-[#4F81C7] text-white py-3 px-4 rounded-lg shadow mb-4 flex justify-between items-center">
                  <h3 className="text-2xl font-bold flex items-center">
                    <FaStethoscope className="mr-2" />
                    {diagnosis.hasil_diagnosis.penyakit}
                  </h3>
                  {/* 🖨️ Tombol Cetak */}
                  <button
                    onClick={() => handlePrint(diagnosis)}
                    className="bg-white text-[#4F81C7] rounded-full p-2 shadow hover:bg-gray-200 transition"
                    title="Cetak Diagnosis"
                  >
                    <FiPrinter size={22} />
                  </button>
                </div>

                {/* 📝 Gejala Terdeteksi */}
                <div className="mt-4">
                  <h4 className="text-xl font-semibold text-gray-700">
                    Gejala Terdeteksi
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {diagnosis.hasil_diagnosis.gejala_terdeteksi.map(
                      (gejala: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-[#4F81C7] text-white text-sm py-1 px-3 rounded-full"
                        >
                          {gejala}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* 🕒 Tanggal & Waktu */}
                <div className="mt-6 text-sm text-gray-500 flex items-center justify-start space-x-2">
                  <p>
                    {new Date(
                      diagnosis.tanggal_diagnosis
                    ).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <span>|</span>
                  <p>
                    {new Date(diagnosis.tanggal_diagnosis).toLocaleTimeString(
                      "id-ID",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}{" "}
                    WIB
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default RiwayatDiagnosisPage;
