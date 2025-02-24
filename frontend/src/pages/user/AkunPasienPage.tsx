import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  FiEdit,
  FiMenu,
  FiX,
  FiUser,
  FiArrowLeft,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AkunPasienPage = () => {
  const [pasien, setPasien] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const fetchPasien = async () => {
    try {
      const response = await axiosInstance.get("/pasien/me");
      setPasien(response.data);
      setEditForm(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pasien:", error);
    }
  };

  const handleEditSave = async () => {
    try {
      await axiosInstance.put(`/pasien/edit`, editForm);
      setPasien(editForm);
      setIsEditModalOpen(false);
      setSuccessMessage("✅ Data berhasil diperbarui.");
    } catch (error) {
      console.error("Gagal memperbarui data pasien:", error);
    }
  };

  const handleChangePassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const { oldPassword, newPassword, confirmPassword } = passwordForm;
    if (!oldPassword || !newPassword || !confirmPassword)
      return setErrorMessage("Semua kolom wajib diisi.");
    if (newPassword !== confirmPassword)
      return setErrorMessage("Password baru dan konfirmasi harus sama.");
    if (newPassword.length < 6)
      return setErrorMessage("Password minimal 6 karakter.");

    try {
      await axiosInstance.put("/pasien/change-password", {
        oldPassword,
        newPassword,
      });
      setSuccessMessage("✅ Password berhasil diubah.");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setIsPasswordModalOpen(false), 2000);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Gagal mengubah password.");
    }
  };

  useEffect(() => {
    fetchPasien();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-[#4F81C7] text-white w-64 p-6 shadow-lg transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:w-72`}
      >
        <button
          className="absolute top-4 right-4 text-white md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <FiX size={24} />
        </button>

        <h2 className="text-xl font-bold mb-6 text-left">Akun Pasien</h2>
        <ul className="space-y-4">
          <li
            className="flex items-center gap-3 cursor-pointer hover:bg-[#3A6BA8] p-2 rounded-md transition"
            onClick={() => navigate("/sistem-pakar")}
          >
            <FiArrowLeft size={18} />
            <span>Kembali</span>
          </li>
          <li className="flex items-center gap-3 bg-white text-[#4F81C7] p-2 rounded-md font-semibold">
            <FiUser size={18} />
            <span>Akun Saya</span>
          </li>
          <li
            className="flex items-center gap-3 cursor-pointer hover:bg-[#3A6BA8] p-2 rounded-md transition"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            <FiLock size={18} />
            <span>Ubah Password</span>
          </li>
        </ul>
      </div>

      {/* Konten */}
      <div className="flex-1 p-6 bg-gray-100">
        {/* Navbar Mobile */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <button
            className="text-[#4F81C7]"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FiMenu size={28} />
          </button>
          <h2 className="text-xl font-bold text-gray-700">Akun Pasien</h2>
          <div></div>
        </div>

        {/* Card Akun Pasien */}
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Detail Akun Pasien
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg">
            <p>
              <strong>Nama:</strong> {pasien.nama}
            </p>
            <p>
              <strong>Email:</strong> {pasien.email}
            </p>
            <p>
              <strong>Alamat:</strong> {pasien.alamat}
            </p>
            <p>
              <strong>No. Telepon:</strong> {pasien.no_telp}
            </p>
          </div>

          <button
            className="mt-6 bg-[#4F81C7] text-white px-6 py-3 rounded-lg hover:bg-[#3e6b99] transition flex items-center gap-2 shadow-lg"
            onClick={() => setIsEditModalOpen(true)}
          >
            <FiEdit size={20} /> Edit Profil
          </button>
        </div>
      </div>

      {/* Modal Edit Profil */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              ✏️ Edit Profil
            </h2>
            <input
              type="text"
              value={editForm.nama}
              onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
              placeholder="Nama"
              className="w-full mb-3 p-3 border rounded-md focus:ring-[#4F81C7]"
            />
            <input
              type="text"
              value={editForm.alamat}
              onChange={(e) => setEditForm({ ...editForm, alamat: e.target.value })}
              placeholder="Alamat"
              className="w-full mb-3 p-3 border rounded-md focus:ring-[#4F81C7]"
            />
            <input
              type="text"
              value={editForm.no_telp}
              onChange={(e) => setEditForm({ ...editForm, no_telp: e.target.value })}
              placeholder="No. Telepon"
              className="w-full mb-6 p-3 border rounded-md focus:ring-[#4F81C7]"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Batal
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-[#4F81C7] text-white rounded-md hover:bg-[#3A6BA8]"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ubah Password */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              🔒 Ubah Password
            </h2>

            {errorMessage && (
              <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">
                {successMessage}
              </div>
            )}

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password Lama"
              value={passwordForm.oldPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
              }
              className="w-full p-3 border rounded-lg mb-3 focus:ring-[#4F81C7]"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password Baru"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              className="w-full p-3 border rounded-lg mb-3 focus:ring-[#4F81C7]"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Konfirmasi Password Baru"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg mb-6 focus:ring-[#4F81C7]"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Batal
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-[#4F81C7] text-white rounded-md hover:bg-[#3A6BA8]"
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

export default AkunPasienPage;
