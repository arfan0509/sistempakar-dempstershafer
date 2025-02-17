const Pasien = require("../models/Pasien");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerPasien = async (req, res) => {
  const { nama, alamat, no_telp, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await Pasien.create({ nama, alamat, no_telp, email, password: hashedPassword });
    res.json({ message: "Registrasi pasien berhasil" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginPasien = async (req, res) => {
  const { email, password } = req.body;

  try {
    const pasien = await Pasien.findOne({ where: { email } });
    if (!pasien) return res.status(400).json({ message: "Email tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, pasien.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah" });

    const token = jwt.sign({ id: pasien.id_pasien, email: pasien.email, role: "pasien" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login berhasil", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
