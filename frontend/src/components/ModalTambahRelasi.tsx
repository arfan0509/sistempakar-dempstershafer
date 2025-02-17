import React, { useState } from "react";

const ModalTambahRelasi = ({ isOpen, onClose, onSave }) => {
  const [kodeGejala, setKodeGejala] = useState("");
  const [namaGejala, setNamaGejala] = useState("");
  const [relasi, setRelasi] = useState([{ kodePenyakit: "", namaPenyakit: "", bobot: "" }]);

  const handleAddRelasi = () => {
    setRelasi([...relasi, { kodePenyakit: "", namaPenyakit: "", bobot: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(kodeGejala, namaGejala, relasi);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tambah Relasi</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Kode Gejala" value={kodeGejala} onChange={(e) => setKodeGejala(e.target.value)} required />
          <input type="text" placeholder="Nama Gejala" value={namaGejala} onChange={(e) => setNamaGejala(e.target.value)} required />
          <button type="button" onClick={handleAddRelasi}>Tambah Penyakit</button>
          <button type="submit" className="bg-[#4F81C7] text-white px-4 py-2 rounded-md">Simpan</button>
        </form>
      </div>
    </div>
  );
};

export default ModalTambahRelasi;
