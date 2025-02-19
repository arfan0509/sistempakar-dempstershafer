import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash, FiPlus } from "react-icons/fi";
import ModalTambahGejala from "../components/ModalTambahGejala";
import ModalEditGejala from "../components/ModalEditGejala";
import ModalKonfirmasi from "../components/ModalKonfirmasi"; // Import ModalKonfirmasi

const DataGejala = () => {
  const [isModalTambahOpen, setIsModalTambahOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [gejalaData, setGejalaData] = useState([]);
  const [selectedGejala, setSelectedGejala] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [gejalaToDelete, setGejalaToDelete] = useState(null); // State for the gejala to delete

  // ✅ Fungsi untuk mendapatkan token autentikasi
  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken"); // Gunakan key yang benar
    if (!token) {
      console.error("Token tidak ditemukan, silakan login ulang!");
      return null;
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  // ✅ Ambil Data Gejala dari Backend
  const fetchGejala = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return; // Jika token tidak ada, hentikan proses
      const response = await axios.get(
        "http://localhost:5000/api/gejala",
        headers
      );
      setGejalaData(response.data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          console.error("Unauthorized: Token mungkin sudah kadaluwarsa.");
          // Optional: Tambahkan logika untuk refresh token di sini
        } else {
          console.error("Error fetching gejala data:", error.response.data);
        }
      } else {
        console.error("Error fetching gejala data:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchGejala();
  }, []);

  // ✅ Tambah Data Gejala
  const handleAddData = async (newData) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;
      await axios.post(
        "http://localhost:5000/api/gejala/tambah",
        newData,
        headers
      );
      fetchGejala();
      setIsModalTambahOpen(false);
    } catch (error) {
      console.error(
        "Error adding gejala:",
        error.response?.data || error.message
      );
    }
  };

  // ✅ Hapus Data Gejala
  const handleDelete = async (id) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;
      await axios.delete(
        `http://localhost:5000/api/gejala/hapus/${id}`,
        headers
      );
      fetchGejala();
      setIsDeleteModalOpen(false); // Close the delete modal
    } catch (error) {
      console.error(
        "Error deleting gejala:",
        error.response?.data || error.message
      );
    }
  };

  // ✅ Edit Data Gejala
  const handleEdit = async (updatedData) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;
      await axios.put(
        `http://localhost:5000/api/gejala/update/${updatedData.id_gejala}`,
        updatedData,
        headers
      );
      fetchGejala();
      setIsModalEditOpen(false);
    } catch (error) {
      console.error(
        "Error updating gejala:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="p-2 pt-4 w-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Data Gejala</h1>

      {/* Tombol Tambah Data */}
      <button
        onClick={() => setIsModalTambahOpen(true)}
        className="mb-4 bg-[#4F81C7] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#2E5077] transition"
      >
        <FiPlus /> Tambah Data
      </button>

      {/* Tabel */}
      <div className="relative overflow-x-auto md:overflow-visible shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-center text-gray-500 border-collapse">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3 border">No</th>
              <th className="px-4 py-3 border">Kode Gejala</th>
              <th className="px-4 py-3 border">Nama Gejala</th>
              <th className="px-4 py-3 border">Bobot</th>
              <th className="px-4 py-3 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {gejalaData.map((gejala, index) => (
              <tr
                key={gejala.id_gejala}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="px-4 py-4 border">{index + 1}</td>
                <td className="px-4 py-4 border">{gejala.kode_gejala}</td>
                <td className="px-4 py-4 border">{gejala.nama_gejala}</td>
                <td className="px-4 py-4 border">
                  {new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 2,
                  }).format(gejala.bobot)}
                </td>

                <td className="px-4 py-4 border flex flex-col items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedGejala(gejala);
                      setIsModalEditOpen(true);
                    }}
                    className="border border-blue-500 text-blue-500 px-3 py-2 rounded-md w-24 h-7 flex items-center justify-center gap-1 hover:bg-blue-500 hover:text-white transition"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setGejalaToDelete(gejala); // Set the selected gejala for deletion
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
      <ModalTambahGejala
        isOpen={isModalTambahOpen}
        onClose={() => setIsModalTambahOpen(false)}
        onSave={handleAddData}
      />

      {/* Modal Edit Data */}
      {selectedGejala && (
        <ModalEditGejala
          isOpen={isModalEditOpen}
          onClose={() => setIsModalEditOpen(false)}
          onSave={handleEdit}
          data={selectedGejala}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {gejalaToDelete && (
        <ModalKonfirmasi
          isOpen={isDeleteModalOpen}
          message={`Apakah Anda yakin ingin menghapus gejala ${gejalaToDelete.nama_gejala}?`}
          onConfirm={() => handleDelete(gejalaToDelete.id_gejala)}
          onCancel={() => setIsDeleteModalOpen(false)} // Close the modal if cancel is clicked
        />
      )}
    </div>
  );
};

export default DataGejala;
