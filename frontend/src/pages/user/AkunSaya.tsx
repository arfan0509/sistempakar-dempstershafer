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
    <div className="flex h-screen">
      <PasienSidebar activePage="akun" />
      <div className="flex-1 p-6 bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold mb-6">Detail Akun Pasien</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg">
            <p><strong>Nama:</strong> {pasien.nama}</p>
            <p><strong>Email:</strong> {pasien.email}</p>
            <p><strong>Alamat:</strong> {pasien.alamat}</p>
            <p><strong>No. Telepon:</strong> {pasien.no_telp}</p>
          </div>
          <button
            className="mt-6 bg-[#4F81C7] text-white px-6 py-3 rounded-lg hover:bg-[#3e6b99] flex items-center gap-2 shadow-lg"
            onClick={() => setIsEditModalOpen(true)}
          >
            <FiEdit size={20} /> Edit Profil
          </button>
        </div>
      </div>

      {/* Modal Edit Profil */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">✏️ Edit Profil</h2>
            <input
              type="text"
              value={editForm.nama}
              onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
              placeholder="Nama"
              className="w-full mb-3 p-3 border rounded-md"
            />
            <input
              type="text"
              value={editForm.alamat}
              onChange={(e) => setEditForm({ ...editForm, alamat: e.target.value })}
              placeholder="Alamat"
              className="w-full mb-3 p-3 border rounded-md"
            />
            <input
              type="text"
              value={editForm.no_telp}
              onChange={(e) => setEditForm({ ...editForm, no_telp: e.target.value })}
              placeholder="No. Telepon"
              className="w-full mb-6 p-3 border rounded-md"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-gray-400 text-white rounded-md">Batal</button>
              <button onClick={handleEditSave} className="px-4 py-2 bg-[#4F81C7] text-white rounded-md">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AkunSaya;
