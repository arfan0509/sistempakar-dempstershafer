import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash, FiPlus } from "react-icons/fi";
import ModalTambahRelasi from "../components/ModalTambahRelasi";
import ModalEditRelasi from "../components/ModalEditRelasi";
import ModalKonfirmasi from "../components/ModalKonfirmasi"; // Import ModalKonfirmasi

const DataRelasiGejala = () => {
  const [isModalTambahOpen, setIsModalTambahOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [relasiData, setRelasiData] = useState([]);
  const [penyakitData, setPenyakitData] = useState([]);
  const [gejalaData, setGejalaData] = useState([]);
  const [selectedRelasi, setSelectedRelasi] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [gejalaToDelete, setGejalaToDelete] = useState(null); // State untuk gejala yang akan dihapus

  // ✅ Ambil Data Relasi, Penyakit, dan Gejala
  const fetchData = async () => {
    try {
      const relasiResponse = await axios.get(
        "http://localhost:5000/api/relasi"
      );
      const penyakitResponse = await axios.get(
        "http://localhost:5000/api/penyakit"
      );
      const gejalaResponse = await axios.get(
        "http://localhost:5000/api/gejala"
      );

      setRelasiData(relasiResponse.data);
      setPenyakitData(penyakitResponse.data);
      setGejalaData(gejalaResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Tambah Data Relasi
  const handleAddData = async (newData) => {
    try {
      const gejala = gejalaData.find(
        (gejala) => gejala.id_gejala === newData.id_gejala
      );
      if (gejala) {
        newData.bobot = gejala.bobot; // Ambil bobot dari gejala yang sesuai
      }

      const headers = getAuthHeaders();
      if (!headers) return;

      await axios.post(
        "http://localhost:5000/api/relasi/tambah",
        newData,
        headers
      );
      fetchData();
      setIsModalTambahOpen(false);
    } catch (error) {
      console.error(
        "Error adding relasi:",
        error.response?.data || error.message
      );
    }
  };

  // ✅ Hapus Data Relasi
  const handleDelete = async (id) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;
      await axios.delete(
        `http://localhost:5000/api/relasi/hapus/${id}`,
        headers
      );
      fetchData();
      setIsDeleteModalOpen(false); // Close the delete modal
    } catch (error) {
      console.error(
        "Error deleting relasi:",
        error.response?.data || error.message
      );
    }
  };

  // ✅ Edit Data Relasi
  const handleEdit = async (updatedData) => {
    try {
      const gejala = gejalaData.find(
        (gejala) => gejala.id_gejala === updatedData.id_gejala
      );
      if (gejala) {
        updatedData.bobot = gejala.bobot; // Ambil bobot dari gejala yang sesuai
      }

      const headers = getAuthHeaders();
      if (!headers) return;

      await axios.put(
        `http://localhost:5000/api/relasi/update/${updatedData.id_relasi}`,
        updatedData,
        headers
      );
      fetchData();
      setIsModalEditOpen(false);
    } catch (error) {
      console.error(
        "Error updating relasi:",
        error.response?.data || error.message
      );
    }
  };

  // Mencari nama penyakit berdasarkan id_penyakit
  const getPenyakitName = (id_penyakit) => {
    const penyakit = penyakitData.find(
      (penyakit) => penyakit.id_penyakit === id_penyakit
    );
    return penyakit
      ? `${penyakit.kode_penyakit} | ${penyakit.nama_penyakit}`
      : "-";
  };

  // Mencari nama gejala berdasarkan id_gejala
  const getGejalaName = (id_gejala) => {
    const gejala = gejalaData.find((gejala) => gejala.id_gejala === id_gejala);
    return gejala ? `${gejala.kode_gejala} | ${gejala.nama_gejala}` : "-";
  };

  // ✅ Fungsi untuk mendapatkan accessToken autentikasi
  const getAuthHeaders = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("accessToken tidak ditemukan, silakan login ulang!");
      return null;
    }
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };
  };

  return (
    <div className="p-2 pt-4 w-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Data Relasi Gejala
      </h1>

      {/* Tombol Tambah Data */}
      <button
        onClick={() => setIsModalTambahOpen(true)}
        className="mb-4 bg-[#4F81C7] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#2E5077] transition"
      >
        <FiPlus /> Tambah Data
      </button>

      {/* Tabel Relasi */}
      <div className="relative overflow-x-auto md:overflow-visible shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-center text-gray-500 border-collapse">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3 border">No</th>
              <th className="px-4 py-3 border">Kode Penyakit</th>
              <th className="px-4 py-3 border">Kode Gejala</th>
              <th className="px-4 py-3 border">Bobot</th>
              <th className="px-4 py-3 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {relasiData.map((relasi, index) => (
              <tr
                key={relasi.id_relasi}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="px-4 py-4 border">{index + 1}</td>
                <td className="px-4 py-4 border">
                  {getPenyakitName(relasi.id_penyakit)}
                </td>
                <td className="px-4 py-4 border">
                  {getGejalaName(relasi.id_gejala)}
                </td>
                <td className="px-4 py-4 border">{relasi.bobot}</td>
                <td className="px-4 py-4 border flex flex-col items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedRelasi(relasi);
                      setIsModalEditOpen(true);
                    }}
                    className="border border-blue-500 text-blue-500 px-3 py-2 rounded-md w-24 h-7 flex items-center justify-center gap-1 hover:bg-blue-500 hover:text-white transition"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setGejalaToDelete(relasi); // Set the selected relasi for deletion
                      setIsDeleteModalOpen(true); // Open the delete confirmation modal
                    }}
                    className="border border-red-700 text-red-700 px-3 py-2 rounded-md w-24 h-7 flex items-center justify-center gap-1 hover:bg-red-700 hover:text-white transition"
                  >
                    <FiTrash /> Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Data */}
      <ModalTambahRelasi
        isOpen={isModalTambahOpen}
        onClose={() => setIsModalTambahOpen(false)}
        onSave={handleAddData}
      />

      {/* Modal Edit Data */}
      {selectedRelasi && (
        <ModalEditRelasi
          isOpen={isModalEditOpen}
          onClose={() => setIsModalEditOpen(false)}
          onSave={handleEdit}
          data={selectedRelasi}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {gejalaToDelete && (
        <ModalKonfirmasi
          isOpen={isDeleteModalOpen}
          message={`Apakah Anda yakin ingin menghapus relasi antara penyakit dan gejala ini?`}
          onConfirm={() => handleDelete(gejalaToDelete.id_relasi)}
          onCancel={() => setIsDeleteModalOpen(false)} // Close the modal if cancel is clicked
        />
      )}
    </div>
  );
};

export default DataRelasiGejala;
