const db = require("../config/database");
const Penyakit = require("./Penyakit");
const Gejala = require("./Gejala");
const RelasiPenyakitGejala = require("./RelasiPenyakitGejala");

// Inisialisasi asosiasi antar model
Penyakit.associate({ RelasiPenyakitGejala, Gejala });
Gejala.associate({ RelasiPenyakitGejala, Penyakit });
RelasiPenyakitGejala.associate({ Penyakit, Gejala });

module.exports = {
  db,  
  Penyakit,
  Gejala,
  RelasiPenyakitGejala,
};
