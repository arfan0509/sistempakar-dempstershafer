const { DataTypes } = require("sequelize");
const db = require("../config/database");
const Pasien = require("./Pasien");

const Diagnosis = db.define(
  "diagnosis",
  {
    id_diagnosis: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_pasien: { type: DataTypes.INTEGER, allowNull: false, references: { model: Pasien, key: "id_pasien" } },
    nama_kucing: { type: DataTypes.STRING, allowNull: false },
    jenis_kelamin: { type: DataTypes.ENUM("Jantan", "Betina"), allowNull: false },
    usia: { type: DataTypes.STRING, allowNull: false }, // Ubah menjadi STRING karena bisa dalam bulan atau tahun
    warna_bulu: { type: DataTypes.STRING, allowNull: false },
    tanggal_diagnosis: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    hasil_diagnosis: { type: DataTypes.JSON, allowNull: false },
  },
  {
    tableName: "diagnosis",
    timestamps: false,
  }
);

module.exports = Diagnosis;
