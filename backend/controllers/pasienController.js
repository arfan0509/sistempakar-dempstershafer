const Pasien = require("../models/Pasien");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerPasien = async (req, res) => {
  const { nama, alamat, no_telp, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingPasien = await Pasien.findOne({ where: { email } });
    if (existingPasien) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    await Pasien.create({
      nama,
      alamat,
      no_telp,
      email,
      password: hashedPassword,
    });
    res.json({ message: "Registrasi pasien berhasil" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginPasien = async (req, res) => {
  const { email, password } = req.body;

  try {
    const pasien = await Pasien.findOne({ where: { email } });
    if (!pasien)
      return res.status(400).json({ message: "Email tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, pasien.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah" });

    // ✅ Access Token (1h)
    const accessToken = jwt.sign(
      { id: pasien.id_pasien, email: pasien.email, role: "pasien" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Refresh Token (7d)
    const refreshToken = jwt.sign(
      { id: pasien.id_pasien, email: pasien.email, role: "pasien" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login berhasil", accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
