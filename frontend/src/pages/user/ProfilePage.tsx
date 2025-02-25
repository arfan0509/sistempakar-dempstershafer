import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import SuccessModal from "../../components/SuccessModal";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    alamat: "",
    no_telp: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [validationError, setValidationError] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get("/pasien/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const { nama, email, alamat, no_telp } = response.data;
      setFormData({ nama, email, alamat, no_telp: no_telp || "" });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      navigate("/login-pasien");
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field: string) => {
    setPasswordVisibility({ ...passwordVisibility, [field]: !passwordVisibility[field] });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/pasien/edit", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setModalMessage("Profil berhasil diperbarui!");
      setIsModalOpen(true);
      fetchProfileData();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal memperbarui profil.");
    }
  };

  const validatePassword = () => {
    let isValid = true;
    const errors = { currentPassword: "", newPassword: "", confirmPassword: "" };

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Password saat ini tidak boleh kosong.";
      isValid = false;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "Password baru tidak boleh kosong.";
      isValid = false;
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password baru harus terdiri dari minimal 6 karakter.";
      isValid = false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Konfirmasi password baru tidak cocok.";
      isValid = false;
    }

    setValidationError(errors);
    return isValid;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;
  
    try {
      await axiosInstance.put("/pasien/change-password", passwordData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setModalMessage("Password berhasil diubah!");
      setIsModalOpen(true);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle specific error for incorrect password
        setValidationError({
          currentPassword: "Password Salah",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        console.error("Error changing password:", error);
        alert("Gagal mengubah password.");
      }
    }
  };
  
  const handleModalClose = () => {
    // Setelah menekan tombol tutup, arahkan pengguna ke halaman login
    setIsModalOpen(false);
    navigate("/pasien-login");
  };
  
  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/assets/profile.jpg')",
        backgroundAttachment: "fixed", // Efek background tetap pada tempatnya saat scroll
      }}
    >
      {/* Latar belakang dengan blur yang lebih ringan */}
      <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"></div>
      <div className="relative z-10 container mx-auto p-6 max-w-4xl">
        <button
          onClick={() => navigate("/sistem-pakar")}
          className="flex items-center text-white hover:text-gray-200 mb-6 bg-[#4F81C7] hover:bg-[#3A6BA8] px-4 py-2 rounded-lg transition"
        >
          <FiArrowLeft size={20} className="mr-2" /> Kembali ke Beranda
        </button>
  
        {/* Form Container tanpa ikut blur */}
        <div className="bg-white bg-opacity-85 backdrop-blur-none p-6 rounded-lg shadow-2xl space-y-8">
          <h2 className="text-2xl font-bold text-gray-700 text-center">Profil Saya</h2>
  
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-600">Edit Profil</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-gray-700 font-medium">Nama Lengkap</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleProfileChange}
                  className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
                  required
                />
              </div>
  
              <div className="space-y-1">
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleProfileChange}
                  className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
                  required
                  disabled
                />
              </div>
  
              <div className="space-y-1">
                <label className="block text-gray-700 font-medium">Nomor Telepon</label>
                <input
                  type="text"
                  name="no_telp"
                  value={formData.no_telp}
                  onChange={handleProfileChange}
                  className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
                  required
                />
              </div>
  
              <div className="space-y-1">
                <label className="block text-gray-700 font-medium">Alamat</label>
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleProfileChange}
                  className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
                  required
                ></input>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#4F81C7] hover:bg-[#3A6BA8] text-white py-3 rounded-lg transition duration-300"
            >
              Simpan Perubahan
            </button>
          </form>
  
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-600">Ubah Password</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-gray-700 font-medium">Password Saat Ini</label>
                <div className="relative">
                  <input
                    type={passwordVisibility.currentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("currentPassword")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {passwordVisibility.currentPassword ? <FiEye /> : <FiEyeOff />}
                  </button>
                </div>
                {validationError.currentPassword && <p className="text-red-500 text-sm">{validationError.currentPassword}</p>}
              </div>
  
              <div className="space-y-1">
                <label className="block text-gray-700 font-medium">Password Baru</label>
                <div className="relative">
                  <input
                    type={passwordVisibility.newPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("newPassword")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {passwordVisibility.newPassword ? <FiEye /> : <FiEyeOff />}
                  </button>
                </div>
                {validationError.newPassword && <p className="text-red-500 text-sm">{validationError.newPassword}</p>}
              </div>
  
              <div className="space-y-1">
                <label className="block text-gray-700 font-medium">Konfirmasi Password Baru</label>
                <div className="relative">
                  <input
                    type={passwordVisibility.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {passwordVisibility.confirmPassword ? <FiEye /> : <FiEyeOff />}
                  </button>
                </div>
                {validationError.confirmPassword && <p className="text-red-500 text-sm">{validationError.confirmPassword}</p>}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#4F81C7] hover:bg-[#3A6BA8] text-white py-3 rounded-lg transition duration-300"
            >
              Ubah Password
            </button>
          </form>
        </div>
      </div>
  
      {/* Modal success muncul di atas card */}
      <SuccessModal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={handleModalClose}  // Mengarahkan ke login saat tutup
      />
    </div>
  );
  
  };
  
  export default ProfilePage;
  
