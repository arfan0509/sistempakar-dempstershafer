import React, { useState } from "react";
import { FiEdit, FiTrash, FiPlus } from "react-icons/fi";
import ModalTambahRelasi from "../components/ModalTambahRelasi"; // Modal untuk tambah relasi

const DataRelasiGejala = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [relasiData, setRelasiData] = useState([
    {
      id: 1,
      kodeGejala: "G001",
      namaGejala: "Sering haus dan lapar berlebihan",
      relasi: [
        { kodePenyakit: "P001", namaPenyakit: "Diabetes Mellitus", bobot: 0.8 },
        { kodePenyakit: "P002", namaPenyakit: "Hipertensi", bobot: 0.5 },
      ],
    },
    {
      id: 2,
      kodeGejala: "G002",
      namaGejala: "Tekanan darah sering tinggi",
      relasi: [
        { kodePenyakit: "P002", namaPenyakit: "Hipertensi", bobot: 0.9 },
      ],
    },
    {
      id: 3,
      kodeGejala: "G003",
      namaGejala: "Mual dan muntah secara tiba-tiba",
      relasi: [
        { kodePenyakit: "P003", namaPenyakit: "Gagal Ginjal", bobot: 0.7 },
      ],
    },
  ]);

  // Fungsi untuk menambahkan data relasi baru
  const handleAddData = (kodeGejala, namaGejala, relasi) => {
    const newEntry = {
      id: relasiData.length + 1,
      kodeGejala,
      namaGejala,
      relasi,
    };
    setRelasiData([...relasiData, newEntry]);
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Relasi Gejala dan Penyakit
      </h1>

      {/* Tombol Tambah Data */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-[#4F81C7] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#2E5077] transition"
      >
        <FiPlus /> Tambah Relasi
      </button>

      {/* Wrapper untuk tabel */}
      <div className="relative overflow-x-auto md:overflow-visible shadow-md sm:rounded-lg">
        <table className="w-full min-w-full text-sm text-center text-gray-500 dark:text-gray-400 border-collapse">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3 border">Kode Gejala</th>
              <th className="px-4 py-3 border">Nama Gejala</th>
              <th className="px-4 py-3 border">Kode Penyakit - Nama Penyakit</th>
              <th className="px-4 py-3 border">Bobot Gejala</th>
              <th className="px-4 py-3 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {relasiData.map((item) => (
              <tr
                key={item.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-4 py-4 border align-top">{item.kodeGejala}</td>
                <td className="px-4 py-4 border align-top">{item.namaGejala}</td>
                <td className="px-4 py-4 border align-top">
                  {item.relasi.map((rel, i) => (
                    <div key={i}>
                      {rel.kodePenyakit} - {rel.namaPenyakit}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-4 border align-top">
                  {item.relasi.map((rel, i) => (
                    <div key={i}>{rel.bobot}</div>
                  ))}
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

      {/* Modal Tambah Relasi */}
      <ModalTambahRelasi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddData}
      />
    </div>
  );
};

export default DataRelasiGejala;
