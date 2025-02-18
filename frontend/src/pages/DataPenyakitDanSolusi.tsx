import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash, FiPlus } from "react-icons/fi";
import ModalTambahPenyakit from "../components/ModalTambahPenyakit";
import ModalEditPenyakit from "../components/ModalEditPenyakit";
import ModalKonfirmasi from "../components/ModalKonfirmasi";  // Import ModalKonfirmasi

const DataPenyakit = () => {
  const [isModalTambahOpen, setIsModalTambahOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [penyakitData, setPenyakitData] = useState([]);
  const [selectedPenyakit, setSelectedPenyakit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  const [penyakitToDelete, setPenyakitToDelete] = useState(null); // State for the penyakit to delete

  // ✅ Fungsi untuk mendapatkan token autentikasi
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  // ✅ Ambil Data Penyakit dari Backend
  const fetchPenyakit = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/penyakit", getAuthHeaders());
      setPenyakitData(response.data);
    } catch (error) {
      console.error("Error fetching penyakit data:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchPenyakit();
  }, []);

  // ✅ Tambah Data Penyakit
  const handleAddData = async (newData) => {
    try {
      await axios.post("http://localhost:5000/api/penyakit/tambah", newData, getAuthHeaders());
      fetchPenyakit();
      setIsModalTambahOpen(false);
    } catch (error) {
      console.error("Error adding penyakit:", error.response?.data || error.message);
    }
  };

  // ✅ Hapus Data Penyakit
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/penyakit/hapus/${id}`, getAuthHeaders());
      fetchPenyakit();
      setIsDeleteModalOpen(false);  // Close the modal after delete
    } catch (error) {
      console.error("Error deleting penyakit:", error.response?.data || error.message);
    }
  };

  // ✅ Edit Data Penyakit
  const handleEdit = async (updatedData) => {
    try {
      await axios.put(
        `http://localhost:5000/api/penyakit/update/${updatedData.id_penyakit}`,
        updatedData,
        getAuthHeaders()
      );
      fetchPenyakit();
      setIsModalEditOpen(false);
    } catch (error) {
      console.error("Error updating penyakit:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-2 pt-4 w-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Data Penyakit dan Solusi
      </h1>

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
              <th className="px-4 py-3 border">Kode Penyakit</th>
              <th className="px-4 py-3 border">Nama Penyakit</th>
              <th className="px-4 py-3 border">Deskripsi</th>
              <th className="px-4 py-3 border">Solusi</th>
              <th className="px-4 py-3 border text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {penyakitData.map((penyakit, index) => (
              <tr
                key={penyakit.id_penyakit}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="px-4 py-4 border">{index + 1}</td>
                <td className="px-4 py-4 border">{penyakit.kode_penyakit}</td>
                <td className="px-4 py-4 border">{penyakit.nama_penyakit}</td>
                <td className="px-4 py-4 border">{penyakit.deskripsi}</td>
                <td className="px-4 py-4 border">{penyakit.solusi}</td>
                <td className="px-4 py-4 border">
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedPenyakit(penyakit);
                        setIsModalEditOpen(true);
                      }}
                      className="border border-blue-500 text-blue-500 px-3 py-2 rounded-md w-24 h-7 flex items-center justify-center gap-1 hover:bg-blue-500 hover:text-white transition"
                    >
                      <FiEdit /> Edit
                    </button>
                    <button
                      onClick={() => {
                        setPenyakitToDelete(penyakit); // Set the selected penyakit for deletion
                        setIsDeleteModalOpen(true); // Open the delete confirmation modal
                      }}
                      className="border border-red-700 text-red-700 px-3 py-2 rounded-md w-24 h-7 flex items-center justify-center gap-1 hover:bg-red-700 hover:text-white transition"
                    >
                      <FiTrash /> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Data */}
      <ModalTambahPenyakit
        isOpen={isModalTambahOpen}
        onClose={() => setIsModalTambahOpen(false)}
        onSave={handleAddData}
      />

      {/* Modal Edit Data */}
      {selectedPenyakit && (
        <ModalEditPenyakit
          isOpen={isModalEditOpen}
          onClose={() => setIsModalEditOpen(false)}
          onSave={handleEdit}
          data={selectedPenyakit}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {penyakitToDelete && (
        <ModalKonfirmasi
          isOpen={isDeleteModalOpen}
          message={`Apakah Anda yakin ingin menghapus penyakit ${penyakitToDelete.nama_penyakit}?`}
          onConfirm={() => handleDelete(penyakitToDelete.id_penyakit)}
          onCancel={() => setIsDeleteModalOpen(false)} // Close the modal if cancel is clicked
        />
      )}
    </div>
  );
};

export default DataPenyakit;
