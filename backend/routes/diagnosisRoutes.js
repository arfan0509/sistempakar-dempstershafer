const express = require("express");
const { tambahDiagnosis } = require("../controllers/diagnosisController");

const router = express.Router();

// ✅ Endpoint untuk menambah diagnosis
router.post("/tambah", tambahDiagnosis);

module.exports = router;
