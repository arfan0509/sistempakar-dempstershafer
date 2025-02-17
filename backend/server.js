const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/database");

// Import Middleware & Routes
const adminRoutes = require("./routes/adminRoutes");
const pasienRoutes = require("./routes/pasienRoutes");
const profileRoutes = require("./routes/profileRoutes");
const diagnosisRoutes = require("./routes/diagnosisRoutes");
const penyakitRoutes = require("./routes/penyakitRoutes");
const gejalaRoutes = require("./routes/gejalaRoutes");
const relasiRoutes = require("./routes/relasiRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Gunakan Routes
app.use("/api/admin", adminRoutes);
app.use("/api/pasien", pasienRoutes);
app.use("/api", profileRoutes);
app.use("/api/diagnosis", diagnosisRoutes);
app.use("/api/penyakit", penyakitRoutes);
app.use("/api/gejala", gejalaRoutes);
app.use("/api/relasi", relasiRoutes);

// Jalankan Server
const PORT = process.env.PORT || 5000;
db.sync()
  .then(() => {
    console.log("Database Connected!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("Database Connection Error:", err));
