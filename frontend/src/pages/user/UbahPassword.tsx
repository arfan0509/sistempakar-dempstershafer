import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import PasienSidebar from "../../components/user/PasienSidebar";
import { FiEye, FiEyeOff } from "react-icons/fi";

const UbahPassword = () => {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChangePassword = async () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword)
      return setMessage("❗ Semua kolom wajib diisi.");
    if (form.newPassword !== form.confirmPassword)
      return setMessage("❗ Password baru dan konfirmasi tidak cocok.");
    if (form.newPassword.length < 6)
      return setMessage("❗ Password minimal 6 karakter.");

    try {
      await axiosInstance.put("/pasien/change-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });
      setMessage("✅ Password berhasil diubah.");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      setMessage(error.response?.data?.message || "❌ Gagal mengubah password.");
    }
  };

  return (
    <div className="flex h-screen">
      <PasienSidebar activePage="password" />
      <div className="flex-1 p-6 bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-center">🔒 Ubah Password</h2>
          {message && <div className="text-center text-red-600 mb-4">{message}</div>}
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password Lama"
            value={form.oldPassword}
            onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
            className="w-full mb-3 p-3 border rounded-md"
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password Baru"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            className="w-full mb-3 p-3 border rounded-md"
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Konfirmasi Password Baru"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="w-full mb-6 p-3 border rounded-md"
          />
          <div className="flex justify-between">
            <button onClick={() => setShowPassword(!showPassword)} className="text-gray-600">
              {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
            </button>
            <button onClick={handleChangePassword} className="px-6 py-2 bg-[#4F81C7] text-white rounded-lg hover:bg-[#3A6BA8]">
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UbahPassword;
