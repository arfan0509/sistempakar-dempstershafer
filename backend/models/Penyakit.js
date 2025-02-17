const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Penyakit = db.define(
  "penyakit",
  {
    id_penyakit: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    kode_penyakit: { type: DataTypes.STRING(10), allowNull: false, unique: true }, // ✅ Kode penyakit
    nama_penyakit: { type: DataTypes.STRING, allowNull: false, unique: true },
    deskripsi: { type: DataTypes.TEXT, allowNull: false },
    solusi: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    tableName: "penyakit",
    timestamps: false,
  }
);

module.exports = Penyakit;
