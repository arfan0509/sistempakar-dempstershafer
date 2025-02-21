import React, { useState, useContext } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { AuthContext } from "../../context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi"; // ✅ Import ikon show/hide password

const LoginPasienPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ State untuk toggle password
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ Gunakan useNavigate

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post("/pasien/login", {
        email,
        password,
      });
      const { accessToken, refreshToken } = response.data;

      // ✅ Simpan refresh token dan access token ke localStorage
      localStorage.setItem("refreshToken", refreshToken);
      login(accessToken, refreshToken); // ✅ Login dengan accessToken dan refreshToken
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Terjadi kesalahan");
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/assets/login-pasien.jpg")' }} // ✅ Ganti dengan gambar pasien atau dokter
    >
      {/* ✅ Overlay Transparan dan Blur */}
      <div className="absolute inset-0 bg-white bg-opacity-60 backdrop-blur-md"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white bg-opacity-90 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login Pasien
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Masukkan email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7] bg-white/90 text-gray-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700 font-medium mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7] pr-12 bg-white/90 text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600 hover:text-gray-900"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
            </div>
          </div>
        </div>

        <button
          className="w-full py-3 text-white bg-[#4F81C7] rounded-lg hover:bg-[#3e6b99] transition duration-300 font-semibold shadow-md"
          onClick={handleLogin}
        >
          Login
        </button>

        {/* ✅ Tombol daftar bagi yang belum punya akun */}
        <p className="text-center text-gray-600 mt-4">
          Belum punya akun?{" "}
          <button
            className="text-[#4F81C7] font-semibold hover:underline focus:outline-none"
            onClick={() => navigate("/pasien-register")} // ✅ Perbaikan dengan useNavigate
          >
            Daftar di sini
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPasienPage;
