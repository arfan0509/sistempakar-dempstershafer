const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Gejala = db.define(
  "gejala",
  {
    id_gejala: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    kode_gejala: { type: DataTypes.STRING(10), allowNull: false, unique: true }, // ✅ Kode gejala
    nama_gejala: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  {
    tableName: "gejala",
    timestamps: false,
  }
);

module.exports = Gejala;
