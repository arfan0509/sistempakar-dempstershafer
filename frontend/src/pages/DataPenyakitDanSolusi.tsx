import React, { useState } from "react";
import { FiEdit, FiTrash, FiPlus } from "react-icons/fi";
import ModalTambahPenyakit from "../components/ModalTambahPenyakit"; // Import modal

const DataPenyakit = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [penyakitData, setPenyakitData] = useState([
    {
      id: 1,
      kode: "P001",
      nama: "Diabetes Mellitus",
      solusi: "Menjaga pola makan, olahraga rutin, dan pengobatan insulin.",
    },
    {
      id: 2,
      kode: "P002",
      nama: "Hipertensi",
      solusi: "Mengurangi asupan garam, olahraga, dan obat antihipertensi.",
    },
    {
      id: 3,
      kode: "P003",
      nama: "Gagal Ginjal",
      solusi:
        "Diet rendah protein, cuci darah (hemodialisis), dan transplantasi ginjal.",
    },
  ]);

  // Fungsi untuk menambahkan data baru
  const handleAddData = (kode: string, nama: string, solusi: string) => {
    const newEntry = {
      id: penyakitData.length + 1,
      kode,
      nama,
      solusi,
    };
    setPenyakitData([...penyakitData, newEntry]);
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Data Penyakit dan Solusi
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
              <th className="px-4 py-3 border">Kode Penyakit</th>
              <th className="px-4 py-3 border">Nama Penyakit</th>
              <th className="px-4 py-3 border">Solusi</th>
              <th className="px-4 py-3 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {penyakitData.map((penyakit, index) => (
              <tr
                key={penyakit.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-4 py-4 border align-top">{index + 1}</td>
                <td className="px-4 py-4 border align-top">{penyakit.kode}</td>
                <td className="px-4 py-4 border align-top">{penyakit.nama}</td>
                <td className="px-4 py-4 border align-top whitespace-normal break-words">
                  {penyakit.solusi}
                </td>
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
      <ModalTambahPenyakit
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddData}
      />
    </div>
  );
};

export default DataPenyakit;
