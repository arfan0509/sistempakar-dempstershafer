import React, { useState, useEffect } from "react";
import axios from "axios";

const SistemPakarPage: React.FC = () => {
  const [gejala, setGejala] = useState<string[]>([]);
  const [penyakitList, setPenyakitList] = useState<any[]>([]);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [gejalaWithBobot, setGejalaWithBobot] = useState<any[]>([]);
  const [relasiGejala, setRelasiGejala] = useState<any[]>([]);

  // Ambil data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const gejalaResponse = await axios.get("http://localhost:5000/api/gejala");
        const relasiResponse = await axios.get("http://localhost:5000/api/relasi");
        const penyakitResponse = await axios.get("http://localhost:5000/api/penyakit");

        const gejalaData = gejalaResponse.data;
        const relasiData = relasiResponse.data;
        const penyakitData = penyakitResponse.data;

        const penyakitWithGejala = penyakitData.map((penyakit: any) => {
          const gejalaTerkait = relasiData
            .filter((relasi: any) => relasi.id_penyakit === penyakit.id_penyakit)
            .map((relasi: any) => ({
              ...relasi,
              nama_gejala: gejalaData.find((g: any) => g.id_gejala === relasi.id_gejala)?.nama_gejala,
              bobot: relasi.bobot,
            }));

          return {
            ...penyakit,
            gejala: gejalaTerkait,
          };
        });

        setPenyakitList(penyakitWithGejala);
        setGejalaWithBobot(gejalaData);
        setRelasiGejala(relasiData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle perubahan checkbox gejala yang dipilih
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setGejala((prevGejala) => [...prevGejala, value]);
    } else {
      setGejala((prevGejala) => prevGejala.filter((item) => item !== value));
    }
  };

  // Fungsi untuk melakukan diagnosa berdasarkan gejala yang dipilih
  const handleDiagnosa = () => {
    if (gejala.length === 0) {
      setDiagnosis("Silakan pilih gejala terlebih dahulu.");
      return;
    }

    const gejalaDenganBobot = gejala.map((item) => {
      const gejalaItem = gejalaWithBobot.find((g: any) => g.nama_gejala === item);
      return { nama_gejala: item, bobot: gejalaItem?.bobot };
    });

    let hasil: any = {};
    let totalBelief = 0;

    // Menghitung belief untuk setiap penyakit berdasarkan gejala yang dipilih
    penyakitList.forEach((penyakit) => {
      let belief = 0;
      penyakit.gejala.forEach((relasi: any) => {
        if (gejala.includes(relasi.nama_gejala)) {
          belief += relasi.bobot;
        }
      });

      if (belief > 0) {
        hasil[penyakit.nama_penyakit] = belief;
        totalBelief += belief;
      }
    });

    // Normalisasi hasil belief ke dalam persen
    if (totalBelief > 0) {
      Object.keys(hasil).forEach((penyakit) => {
        hasil[penyakit] = (hasil[penyakit] / totalBelief) * 100;
      });

      const sortedResults = Object.entries(hasil).sort((a, b) => b[1] - a[1]);
      
      setDiagnosis(
        sortedResults
          .map(([penyakit, belief]) => `${penyakit}: ${belief.toFixed(2)}%`)
          .join("\n")
      );
    } else {
      setDiagnosis("Tidak ada penyakit yang terdeteksi dengan gejala yang dipilih.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-8">
        Sistem Pakar Identifikasi Penyakit Kucing
      </h1>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Pilih Gejala Kucing Anda:</h2>
        <div className="space-y-4">
          {penyakitList.length > 0 ? (
            penyakitList[0].gejala.map((item: any) => (
              <label key={item.id_gejala} className="block">
                <input
                  type="checkbox"
                  value={item.nama_gejala}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                {item.nama_gejala} ({item.bobot})
              </label>
            ))
          ) : (
            <p>Loading gejala...</p>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleDiagnosa}
            className="px-6 py-2 bg-[#4F81C7] text-white rounded-lg hover:bg-[#3e6b99] transition duration-300"
          >
            Diagnosa Kucing
          </button>
        </div>

        {diagnosis && (
          <div className="mt-6 text-center">
            <h3 className="text-xl font-semibold">Hasil Diagnosis:</h3>
            <p className="text-lg mt-2">{diagnosis}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SistemPakarPage;
