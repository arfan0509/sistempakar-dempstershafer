const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "Akses ditolak, token tidak ada" });

  const token = authHeader.split(" ")[1]; // Bearer token

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token tidak valid" });

    // Simpan data ke request sesuai role
    if (decoded.role === "admin") {
      req.admin = decoded;
    } else if (decoded.role === "pasien") {
      req.pasien = decoded;
    } else {
      return res.status(403).json({ message: "Role tidak valid" });
    }

    next();
  });
};

// ✅ Middleware Khusus untuk Admin
exports.adminOnly = (req, res, next) => {
  if (!req.admin) {
    return res.status(403).json({ message: "Akses hanya untuk admin" });
  }
  next();
};

// ✅ Middleware Khusus untuk Pasien
exports.pasienOnly = (req, res, next) => {
  if (!req.pasien) {
    return res.status(403).json({ message: "Akses hanya untuk pasien" });
  }
  next();
};
