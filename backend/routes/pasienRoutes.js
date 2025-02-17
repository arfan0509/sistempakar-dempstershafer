const express = require("express");
const { registerPasien, loginPasien } = require("../controllers/pasienController");

const router = express.Router();
router.post("/register", registerPasien);
router.post("/login", loginPasien);

module.exports = router;
