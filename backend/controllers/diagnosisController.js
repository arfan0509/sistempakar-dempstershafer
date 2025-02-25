const Diagnosis = require("../models/Diagnosis");

// ✅ Tambah Diagnosis (Create)
exports.tambahDiagnosis = async (req, res) => {
  const {
    id_pasien,
    nama_kucing,
    jenis_kelamin,
    usia,
    warna_bulu,
    hasil_diagnosis,
  } = req.body;

  try {
    // Simpan data ke database
    await Diagnosis.create({
      id_pasien,
      nama_kucing,
      jenis_kelamin,
      usia,
      warna_bulu,
      hasil_diagnosis, // Hasil diagnosis sudah dalam format objek JSON, tidak perlu JSON.stringify lagi
    });

    res.json({ message: "Diagnosis berhasil ditambahkan" });
  } catch (error) {
    console.error("Error saving diagnosis:", error);
    res.status(500).json({
      error: error.message,
      message: "Terjadi kesalahan saat menyimpan diagnosis. Silakan coba lagi.",
    });
  }
};

// ✅ Get Semua Diagnosis (Read All)
exports.getAllDiagnosis = async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findAll();
    res.json(diagnosis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Diagnosis berdasarkan ID Pasien (Read One)
exports.getDiagnosisByPasienId = async (req, res) => {
  const { id_pasien } = req.params;

  try {
    const diagnosis = await Diagnosis.findAll({ where: { id_pasien } });
    if (diagnosis.length === 0) {
      return res
        .status(404)
        .json({ message: "Diagnosis tidak ditemukan untuk pasien ini" });
    }
    res.json(diagnosis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Diagnosis (Update)
exports.updateDiagnosis = async (req, res) => {
  const { id } = req.params;
  const { nama_kucing, jenis_kelamin, usia, warna_bulu, hasil_diagnosis } =
    req.body;

  try {
    const diagnosis = await Diagnosis.findByPk(id);

    if (!diagnosis) {
      return res.status(404).json({ message: "Diagnosis tidak ditemukan" });
    }

    // Update data diagnosis
    await diagnosis.update({
      nama_kucing,
      jenis_kelamin,
      usia,
      warna_bulu,
      hasil_diagnosis,
    });

    res.json({ message: "Diagnosis berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Diagnosis (Delete)
exports.deleteDiagnosis = async (req, res) => {
  const { id } = req.params;

  try {
    const diagnosis = await Diagnosis.findByPk(id);

    if (!diagnosis) {
      return res.status(404).json({ message: "Diagnosis tidak ditemukan" });
    }

    // Hapus data diagnosis
    await diagnosis.destroy();
    res.json({ message: "Diagnosis berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
