import React, { useState } from "react";

const ModalTambahGejala = ({ isOpen, onClose, onSave }) => {
  const [kode, setKode] = useState("");
  const [gejala, setGejala] = useState("");
  const [bobot, setBobot] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!kode || !gejala || !bobot) return;

    onSave(kode, gejala, parseFloat(bobot));
    onClose();
    setKode("");
    setGejala("");
    setBobot("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Tambah Gejala Baru
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Kode Gejala"
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Gejala Penyakit"
            value={gejala}
            onChange={(e) => setGejala(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="number"
            placeholder="Bobot Gejala"
            value={bobot}
            onChange={(e) => setBobot(e.target.value)}
            className="w-full p-2 border rounded-md"
            step="0.1"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-500 text-gray-500 rounded-md hover:bg-gray-200 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4F81C7] text-white rounded-md hover:bg-[#2E5077] transition"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTambahGejala;
