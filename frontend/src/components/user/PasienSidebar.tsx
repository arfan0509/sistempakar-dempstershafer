import React, { useState } from "react";
import { FiX, FiUser, FiArrowLeft, FiLock, FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const PasienSidebar = ({ activePage }: { activePage: string }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
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
            className={`flex items-center gap-3 cursor-pointer ${
              activePage === "dashboard"
                ? "bg-white text-[#4F81C7]"
                : "hover:bg-[#3A6BA8]"
            } p-2 rounded-md transition`}
            onClick={() => navigate("/sistem-pakar")}
          >
            <FiArrowLeft size={18} />
            <span>Kembali</span>
          </li>
          <li
            className={`flex items-center gap-3 cursor-pointer ${
              activePage === "akun"
                ? "bg-white text-[#4F81C7]"
                : "hover:bg-[#3A6BA8]"
            } p-2 rounded-md transition`}
            onClick={() => navigate("/akun-saya")}
          >
            <FiUser size={18} />
            <span>Akun Saya</span>
          </li>
          <li
            className={`flex items-center gap-3 cursor-pointer ${
              activePage === "password"
                ? "bg-white text-[#4F81C7]"
                : "hover:bg-[#3A6BA8]"
            } p-2 rounded-md transition`}
            onClick={() => navigate("/ubah-password")}
          >
            <FiLock size={18} />
            <span>Ubah Password</span>
          </li>
        </ul>
      </div>

      {/* Navbar Mobile */}
      <div className="md:hidden bg-[#4F81C7] text-white p-4 flex items-center gap-2">
        <button onClick={() => setIsSidebarOpen(true)} className="focus:outline-none">
          <FiMenu size={24} />
        </button>
        <span className="text-lg font-semibold">Akun Pasien</span>
      </div>
    </>
  );
};

export default PasienSidebar;
