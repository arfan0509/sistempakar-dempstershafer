import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import NavbarComponent from "../../components/user/NavbarComponent";

const SistemPakarPage: React.FC = () => {
  const [gejalaList, setGejalaList] = useState<any[]>([]);
  const [penyakitList, setPenyakitList] = useState<any[]>([]);
  const [selectedGejala, setSelectedGejala] = useState<string[]>([]);
  const [hasilDiagnosa, setHasilDiagnosa] = useState<any>([]);
  const [showOtherPenyakit, setShowOtherPenyakit] = useState<boolean>(false);

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

  const handleDiagnosa = () => {
    if (selectedGejala.length === 0) {
      alert("Silakan pilih setidaknya satu gejala!");
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

    const sortedResults = Object.entries(hasil).sort(
      (a, b) => b[1].belief - a[1].belief
    );

    setHasilDiagnosa(sortedResults);
  };

  return (
    <>
      <NavbarComponent />
      <div className="container mx-auto pt-20">
        {/* ✅ Banner Tunggal */}
        <div className="relative w-full overflow-hidden rounded-lg shadow-lg mb-6">
          <img
            src={`/assets/banner-pakar.jpg`}
            alt="Banner Pakar"
            className="w-full object-cover h-40 sm:h-64 md:h-80 lg:h-[550px] transition duration-500"
          />
        </div>

        <p className="text-lg text-gray-700 mb-6 text-center">
          Selamat datang di <strong>Sistem Pakar Kucing!</strong> Pilih gejala
          yang sesuai untuk mendiagnosis masalah kesehatan pada kucing Anda.
        </p>

        {/* ✅ Pilihan Gejala */}
        <form onSubmit={(e) => e.preventDefault()} className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gejalaList.map((gejala, index) => (
              <label
                key={index}
                className="flex items-center p-3 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-50"
              >
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
                  className="w-5 h-5 rounded-full text-[#4F81C7] focus:ring-[#4F81C7]"
                />
                <span className="ml-3 text-gray-700 text-sm">
                  {gejala.kode} - {gejala.nama}
                </span>
              </label>
            ))}
          </div>

          <button
            onClick={handleDiagnosa}
            className="w-full py-3 mt-6 text-white bg-[#4F81C7] rounded-lg hover:bg-[#3e6b99] transition duration-300"
          >
            Diagnosa
          </button>
        </form>

        {/* 📋 Hasil Diagnosa */}
        {hasilDiagnosa.length > 0 && (
          <div className="hasil-diagnosa bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-[#4F81C7]">
              Hasil Diagnosa
            </h2>
            <div>
              <div className="mb-4">
                <strong className="text-lg">{hasilDiagnosa[0][0]}</strong>:{" "}
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

              {/* 🔄 Penyakit Lainnya */}
              <button
                className="text-blue-600 underline mb-4"
                onClick={() => setShowOtherPenyakit(!showOtherPenyakit)}
              >
                {showOtherPenyakit
                  ? "Sembunyikan Penyakit Lainnya"
                  : "Tampilkan Penyakit Lainnya"}
              </button>

              {showOtherPenyakit && (
                <div className="grid gap-4">
                  {hasilDiagnosa
                    .slice(1)
                    .map(([penyakitNama, { belief, gejalaCocok }]) => (
                      <div
                        key={penyakitNama}
                        className="bg-gray-50 p-4 rounded-lg shadow-sm"
                      >
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
    </>
  );
};

export default SistemPakarPage;
