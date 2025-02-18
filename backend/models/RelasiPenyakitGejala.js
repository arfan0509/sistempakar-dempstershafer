const { DataTypes } = require("sequelize");
const db = require("../config/database");

const RelasiPenyakitGejala = db.define(
  "relasi_penyakit_gejala",
  {
    id_relasi: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_penyakit: { type: DataTypes.INTEGER, allowNull: false },
    id_gejala: { type: DataTypes.INTEGER, allowNull: false },
    bobot: { type: DataTypes.DECIMAL(3, 2), allowNull: false },
  },
  {
    tableName: "relasi_penyakit_gejala",
    timestamps: false,
  }
);

// Menambahkan asosiasi dengan CASCADE
RelasiPenyakitGejala.associate = (models) => {
  RelasiPenyakitGejala.belongsTo(models.Penyakit, {
    foreignKey: "id_penyakit",
    onDelete: "CASCADE", // Menambahkan CASCADE
  });
  RelasiPenyakitGejala.belongsTo(models.Gejala, {
    foreignKey: "id_gejala",
    onDelete: "CASCADE", // Menambahkan CASCADE
  });
};

module.exports = RelasiPenyakitGejala;
