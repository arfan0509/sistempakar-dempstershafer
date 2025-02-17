import React, { useState } from "react";
import { FiX } from "react-icons/fi";

interface ModalTambahPenyakitProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (kode: string, nama: string, solusi: string) => void;
}

const ModalTambahPenyakit: React.FC<ModalTambahPenyakitProps> = ({ isOpen, onClose, onSave }) => {
  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [solusi, setSolusi] = useState("");

  const handleSave = () => {
    if (!kode || !nama || !solusi) return;
    onSave(kode, nama, solusi);
    setKode("");
    setNama("");
    setSolusi("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tambah Data Penyakit</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={20} />
          </button>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">Kode Penyakit</label>
          <input
            type="text"
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            className="w-full border rounded-md px-3 py-2 mt-1 focus:ring focus:ring-green-300 focus:border-green-500"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">Nama Penyakit</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full border rounded-md px-3 py-2 mt-1 focus:ring focus:ring-green-300 focus:border-green-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Solusi</label>
          <textarea
            value={solusi}
            onChange={(e) => setSolusi(e.target.value)}
            className="w-full border rounded-md px-3 py-2 mt-1 focus:ring focus:ring-green-300 focus:border-green-500"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-200">
            Batal
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTambahPenyakit;
