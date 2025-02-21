import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const SistemPakarPage: React.FC = () => {
  const [gejalaList, setGejalaList] = useState<any[]>([]);
  const [penyakitList, setPenyakitList] = useState<any[]>([]);
  const [selectedGejala, setSelectedGejala] = useState<string[]>([]);
  const [hasilDiagnosa, setHasilDiagnosa] = useState<any>([]); // Simpan hasil dalam bentuk array untuk manipulasi
  const [showOtherPenyakit, setShowOtherPenyakit] = useState<boolean>(false); // State untuk mengontrol tampilan penyakit lainnya

  // Ambil data penyakit dan gejala dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/relasi");
        const data = response.data;

        const gejalaMap: any = {};
        const penyakitMap: any = {};

        data.forEach((item: any) => {
          gejalaMap[item.gejala.kode_gejala] = {
            nama: item.gejala.nama_gejala,
            bobot: parseFloat(item.gejala.bobot),
            kode: item.gejala.kode_gejala,
          };

          if (!penyakitMap[item.penyakit.kode_penyakit]) {
            penyakitMap[item.penyakit.kode_penyakit] = {
              nama: item.penyakit.nama_penyakit,
              deskripsi: item.penyakit.deskripsi,
              solusi: item.penyakit.solusi,
              gejala: [],
            };
          }

          penyakitMap[item.penyakit.kode_penyakit].gejala.push(
            item.gejala.kode_gejala
          );
        });

        setGejalaList(Object.values(gejalaMap));
        setPenyakitList(Object.values(penyakitMap));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Fungsi untuk menghitung hasil diagnosa
  const handleDiagnosa = () => {
    if (selectedGejala.length === 0) {
      alert("Silakan pilih setidaknya satu gejala untuk melakukan diagnosa!");
      return;
    }

    let hasil: any = {};
    let totalBelief = 0;

    penyakitList.forEach((penyakit) => {
      let belief = 0;
      let gejalaCocok: string[] = [];

      penyakit.gejala.forEach((gejalaKode: string) => {
        const gejala = gejalaList.find((g) => g.kode === gejalaKode);
        if (gejala && selectedGejala.includes(gejala.kode)) {
          belief += gejala.bobot;
          gejalaCocok.push(gejala.nama);
        }
      });

      if (belief > 0) {
        hasil[penyakit.nama] = { belief, gejalaCocok };
        totalBelief += belief;
      }
    });

    if (totalBelief > 0) {
      Object.keys(hasil).forEach((penyakitNama) => {
        hasil[penyakitNama].belief =
          (hasil[penyakitNama].belief / totalBelief) * 100;
      });
    }

    // Urutkan hasil diagnosa berdasarkan prosentase
    const sortedResults = Object.entries(hasil).sort(
      (a, b) => b[1].belief - a[1].belief
    );

    // Tampilkan hasil diagnosa
    setHasilDiagnosa(sortedResults);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Sistem Pakar Kucing
      </h1>

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
      {hasilDiagnosa.length > 0 && (
        <div className="hasil-diagnosa bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Hasil Diagnosa</h2>
          <div>
            {/* Penyakit dengan persentase terbesar */}
            <div className="mb-4">
              <strong>{hasilDiagnosa[0][0]}</strong>:{" "}
              {hasilDiagnosa[0][1].belief.toFixed(2)}%
              <p>
                <strong>Deskripsi:</strong>{" "}
                {
                  penyakitList.find((p) => p.nama === hasilDiagnosa[0][0])
                    ?.deskripsi
                }
              </p>
              <p>
                <strong>Solusi:</strong>{" "}
                {
                  penyakitList.find((p) => p.nama === hasilDiagnosa[0][0])
                    ?.solusi
                }
              </p>
              <p>
                <strong>Gejala terdeteksi:</strong>{" "}
                {hasilDiagnosa[0][1].gejalaCocok.join(", ")}
              </p>
            </div>

            {/* Penyakit lainnya */}
            <button
              className="text-blue-600"
              onClick={() => setShowOtherPenyakit(!showOtherPenyakit)}
            >
              {showOtherPenyakit
                ? "Sembunyikan Penyakit Lainnya"
                : "Tampilkan Penyakit Lainnya"}
            </button>

            {showOtherPenyakit && (
              <div>
                {hasilDiagnosa
                  .slice(1)
                  .map(([penyakitNama, { belief, gejalaCocok }]) => (
                    <div key={penyakitNama} className="mt-4">
                      <strong>{penyakitNama}</strong>: {belief.toFixed(2)}%
                      <p>
                        <strong>Deskripsi:</strong>{" "}
                        {
                          penyakitList.find((p) => p.nama === penyakitNama)
                            ?.deskripsi
                        }
                      </p>
                      <p>
                        <strong>Solusi:</strong>{" "}
                        {
                          penyakitList.find((p) => p.nama === penyakitNama)
                            ?.solusi
                        }
                      </p>
                      <p>
                        <strong>Gejala terdeteksi:</strong>{" "}
                        {gejalaCocok.join(", ")}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SistemPakarPage;
