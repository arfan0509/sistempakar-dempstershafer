import React, { useState } from "react";
import { FiEdit, FiTrash, FiPlus } from "react-icons/fi";
import ModalTambahGejala from "../components/ModalTambahGejala"; // Import modal

const DataGejala = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gejalaData, setGejalaData] = useState([
    {
      id: 1,
      kode: "G001",
      gejala: "Sering haus dan lapar berlebihan",
      bobot: 0.8,
    },
    {
      id: 2,
      kode: "G002",
      gejala: "Tekanan darah sering tinggi",
      bobot: 0.7,
    },
    {
      id: 3,
      kode: "G003",
      gejala: "Mual dan muntah secara tiba-tiba",
      bobot: 0.6,
    },
  ]);

  // Fungsi untuk menambahkan data baru
  const handleAddData = (kode: string, gejala: string, bobot: number) => {
    const newEntry = {
      id: gejalaData.length + 1,
      kode,
      gejala,
      bobot,
    };
    setGejalaData([...gejalaData, newEntry]);
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Data Gejala Penyakit
      </h1>

      {/* Tombol Tambah Data */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-[#4F81C7] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#2E5077] transition"
      >
        <FiPlus /> Tambah Data
      </button>

      {/* Wrapper untuk tabel */}
      <div className="relative overflow-x-auto md:overflow-visible shadow-md sm:rounded-lg">
        <table className="w-full min-w-full text-sm text-center text-gray-500 dark:text-gray-400 border-collapse">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3 border">No</th>
              <th className="px-4 py-3 border">Kode Gejala</th>
              <th className="px-4 py-3 border">Gejala Penyakit</th>
              <th className="px-4 py-3 border">Bobot Gejala</th>
              <th className="px-4 py-3 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {gejalaData.map((gejala, index) => (
              <tr
                key={gejala.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-4 py-4 border align-top">{index + 1}</td>
                <td className="px-4 py-4 border align-top">{gejala.kode}</td>
                <td className="px-4 py-4 border align-top">{gejala.gejala}</td>
                <td className="px-4 py-4 border align-top">{gejala.bobot}</td>
                <td className="px-4 py-4 border align-top flex flex-col items-center gap-2">
                  <button className="border border-[#4F81C7] text-[#4F81C7] px-3 py-2 rounded-md w-24 h-7 flex items-center justify-center gap-1 hover:bg-[#4F81C7] hover:text-white transition">
                    <FiEdit /> Edit
                  </button>
                  <button className="border border-red-700 text-red-700 px-3 py-2 rounded-md w-24 h-7 flex items-center justify-center gap-1 hover:bg-red-700 hover:text-white transition">
                    <FiTrash /> Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Data */}
      <ModalTambahGejala
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddData}
      />
    </div>
  );
};

export default DataGejala;
