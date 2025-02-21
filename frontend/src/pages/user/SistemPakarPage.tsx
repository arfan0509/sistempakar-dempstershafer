/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const SistemPakarPage: React.FC = () => {
  const [gejalaList, setGejalaList] = useState<any[]>([]);
  const [penyakitList, setPenyakitList] = useState<any[]>([]);
  const [selectedGejala, setSelectedGejala] = useState<string[]>([]);
  const [hasilDiagnosa, setHasilDiagnosa] = useState<string>("");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Ambil data penyakit dan gejala dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/relasi");
        const data = response.data;

        const gejalaMap: any = {};
        const penyakitMap: any = {};

        // Memetakan gejala dan penyakit berdasarkan data relasi
        data.forEach((item: any) => {
          gejalaMap[item.gejala.kode_gejala] = {
            nama: item.gejala.nama_gejala,
            bobot: parseFloat(item.gejala.bobot),
            kode: item.gejala.kode_gejala,
          };

          penyakitMap[item.penyakit.kode_penyakit] = {
            nama: item.penyakit.nama_penyakit,
            deskripsi: item.penyakit.deskripsi,
            solusi: item.penyakit.solusi,
          };
        });

        // Mengonversi objek penyakitMap menjadi array
        const penyakitArray = Object.values(penyakitMap);

        // Menyimpan gejala dan penyakit dalam state
        setGejalaList(Object.values(gejalaMap));
        setPenyakitList(penyakitArray); // Pastikan ini menjadi array
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();

    // Auto slide banner every 5 seconds
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  // Fungsi untuk menghitung hasil diagnosa
  const handleDiagnosa = () => {
    if (selectedGejala.length === 0) {
      alert("Silakan pilih setidaknya satu gejala untuk melakukan diagnosa!");
      return;
    }

    let hasil: any = {};
    let totalBelief = 0;

    // Menghitung belief untuk setiap penyakit
    penyakitList.forEach((penyakit) => {
      let belief = 0;
      let gejalaCocok: string[] = [];

      // Memeriksa gejala yang cocok dengan penyakit
      gejalaList.forEach((gejala) => {
        if (selectedGejala.includes(gejala.kode)) {
          belief += gejala.bobot;
          gejalaCocok.push(gejala.nama);
        }
      });

      if (belief > 0) {
        hasil[penyakit.nama] = belief;
        totalBelief += belief;
      }
    });

    // Normalisasi ke persentase
    if (totalBelief > 0) {
      Object.keys(hasil).forEach((penyakitNama) => {
        hasil[penyakitNama] = (hasil[penyakitNama] / totalBelief) * 100;
      });
    }

    // Urutkan hasil diagnosa berdasarkan prosentase
    const sortedResults = Object.entries(hasil).sort((a, b) => b[1] - a[1]);

    // Tampilkan hasil diagnosa dengan gejala yang sesuai
    const result = sortedResults.map(
      ([penyakitNama, percentage]) => {
        const penyakit = penyakitList.find(p => p.nama === penyakitNama);
        return `
          <div>
            <strong>${penyakit?.nama}</strong>: ${percentage.toFixed(2)}%
            <p><strong>Deskripsi:</strong> ${penyakit?.deskripsi}</p>
            <p><strong>Solusi:</strong> ${penyakit?.solusi}</p>
          </div>
        `;
      }
    ).join("");

    setHasilDiagnosa(result);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Banner Auto Slide */}
      <div className="relative h-64 overflow-hidden rounded-lg mb-8">
        <div
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            currentSlide === 0 ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src="/assets/kucing1.jpg"
            alt="Banner Kucing 1"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            currentSlide === 1 ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src="/assets/kucing2.jpg"
            alt="Banner Kucing 2"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center mb-6">Sistem Pakar Kucing</h1>

      <p className="text-lg text-gray-700 mb-6">
        Selamat datang di Sistem Pakar Kucing! Sistem ini dapat membantu Anda
        mendiagnosis masalah kesehatan pada kucing Anda berdasarkan gejala yang
        terlihat. Pilih gejala yang terlihat pada kucing Anda untuk mendapatkan
        diagnosis.
      </p>

      {/* Pilihan Gejala */}
      <form onSubmit={(e) => e.preventDefault()} className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gejalaList.map((gejala, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                value={gejala.kode}
                onChange={(e) => {
                  const { checked, value } = e.target;
                  if (checked) {
                    setSelectedGejala((prev) => [...prev, value]);
                  } else {
                    setSelectedGejala((prev) =>
                      prev.filter((gejala) => gejala !== value)
                    );
                  }
                }}
                className="mr-2"
              />
              <label className="text-gray-700 text-sm">
                {gejala.kode} - {gejala.nama}
              </label>
            </div>
          ))}
        </div>

        <button
          onClick={handleDiagnosa}
          className="w-full py-3 mt-4 text-white bg-[#4F81C7] rounded-lg hover:bg-[#3e6b99] transition duration-300"
        >
          Diagnosa
        </button>
      </form>

      {/* Hasil Diagnosa */}
      {hasilDiagnosa && (
        <div className="hasil-diagnosa bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Hasil Diagnosa</h2>
          <div dangerouslySetInnerHTML={{ __html: hasilDiagnosa }} />
        </div>
      )}
    </div>
  );
};

export default SistemPakarPage;
