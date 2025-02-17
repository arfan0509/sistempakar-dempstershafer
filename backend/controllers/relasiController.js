const RelasiPenyakitGejala = require("../models/RelasiPenyakitGejala");

// ✅ Tambah Relasi Penyakit - Gejala (Cek Duplikasi)
exports.tambahRelasi = async (req, res) => {
  try {
    const { id_penyakit, id_gejala, bobot } = req.body;

    if (bobot < 0 || bobot > 1) {
      return res.status(400).json({ message: "Bobot harus antara 0 dan 1" });
    }

    // 🔍 Cek apakah relasi sudah ada
    const existingRelasi = await RelasiPenyakitGejala.findOne({
      where: { id_penyakit, id_gejala },
    });

    if (existingRelasi) {
      return res
        .status(400)
        .json({ message: "Relasi penyakit dan gejala ini sudah ada" });
    }

    // ✅ Jika belum ada, tambahkan ke database
    const relasi = await RelasiPenyakitGejala.create({
      id_penyakit,
      id_gejala,
      bobot,
    });
    res.json({ message: "Relasi berhasil ditambahkan", relasi });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Ambil Semua Relasi Penyakit - Gejala
exports.getRelasi = async (req, res) => {
  try {
    const relasi = await RelasiPenyakitGejala.findAll();
    res.json(relasi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Bobot dalam Relasi Penyakit - Gejala
exports.updateRelasi = async (req, res) => {
  try {
    const { id } = req.params;
    const { bobot } = req.body;

    if (bobot < 0 || bobot > 1) {
      return res.status(400).json({ message: "Bobot harus antara 0 dan 1" });
    }

    const relasi = await RelasiPenyakitGejala.update(
      { bobot },
      { where: { id_relasi: id } }
    );

    if (relasi[0] === 1) {
      res.json({ message: "Bobot relasi berhasil diperbarui" });
    } else {
      res.status(404).json({ message: "Relasi tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Hapus Relasi Penyakit - Gejala
exports.hapusRelasi = async (req, res) => {
  try {
    const { id } = req.params;
    const relasi = await RelasiPenyakitGejala.destroy({
      where: { id_relasi: id },
    });

    if (relasi) {
      res.json({ message: "Relasi berhasil dihapus" });
    } else {
      res.status(404).json({ message: "Relasi tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
