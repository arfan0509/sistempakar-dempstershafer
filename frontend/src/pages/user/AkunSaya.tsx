import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FiEdit } from "react-icons/fi";
import PasienSidebar from "../../components/user/PasienSidebar";

const AkunSaya = () => {
  const [pasien, setPasien] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});

  const fetchPasien = async () => {
    const response = await axiosInstance.get("/pasien/me");
    setPasien(response.data);
    setEditForm(response.data);
  };

  const handleEditSave = async () => {
    await axiosInstance.put("/pasien/edit", editForm);
    setPasien(editForm);
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    fetchPasien();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <PasienSidebar activePage="akun" />
      <div className="flex-1 p-6">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-center text-[#4F81C7]">
            🩺 Detail Akun Pasien
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg">
            <p>
              <span className="font-semibold text-gray-700">👤 Nama:</span>{" "}
              {pasien.nama}
            </p>
            <p>
              <span className="font-semibold text-gray-700">📧 Email:</span>{" "}
              {pasien.email}
            </p>
            <p>
              <span className="font-semibold text-gray-700">🏠 Alamat:</span>{" "}
              {pasien.alamat}
            </p>
            <p>
              <span className="font-semibold text-gray-700">📞 No. Telepon:</span>{" "}
              {pasien.no_telp}
            </p>
          </div>
          <button
            className="mt-8 w-full sm:w-auto bg-[#4F81C7] hover:bg-[#3e6b99] text-white px-6 py-3 rounded-lg flex justify-center items-center gap-2 transition-all shadow-lg hover:scale-105"
            onClick={() => setIsEditModalOpen(true)}
          >
            <FiEdit size={20} /> Edit Profil
          </button>
        </div>
      </div>

      {/* Modal Edit Profil */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6 text-center text-[#4F81C7]">
              ✏️ Edit Profil
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                value={editForm.nama}
                onChange={(e) =>
                  setEditForm({ ...editForm, nama: e.target.value })
                }
                placeholder="Nama"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
              />
              <input
                type="text"
                value={editForm.alamat}
                onChange={(e) =>
                  setEditForm({ ...editForm, alamat: e.target.value })
                }
                placeholder="Alamat"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
              />
              <input
                type="text"
                value={editForm.no_telp}
                onChange={(e) =>
                  setEditForm({ ...editForm, no_telp: e.target.value })
                }
                placeholder="No. Telepon"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Batal
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-[#4F81C7] text-white rounded-lg hover:bg-[#3e6b99] transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AkunSaya;
