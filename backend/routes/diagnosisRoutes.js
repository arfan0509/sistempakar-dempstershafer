const express = require("express");
const { verifyToken, pasienOnly, adminOnly } = require("../middleware/authMiddleware"); // Import middleware
const { tambahDiagnosis, getAllDiagnosis, getDiagnosisByPasienId, updateDiagnosis, deleteDiagnosis } = require("../controllers/diagnosisController");

const router = express.Router();

// ✅ Endpoint untuk menambah diagnosis (Hanya Pasien yang bisa mengakses)
router.post("/tambah", verifyToken, pasienOnly, tambahDiagnosis);

// ✅ Get Semua Diagnosis (Bisa diakses tanpa token)
router.get("/", getAllDiagnosis);

// ✅ Get Diagnosis berdasarkan ID Pasien (Bisa diakses tanpa token)
router.get("/diagnosis/:id_pasien", getDiagnosisByPasienId);

// ✅ Update Diagnosis (Hanya Admin yang bisa mengakses)
router.put("/diagnosis/:id", verifyToken, adminOnly, updateDiagnosis);

// ✅ Delete Diagnosis (Hanya Admin yang bisa mengakses)
router.delete("/diagnosis/:id", verifyToken, adminOnly, deleteDiagnosis);

module.exports = router;
