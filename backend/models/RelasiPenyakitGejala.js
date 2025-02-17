const { DataTypes } = require("sequelize");
const db = require("../config/database");
const Penyakit = require("./Penyakit");
const Gejala = require("./Gejala");

const RelasiPenyakitGejala = db.define(
  "relasi_penyakit_gejala",
  {
    id_relasi: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_penyakit: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      references: { model: Penyakit, key: "id_penyakit" }
    },
    id_gejala: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      references: { model: Gejala, key: "id_gejala" }
    },
    bobot: { type: DataTypes.DECIMAL(3,2), allowNull: false }, // ✅ Bobot pindah ke tabel ini
  },
  {
    tableName: "relasi_penyakit_gejala",
    timestamps: false,
  }
);

// Relasi Many-to-Many
Penyakit.belongsToMany(Gejala, {
  through: RelasiPenyakitGejala,
  foreignKey: "id_penyakit",
  otherKey: "id_gejala",
});

Gejala.belongsToMany(Penyakit, {
  through: RelasiPenyakitGejala,
  foreignKey: "id_gejala",
  otherKey: "id_penyakit",
});

module.exports = RelasiPenyakitGejala;
