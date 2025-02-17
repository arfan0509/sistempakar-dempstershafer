const Diagnosis = require("../models/Diagnosis");

exports.tambahDiagnosis = async (req, res) => {
  const { id_pasien, nama_kucing, jenis_kelamin, usia, warna_bulu, hasil_diagnosis } = req.body;

  try {
    // Simpan data ke database
    await Diagnosis.create({
      id_pasien,
      nama_kucing,
      jenis_kelamin,
      usia,
      warna_bulu,
      hasil_diagnosis,
    });

    res.json({ message: "Diagnosis berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
