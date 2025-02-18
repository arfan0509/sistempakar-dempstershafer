import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<"admin" | "pasien" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Fungsi untuk login
  const handleLogin = async () => {
    if (!role) {
      alert("Pilih peran terlebih dahulu");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/${role}/login`,
        { email, password }
      );
      const { token } = response.data;

      // Simpan token di localStorage
      localStorage.setItem("token", token);

      // Arahkan ke halaman yang sesuai
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "pasien") {
        navigate("/sistem-pakar");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Terjadi kesalahan");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/assets/kucing2.jpg")' }}
    >
      {/* Overlay untuk efek gelap */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 p-8 bg-white bg-opacity-80 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Selamat Datang di Sistem Pakar
        </h2>

        {/* Pilihan Login */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Pilih peran Anda untuk melanjutkan
          </h3>
          <div className="flex space-x-4 justify-center">
            <button
              className={`px-6 py-2 w-36 rounded-lg font-semibold ${
                role === "admin"
                  ? "bg-[#4F81C7] text-white"
                  : "bg-transparent border-2 border-[#4F81C7] text-[#4F81C7]"
              } hover:bg-[#3e6b99] transition duration-300`}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
            <button
              className={`px-6 py-2 w-36 rounded-lg font-semibold ${
                role === "pasien"
                  ? "bg-[#4F81C7] text-white"
                  : "bg-transparent border-2 border-[#4F81C7] text-[#4F81C7]"
              } hover:bg-[#3e6b99] transition duration-300`}
              onClick={() => setRole("pasien")}
            >
              Pasien
            </button>
          </div>
        </div>

        {/* Form Login */}
        {role && (
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">
              Masukkan kredensial Anda
            </h4>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full py-3 text-white bg-[#4F81C7] rounded-lg hover:bg-[#3e6b99] transition duration-300"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
