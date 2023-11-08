// requiring dependencies
const moment = require("moment");
const axios = require("axios").default;
const { MessageMedia } = require("whatsapp-web.js");
const db = require("./db_config");
const mis = require("./mis");

//pool on connect
db.on("connection", (connection) => console.log("CONNECTION USING POOL"));

// inisiasi pesan masuk
const getData = (message) => {
  let keyword = message.split("#");
  let pengadilan = "Pengadilan Negeri Negara";
  let web = "https://pn-negara.go.id";
  return new Promise((resolve, reject) => {
    // mulai logic pesan
    if (keyword[0] == "halo") {
      let responseMessage = `Halo sobat *${pengadilan}*. Sekarang kami menyediakan beberapa informasi yang bisa Bapak/Ibu akses. Silahkan balas pesan ini dengan mengetik
*- Perkara*
_Untuk salinan putusan (bukan salinan resmi), detail biaya perkara, informasi jadwal sidang dan tilang pada *${pengadilan}*_
*- Layanan*
_Untuk informasi Pelayanan Terpadu Satu Pintu pada *${pengadilan}*_
*- Ecourt*
_Untuk informasi berperkara secara elektronik pada *${pengadilan}*_
*- Pengaduan*
_Untuk informasi mengenai tata cara pengaduan pada *${pengadilan}*_
*- Survei*
_Untuk informasi mengenai survei elektronik pada *${pengadilan}*_
*- Sidang hari ini*
_Untuk informasi jadwal sidang pada hari yang bersangkutan_
*- Sidang tanggal*
_Untuk informasi jadwal sidang pada tanggal tertentu (contoh : sidang tanggal#20-12-2021)_
*- Statistik*
_Untuk informasi statistik perkara pada ${pengadilan} (contoh : statistik#2021)_
*- Covid*
_Untuk informasi Covid di Indonesia_
`;
      resolve(responseMessage);
    } else if (keyword[0] == "layanan") {
      let responseMessage = `Silahkan balas pesan ini dengan mengetikkan layanan yang anda inginkan :
      *- Pidana*
      *- Perdata*
      *- Hukum*`;

      resolve(responseMessage);
    } else if (keyword[0] == "pidana") {
      let responseMessage = `Silahkan ketik layanan pidana yang anda inginkan :
      *- Pelimpahan_biasa*
      *- Pelimpahan_tipiring*
      *- Perpanjangan_penahanan*
      *- Penetapan_diversi*`;

      resolve(responseMessage);
    } else if (keyword[0] == "pelimpahan_biasa") {
      let responseMessage = `Persyaratan pelimpahan berkas perkara pidana biasa adalah :
      1. Surat Pengantar
      2. Berkas Perkara Penyidik
      3. Surat Dakwaan/Soft Copy Dakwaan 
      4. Penetapan Penahanan
      5. Barang Bukti beserta Surat Pelimpahan Barang Bukti dan  Soft Copy`;

      resolve(responseMessage);
    } else if (keyword[0] == "pelimpahan_tipiring") {
      let responseMessage = `Persyaratan pelimpahan berkas perkara pidana biasa adalah :
      1. Surat Pengantar
      2. Berkas Perkara Penyidik
      3. Surat Dakwaan/Soft Copy Dakwaan 
      4. Barang Bukti
      5. Saat persidangan menghadirkan minimal satu orang saksi`;

      resolve(responseMessage);
    } else if (keyword[0] == "perpanjangan_penahanan") {
      let responseMessage = `Persyaratan permohonan perpanjangan penahanan adalah :
      1. Surat Permohonan
      2. Surat Perintah Penahanan
      3. Berita Acara Penahanan 
      4. Surat perpanjangan penahanan dari Kejaksaan`;

      resolve(responseMessage);
    } else if (keyword[0] == "penetapan_diversi") {
      let responseMessage = `Persyaratan permohonan penetapan diversi adalah :
      1. Surat Permohonan
      2. Laporan Polisis
      3. Kesepakatan Diversi 
      4. Berita Acara
      5. Surat Perintah dimulainya penyidikan
      6. Surat Perintah Penyidikan
      7. Surat Tanda Terima
      8. Resume `;

      resolve(responseMessage);
    } else if (keyword[0] == "sita_geledah") {
      let responseMessage = `Persyaratan permohonan penetapan peyitaan/penggeledahan adalah :
      1. Surat Pengantar
      2.Surat Laporan Polisis
      3. Surat Perintah Penyitaan/Penggeledahan 
      4. Berita Acara Penyitaan atau Penggeledahan
      5. Surat Perintah dimulainya penyidikan
      6. Surat Perintah Penyidikan
      7. Surat Tanda Penyitaan/Penggeledahan
      8. Soft Copy BB`;

      resolve(responseMessage);
    } else if (keyword[0] == "hukum") {
      let responseMessage = `Silahkan ketik layanan hukum yang anda inginkan :
      *- Badan_hukum*
      *- Surat_kuasa*
      *- Waarmeking*
      *- Kuasa_insidentil*
      *- Ijin_penelitian*
      *- Mediator*
      *- Surat_keterangan*
      *- Legalisir*
      *- Salinan_putusan*
      *- Informasi*
      *- Pengaduan*`;

      resolve(responseMessage);
    } else if (keyword[0] == "badan_hukum") {
      let responseMessage = `Persyaratan permohonan pendaftaran badan hukum adalah :
      1. Asli dan fotokopi akta pendirian badan hukum
      2. Fotokopi NPWP badan hukum
      3. Fotokopi KTP Pengurus 
      4. Materai Rp.10.000,-`;

      resolve(responseMessage);
    } else if (keyword[0] == "surat_kuasa") {
      let responseMessage = `Persyaratan  pendaftaran surat kuasa khusus adalah :
      1. Asli dan salinan surat kuasa khusus
      2. Fotokopi kartu advokat
      3. Fotokopi berita acara sumpah advokat 
      4. Fotokopi KTP,-
      5. Materai Rp.10.000,-`;

      resolve(responseMessage);
    } else if (keyword[0] == "waarmeking") {
      let responseMessage = `Persyaratan  permohonan legalisasi akta dibawah tangan/waarmeking adalah : 
      1. Surat permohonan 
      2.Fotokopi masing-masing ahli waris 
      3. Fotokopi Kartu Keluarga  
      4. Fotokopi buku tabungan atau objek waarmeking 
      5. Surat Keterangan Waris 
      6. Fotocopy Akta/Surat keterangan Kematian  
      7. Fotokopi akta kelahiran masing-masing ahli waris 
      8. Materai Rp.10.000,-`;

      resolve(responseMessage);
    } else if (keyword[0] == "kuasa_insidentil") {
      let responseMessage = `Persyaratan  permohonan ijin kuasa insidentil adalah :
      1. Surat permohonan
      2. Surat Keterangan Kepala Desa
      3. Fotocopy KTP pemberi kuasa
      4. Fotokopi KTP penerima kuasa
      5. Materai Rp.10.000,-`;

      resolve(responseMessage);
    } else if (keyword[0] == "ijin_penelitian") {
      let responseMessage = `Persyaratan  permohonan ijin penelitian adalah :
      1. Surat permohonan
      2. Fotocopy KTP
      3. Surat pengantar universitas/instansi
      4. Proposal`;

      resolve(responseMessage);
    } else if (keyword[0] == "mediator") {
      let responseMessage = `Persyaratan  permohonan penempatan dalam daftar mediator adalah :
      1. Salinan sah sertifikat mediator
      2. Salinan sah ijazah terakhi
      3. Pas foto berwarna 4x6 latar merah
      4. Daftar riwayat hidup (minimal memuat latar belakang pendidikan dan/atau pengalaman)`;

      resolve(responseMessage);
    } else if (keyword[0] == "surat_keterangan") {
      let responseMessage = `Persyaratan  permohonan surat keterangan dalam hal :
1.Tidak pernah sebagai terpidana
2.Tidak sedang dicabut hak pilihnya
3.Dipidana karena kealpaan ringan atau alasan politik
4.Tidak memiliki tanggungan utang secara perorangan dan/atau secara badan hukum yang menjadi tanggung jawabnya yang merugikan keuangan negara adalah : 
1. Surat Permohona
2. Fotokopi SKCK (dilegalisir
3. Fotokopi KTP (Dilegalisir) .   
4. Surat keterangan tidak pernah tersangkut perkara dan tidak pernah dicabut hak pilihnya dari Kantor Desa/Lurah .   
5. Surat pernyataan tidak pernah terpidana dan tidak pernah dicabut hak pilihny 6. Foto berwarna 4x
7. PNBP Rp. 10.000,-
Juga dapat diakses melalui https://eraterang.badilum.mahkamahgung.go.id`;

      resolve(responseMessage);
    } else if (keyword[0] == "legalisir") {
      let responseMessage = `Persyaratan  untuk permohonan legalisir surat  adalah :
      1. Surat Permohonan
      2. Fotokopi KTP (Dilegalisir)
      3. Asli surat yang dilegalisir`;

      resolve(responseMessage);
    } else if (keyword[0] == "salinan_putusan") {
      let responseMessage = `Persyaratan  untuk permohonan salinan putusan BHT  adalah :
      1. Surat Permohonan
      2. Fotokopi KTP
      3. PNBP Rp 500,- dikalikan jml lembar dan PNBP Penyerahan sebesar Rp.10.000,-`;

      resolve(responseMessage);
    } else if (keyword[0] == "informasi") {
      let responseMessage = `Permohonan informasi pada ${pengadilan} dapat diperoleh melalui website resmi ${pengadilan} di ${web} atau dengan datang langsung ke meja informasi ${pengadilan}`;

      resolve(responseMessage);
    } else if (keyword[0] == "pengaduan") {
      let responseMessage = `Masyarakat dapat melaporkan indikasi pelanggaran yang terjadi di lingkungan ${pengadilan}, namun bukan pengaduan terkait masalah perkara ke https://siwas.mahkamahagung.go.id`;

      resolve(responseMessage);
    } else if (keyword[0] == "perdata") {
      let responseMessage = `Silahkan ketik layanan perdata yang anda inginkan :
      *- Pengajuan_gugatan*
      *- Pengajuan_permohonan*
      *- Gugatan_sederhana*
      *- Eksekusi*
      *- Konsinyasi*`;

      resolve(responseMessage);
    } else if (keyword[0] == "pengajuan_gugatan") {
      let responseMessage = `Persyaratan  untuk pengajuan gugatan  adalah :
      1. Surat gugatan
      2. Surat kuasa apabila dikuasakan  .
      3. KTP Kuasa (apabila dikuasakan Kuasa)
      4. Berita Acara Sumpah Advokat (apabila dikuasakan Kuasa)
      'Dan sekarang masyarakat dapat menggunakan ecourt untuk mendaftarkan perkara perdata di alamat https://ecourt.mahkamahagung.go.id`;

      resolve(responseMessage);
    } else if (keyword[0] == "pengajuan_permohonan") {
      let responseMessage = `Persyaratan  untuk pengajuan permohonan  adalah :
      1. Surat permohonan
      2. Surat kuasa apabila dikuasakan
      3. KTP Kuasa (apabila dikuasakan Kuasa)
      3. Berita Acara Sumpah Advokat (apabila dikuasakan Kuasa)
      Dan sekarang masyarakat dapat menggunakan ecourt untuk mendaftarkan perkara perdata di alamat https://ecourt.mahkamahagung.go.id`;

      resolve(responseMessage);
    } else if (keyword[0] == "gugatan_sederhana") {
      let responseMessage = `Persyaratan  untuk pengajuan gugatan sederhana  adalah :
      1. Surat gugatan
      2. Bukti surat yang telah dilegalisir di kantor pos
      Dan sekarang masyarakat dapat menggunakan ecourt untuk mendaftarkan perkara perdata di alamat https://ecourt.mahkamahagung.go.id`;

      resolve(responseMessage);
    } else if (keyword[0] == "eksekusi") {
      let responseMessage = `Silahkan ketik jenis eksekusi :
      *- Eksekusi_putusan*
      *- Eksekusi_akta_perdamaian*
      *- Eksekusi_serta_merta*
      *- Eksekusi_provisi*
      *- Eksekusi_lanjutan*
      *- Eksekusi_lelang*
      *- Eksekusi_kep_umum*`;

      resolve(responseMessage);
    } else if (keyword[0] == "eksekusi_putusan") {
      let responseMessage = `Persyaratan  untuk pengajuan eksekusi terhadap putusan pengadilan  adalah :
      1. Permohonan
      2. Surat kuasa khusus apabila dikuasakan
      3. FC salinan putusan
      4. Relaas pemberitahuan putusan
      5. Surat pernyataan yang menyatakan bahwa obyek eksekusi tidak terkait perkara lain
      6. Surat-surat lainnya yang dipandang perlu`;

      resolve(responseMessage);
    } else if (keyword[0] == "eksekusi_akta_perdamaian") {
      let responseMessage = `Persyaratan  untuk pengajuan eksekusi terhadap akta perdamaian adalah : 
      1. Permohonan
      2. Surat kuasa khusus apabila dikuasakan
      3. FC Akta perdamaian`;

      resolve(responseMessage);
    } else if (keyword[0] == "eksekusi_serta_merta") {
      let responseMessage = `Persyaratan  untuk pengajuan eksekusi terhadap putusan serta merta  adalah :
      1. Permohonan
      2. Surat kuasa khusus apabila dikuasakan
      3. FC salinan putusan serta merta
      4. Fotokopi akta otentik
      5. Jaminan/uang yang disimpan di bank`;

      resolve(responseMessage);
    } else if (keyword[0] == "eksekusi_provisi") {
      let responseMessage = `Persyaratan  untuk pengajuan eksekusi terhadap putusan provisi  adalah :
      1. Permohonan
      2. Surat kuasa khusus apabila dikuasakan
      3. FC salinan putusan provisi
      4. Akta otentik
      5. Jaminan pelaksanaan eksekusi provisi
      6. Surat-surat lainnya yang dipandang perlu`;

      resolve(responseMessage);
    } else if (keyword[0] == "eksekusi_lanjutan") {
      let responseMessage = `Persyaratan  untuk pengajuan eksekusi lanjutan  adalah :
      1. Permohonan
      2. Surat kuasa khusus apabila dikuasakan
      3. FC BA Eksekusi pertama`;

      resolve(responseMessage);
    } else if (keyword[0] == "eksekusi_lelang") {
      let responseMessage = `Persyaratan  untuk pengajuan eksekusi lelang adalah :
      1. Permohonan
      2. Surat kuasa khusus apabila dikuasakan
      3. FC SHM (IMB bila ada)
      4. Fotokopi sertifikat HT dan APHT
      5. Fotokopi SKMHT
      6. Fotokopi surat peringatan kepada debitur
      7. Fotokopi pembukuan bank mengenai jml utang debitur
      8. Fotokopi surat peringatan kepada debitur
      9. Permohonan penunnjukan apraisal atau penilai publik atas aset
      10. Surat-surat lainnya yang dipandang perlu`;

      resolve(responseMessage);
    } else if (keyword[0] == "eksekusi_kep_umum") {
      let responseMessage = `Persyaratan  pengosongan tanah untuk kepentingan umum  adalah :
      1. Permohonan
      2. Surat penetapan konsinyasi
      3. BA Konsinyasi
      4. Dokumen obyek eksekusi
      5. Surat pelepasa hak dari BPN
      6. Surat-surat lainnya yang dipandang perlu`;

      resolve(responseMessage);
    } else if (keyword[0] == "konsinyasi") {
      let responseMessage = `Persyaratan pencairan konsinyasi  adalah :
      1. Permohonan
      2. Surat kuasa khusus
      3. FC Salinan penetapan KPN tentang uang konsinyasi
      4. Surat pengantar dari ketua pelaksana pengadaan tanah
      5. Surat-surat lainnya yang dipandang perlu`;

      resolve(responseMessage);
    } else if (keyword[0] == "ecourt") {
      let responseMessage = `court Adalah layanan bagi Pengguna Terdaftar dan Pengguna Lain untuk Pendaftaran Perkara Secara Online, Mendapatkan Taksiran Panjar Biaya Perkara secara online, Pembayaran secara online, Pemanggilan yang dilakukan dengan saluran elektronik, dan Persidangan yang dilakukan secara Elektronik. Untuk memulai silahkan kunjungi https://ecourt.mahkamahagung.go.id`;

      resolve(responseMessage);
    } else if (keyword[0] == "eraterang") {
      let responseMessage = `ERATERANG adalah layanan Permohonan Surat keterangan secara Elektronik yang dapat diakses oleh pemohon dimanapun ia berada (selama ada akses internet via HP/Gawai dan Komputer/PC). Untuk memulai silahkan kunjungi https://eraterang.badilum.mahkamahagung.go.id`;

      resolve(responseMessage);
    } else if (keyword[0] == "survei") {
      let responseMessage = `Untuk mengevaluasi kinerja pelayanan pada *Pengadilan Negeri *****, kami telah menyediakan sarana survei elektronik yang bisa Bapak/Ibu akses di  http://esurvey.badilum.mahkamahagung.go.id/index.php/pengadilan/******`;

      resolve(responseMessage);
    } else if (keyword[0] == "perkara") {
      let responseMessage = `Untuk mendapatkan salinan putusan yang bukan salinan resmi (SK-KMA 1-144/KMA/SK/I/2011) silahkan ketikkan : 
      *Putusan#nomor perkara*. _Contoh : Putusan#123/Pdt.G/2021/PN Bli_ 
      Untuk mengetahui rincian biaya perkara silahkan ketikkan : 
      *Biaya#nomor perkara*. _Contoh : Biaya#123/Pdt.G/2021/PN Bli_ 
      Untuk mengetahui jadwal sidang silahkan ketikkan : 
      *Jadwal_sidang#nomor perkara*. _Contoh : Jadwal_sidang#123/Pdt.G/2021/PN Bli_ 
      Untuk mengetahui informasi denda tilang silahkan ketikkan : 
      *Tilang#nomor polisi*. _Contoh : Tilang#DK1234P (nomor polisi tanpa spasi)_`;

      resolve(responseMessage);
    } else if (keyword[0] == "jadwal_sidang") {
      if (keyword.length == 1) {
        let responseMessage =
          "Perintah salah silahkan ketik jadwal#nomor perkara";
        resolve(responseMessage);
        return;
      }
      let query = `SELECT tanggal_sidang,agenda FROM perkara LEFT JOIN perkara_jadwal_sidang ON perkara.perkara_id=perkara_jadwal_sidang.perkara_id WHERE nomor_perkara='${keyword[1]}'`;
      db.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          let responseMessage;
          if (result.length != 0) {
            let resultArray = [];
            result.forEach((r) => {
              resultArray.push(
                `${moment(r.tanggal_sidang).format("D-M-YYYY")} : ${r.agenda}`
              );
            });
            responseMessage = resultArray.join("\n");
            3;
          } else {
            responseMessage = `Tidak ada data`;
          }
          resolve(responseMessage);
        }
      });
    } else if (keyword[0] == "tilang") {
      if (keyword.length == 1) {
        let responseMessage =
          "Perintah salah silahkan ketik tilang#nomor polisi";
        resolve(responseMessage);
        return;
      }
      let query = `SELECT amar_putusan FROM perkara_putusan LEFT JOIN perkara_lalulintas ON perkara_putusan.perkara_id=perkara_lalulintas.perkara_id WHERE nomor_polisi='${keyword[1]}'`;
      db.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          let responseMessage;
          if (result.length != 0) {
            let dataAmar = result[0].amar_putusan.split("<br/>").join(" ");

            responseMessage = dataAmar;
          } else {
            responseMessage = `Tidak ada data`;
          }
          resolve(responseMessage);
        }
      });
    } else if (keyword[0] == "biaya") {
      if (keyword.length == 1) {
        let responseMessage =
          "Perintah salah silahkan ketik biaya#nomor putusan";
        resolve(responseMessage);
        return;
      }
      let queryBiayaMasuk = `SELECT nomor_perkara,jumlah,uraian FROM perkara LEFT JOIN perkara_biaya ON perkara.perkara_id=perkara_biaya.perkara_id WHERE nomor_perkara='${keyword[1]}' AND jenis_transaksi=1`;
      let queryBiayaKeluar = `SELECT nomor_perkara,jumlah,uraian FROM perkara LEFT JOIN perkara_biaya ON perkara.perkara_id=perkara_biaya.perkara_id WHERE nomor_perkara='${keyword[1]}' AND jenis_transaksi=-1`;

      const dataBiaya = async () => {
        const masuk = await biayaMasuk(queryBiayaMasuk);
        const keluar = await biayaKeluar(queryBiayaKeluar);
        let biayaAsli = `${masuk.detailBiaya} \n ${
          keluar.detailBiaya
        } \n *Sisa* : ${masuk.detailJumlah - keluar.detailJumlah}`;
        // console.log(biayaAsli);
        return biayaAsli.toLocaleString();
      };

      resolve(dataBiaya());
    } else if (keyword[0] == "putusan") {
      if (keyword.length == 1) {
        let responseMessage =
          "Perintah salah silahkan ketik putusan#nomor perkara";
        resolve(responseMessage);
        return;
      }
      let query = `SELECT DISTINCT(nomor_perkara),tanggal_putusan,link_dirput FROM perkara LEFT JOIN perkara_putusan ON perkara.perkara_id=perkara_putusan.perkara_id LEFT JOIN dirput_dokumen ON perkara.perkara_id=dirput_dokumen.perkara_id WHERE nomor_perkara='${keyword[1]}' AND link_dirput IS NOT NULL ORDER BY tanggal_putusan DESC`;

      db.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          let responseMessage;
          if (result.length != 0) {
            let link_baru = result[0].link_dirput.split(".");
            let link2 = [link_baru[0] + "3"];
            link_baru.shift();
            let link_dirput = [...link2, ...link_baru].join(".");
            let linkPutusan = `No Perkara : ${
              result[0].nomor_perkara
            }, tanggal putusan : ${moment(result[0].tanggal_putusan).format(
              "D-M-YYYY"
            )}, link : ${link_dirput}`;

            responseMessage = linkPutusan;
          } else {
            responseMessage = `Tidak ada data`;
          }
          resolve(responseMessage);
        }
      });
    } else if (keyword[0] == "covid") {
      let prov = "BALI";

      let dataProv = async () => {
        let data = await axios
          .get("https://data.covid19.go.id/public/api/prov.json")
          .then((response) => {
            let data = response.data.list_data.filter((obj) => {
              return obj.key == prov;
            });
            return `Provinsi : ${
              data[0].key
            } \nJumlah kasus : ${data[0].jumlah_kasus.toLocaleString()} \nJumlah sembuh : ${data[0].jumlah_sembuh.toLocaleString()} \nJumlah meninggal : ${data[0].jumlah_meninggal.toLocaleString()}`;
          })
          .catch((err) => {
            return "Api error";
          });

        return data;
      };

      let dataIndonesia = async () => {
        let data = axios
          .get("https://data.covid19.go.id/public/api/update.json")
          .then((response) => {
            return `Indonesia \nJumlah positif : ${response.data.update.total.jumlah_positif.toLocaleString()} \nJumlah sembuh : ${response.data.update.total.jumlah_sembuh.toLocaleString()} \nJumlah meninggal : ${response.data.update.total.jumlah_meninggal.toLocaleString()}`;
          })
          .catch((err) => {
            return "Api error";
          });
        return data;
      };

      let msg = async () => {
        let jmlProv = await dataProv();
        let jmlIndonesia = await dataIndonesia();
        return `${jmlProv} \n\n${jmlIndonesia}`;
      };

      resolve(msg());

      // axios
      //   .get("https://data.covid19.go.id/public/api/update.json")
      //   .then((response) => {
      //     let responseMessage = `Jumlah positif : *${response.data.update.total.jumlah_positif.toLocaleString()}* \nJumlah sembuh : *${response.data.update.total.jumlah_sembuh.toLocaleString()}* \nJumlah meninggal : *${response.data.update.total.jumlah_meninggal.toLocaleString()}*`;
      //     resolve(responseMessage);
      //   })
      //   .catch((err) => {
      //     let responseMessage = "Api error";
      //     resolve(responseMessage);
      //   });

      // try {
      //   axios.get("https://api.kawalcorona.com/indonesia").then((response) => {
      //     let responseMessage = `Jumlah positif : *${response.data[0].positif}* \nJumlah sembuh : *${response.data[0].sembuh}* \nJumlah meninggal : *${response.data[0].meninggal}*`;

      //     resolve(responseMessage);
      //   });
      // } catch (error) {
      //   let responseMessage = `Koneksi ke API error`;
      //   resolve(responseMessage);
      // }
    } else if (keyword[0] == "monev_bas") {
      let query = `SELECT nomor_perkara,tanggal_sidang,agenda,panitera_nama FROM perkara LEFT JOIN perkara_jadwal_sidang ON perkara.perkara_id=perkara_jadwal_sidang.perkara_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id WHERE (alur_perkara_id=1 OR alur_perkara_id =2 OR alur_perkara_id=111 OR alur_perkara_id=112 OR alur_perkara_id=118 OR alur_perkara_id=119 OR alur_perkara_id=120 OR alur_perkara_id=121) AND (YEAR(tanggal_sidang)=YEAR(NOW()) AND tanggal_sidang<=CURDATE()-1 AND edoc_bas IS NULL) ORDER BY tanggal_sidang DESC`;

      db.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          let responseMessage;
          if (result.length != 0) {
            let resultArray = [];
            result.forEach((r) => {
              resultArray.push(
                `No Perkara : ${r.nomor_perkara}, tanggal sidang : ${moment(
                  r.tanggal_sidang
                ).format("D-M-YYYY")}, agenda : ${r.agenda}, pp : ${
                  r.panitera_nama
                }`
              );
            });
            responseMessage = resultArray.join("\n");
          } else {
            responseMessage = `Tidak ada data`;
          }
          resolve(responseMessage);
        }
      });
    } else if (keyword[0] == "monev_penahanan") {
      let query = `SELECT
      tanggal_akhir,
      id,
      nomor_perkara,
      tanggal_putusan
    FROM
      (
        SELECT
          MAX(sampai) as tanggal_akhir,
          penahanan_terdakwa.perkara_id as id
        FROM
          penahanan_terdakwa
        GROUP BY
          penahanan_terdakwa.perkara_id
        ORDER BY
          penahanan_terdakwa.perkara_id DESC
      ) AS custom
      LEFT JOIN perkara ON custom.id = perkara.perkara_id
      LEFT JOIN perkara_putusan ON custom.id = perkara_putusan.perkara_id
    WHERE
      tanggal_akhir >= CURDATE()
      AND tanggal_akhir <= CURDATE() + 10
      AND tanggal_putusan IS NULL`;

      db.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          let responseMessage;
          if (result.length != 0) {
            let resultArray = [];
            result.forEach((r) => {
              resultArray.push(
                `Nomor perkara : ${
                  r.nomor_perkara
                }, 'Tanggal penahanan terakhir : ${moment(
                  r.tanggal_akhir
                ).format("D-M-YYYY")}`
              );
            });
            responseMessage = resultArray.join("\n");
          } else {
            responseMessage = `Tidak ada data`;
          }
          resolve(responseMessage);
        }
      });
    } else if (keyword[0] == "dirput_hukum") {
      let query = `SELECT DISTINCT(nomor_perkara),tanggal_putusan,link_dirput,dokumen_ref_id
      FROM perkara
      LEFT JOIN perkara_putusan ON perkara.perkara_id=perkara_putusan.perkara_id
      LEFT JOIN dirput_dokumen ON perkara.perkara_id=dirput_dokumen.perkara_id
      WHERE (alur_perkara_id=1 OR alur_perkara_id =2 OR alur_perkara_id=8 OR alur_perkara_id=111 OR alur_perkara_id=112 OR alur_perkara_id=118 OR alur_perkara_id=119 OR alur_perkara_id=120 OR alur_perkara_id=121) AND (tanggal_putusan IS NOT NULL AND link_dirput IS NULL AND (dokumen_ref_id BETWEEN 88 AND 100) AND YEAR(tanggal_putusan)= YEAR(CURDATE()))
      ORDER BY tanggal_putusan DESC`;

      db.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          let responseMessage;
          if (result.length != 0) {
            let resultArray = [];
            result.forEach((r) => {
              resultArray.push(
                `No Perkara : ${r.nomor_perkara}, tanggal putusan : ${moment(
                  r.tanggal_putusan
                ).format("D-M-YYYY")}, link : ${r.link_dirput}`
              );
            });
            let link = resultArray.join("\n");
            let jml = resultArray.length;
            responseMessage = `Jumlah : ${jml} \n${link}`;
          } else {
            responseMessage = `Tidak ada data`;
          }
          resolve(responseMessage);
        }
      });
    } else if (keyword[0] == "sidang hari ini") {
      const message = async () => {
        let promiseSidangPidana = getJadwalSidangPidana();
        let messageSidangPidana = await promiseSidangPidana;
        let promiseSidangPerdata = getJadwalSidangPerdata();
        let messageSidangPerdata = await promiseSidangPerdata;
        let msg = `*Jadwal Sidang Pidana hari ini :* \n${messageSidangPidana} \n\n*Jadwal Sidang Perdata hari ini :* \n${messageSidangPerdata}`;
        return msg;
      };

      let responseMessage = message();
      resolve(responseMessage);
    } else if (keyword[0] == "sidang tanggal") {
      if (keyword.length == 1) {
        let responseMessage =
          "Perintah salah silahkan ketik sidang tanggal#tanggal, contoh sidang tanggal#20-12-2021";
        resolve(responseMessage);
        return;
      }
      let tanggal = keyword[1];
      const message = async () => {
        let promiseSidangPidana = getJadwalSidangPidana(tanggal);
        let messageSidangPidana = await promiseSidangPidana;
        let promiseSidangPerdata = getJadwalSidangPerdata(tanggal);
        let messageSidangPerdata = await promiseSidangPerdata;
        let msg = `*Jadwal Sidang Pidana tanggal ${tanggal} :* \n${messageSidangPidana} \n\n*Jadwal Sidang Perdata  tanggal ${tanggal} :* \n${messageSidangPerdata}`;
        return msg;
      };

      let responseMessage = message();
      resolve(responseMessage);
    } else if (keyword[0] == "statistik") {
      if (keyword.length == 1) {
        let responseMessage =
          "Perintah salah silahkan ketik statistisk#tahun, contoh: statistik#2021";
        resolve(responseMessage);
        return;
      }
      let year = keyword[1];
      const message = async () => {
        let promiseStatistik = getStatistik(year);
        let messageStatistik = await promiseStatistik;
        return messageStatistik;
      };

      let responseMessage = message();
      resolve(responseMessage);
    } else if (keyword[0] == "stiker") {
      const stiker = async () => {
        const media = MessageMedia.fromFilePath(
          `./public/sticker/Naruto_Uzumaki.png`
        );
        media.filename = "naruto";
        return media;
        // console.log(media);
      };

      stiker().then((obj) => {
        resolve(obj);
      });
      // resolve(stiker());
    } else if (keyword[0] == "mis") {
      const message = async () => {
        let promiseMis = mis();
        let messageMis = await promiseMis;
        return messageMis;
      };
      let responseMessage = message();
      resolve(responseMessage);
    } else if (keyword[0] == "bhtcapil") {
      let month = keyword[1];
      let year = keyword[2];
      const message = async () => {
        let messageBhtCapil = await getBhtCapil(month, year);
        // let messageMis = await promiseMis;
        return messageBhtCapil;
      };
      let responseMessage = message();
      resolve(responseMessage);
    } else if (keyword[0] == "onsdee86") {
      let responseMessage = `Silahkan ketik _Halo_ untuk memulai`;
      resolve(responseMessage);
    }
  });
};

// function biasa masuk
const biayaMasuk = (query) => {
  return new Promise((resolve, reject) => {
    let detailBiaya;
    let detailJumlah;
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result.length != 0) {
          let biayaRaw = [];
          result.forEach((r) => {
            biayaRaw.push({
              uraian: `- Uraian : ${
                r.uraian
              }, Jumlah : ${r.jumlah.toLocaleString()}`,
              jumlah: r.jumlah,
            });
          });
          let detailUraian = biayaRaw.map((obj) => obj.uraian).join("\n");
          detailJumlah = biayaRaw
            .map((obj) => obj.jumlah)
            .reduce((acc, current) => {
              return acc + current;
            });
          detailBiaya = `*Biaya Masuk* : \n ${detailUraian} \n *Total Biaya Masuk* : ${detailJumlah.toLocaleString()}`;
        } else {
          detailBiaya = `Tidak ada data`;
          detailJumlah = "";
        }
        resolve({ detailBiaya, detailJumlah });
        // console.log(detailBiaya, detailJumlah);
      }
    });
  });
};

// function biaya keluar

const biayaKeluar = (query) => {
  return new Promise((resolve, reject) => {
    let detailBiaya;
    let detailJumlah;
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result.length != 0) {
          let biayaRaw = [];
          result.forEach((r) => {
            biayaRaw.push({
              uraian: `- Uraian : ${
                r.uraian
              }, Jumlah : ${r.jumlah.toLocaleString()}`,
              jumlah: r.jumlah,
            });
          });
          let detailUraian = biayaRaw.map((obj) => obj.uraian).join("\n");
          detailJumlah = biayaRaw
            .map((obj) => obj.jumlah)
            .reduce((acc, current) => {
              return acc + current;
            });
          detailBiaya = `*Biaya Keluar* : \n ${detailUraian} \n *Total Biaya Keluar* : ${detailJumlah.toLocaleString()}`;
        } else {
          detailBiaya = `Tidak ada data`;
          detailJumlah = "";
        }
        resolve({ detailBiaya, detailJumlah });
        // console.log(detailBiaya, detailJumlah);
      }
    });
  });
};

const breakPihak = (alurPerkara, jenisPerkara, pihakNama) => {
  let pihakSplit = pihakNama.split("<br />");
  let pihakPerkara;

  if (jenisPerkara === "Perceraian" || alurPerkara === 118) {
    pihakPerkara = "Disamarkan";
  } else {
    if (pihakSplit.length > 1) {
      pihakPerkara = `${pihakSplit[0].substring(2)}, dkk`;
    } else {
      pihakPerkara = pihakSplit[0];
    }
  }

  return pihakPerkara;
};

const getJadwalSidangPerdata = (tanggal = null) => {
  return new Promise((resolve, reject) => {
    let query;
    if (tanggal == null) {
      query = `SELECT nomor_perkara, pihak1_text, pihak2_text, agenda, jenis_perkara_nama, alur_perkara_id FROM perkara LEFT JOIN perkara_jadwal_sidang ON perkara.perkara_id=perkara_jadwal_sidang.perkara_id WHERE tanggal_sidang = CURDATE() AND (alur_perkara_id = 1 OR alur_perkara_id = 2 OR alur_perkara_id = 8)`;
    } else {
      let splitTanggal = tanggal.split("-");
      let tanggalReformat = `${splitTanggal[2]}-${splitTanggal[1]}-${splitTanggal[0]}`;

      query = `SELECT nomor_perkara, pihak1_text, pihak2_text, agenda, jenis_perkara_nama, alur_perkara_id FROM perkara LEFT JOIN perkara_jadwal_sidang ON perkara.perkara_id=perkara_jadwal_sidang.perkara_id WHERE tanggal_sidang = '${tanggalReformat}' AND (alur_perkara_id = 1 OR alur_perkara_id = 2 OR alur_perkara_id = 8)`;
    }

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          let no = 1;
          result.forEach((r) => {
            if (r.pihak2_text === "" || r.pihak2_text === null) {
              resultArray.push(
                `${no++}. No Perkara : ${r.nomor_perkara}, agenda : ${
                  r.agenda
                }, Pemohon : ${breakPihak(
                  r.alur_perkara_id,
                  r.jenis_perkara_nama,
                  r.pihak1_text
                )}`
              );
            } else {
              resultArray.push(
                `${no++}. No Perkara : ${r.nomor_perkara}, agenda : ${
                  r.agenda
                }, Penggugat : ${breakPihak(
                  r.alur_perkara_id,
                  r.jenis_perkara_nama,
                  r.pihak1_text
                )}, Tergugat : ${breakPihak(
                  r.alur_perkara_id,
                  r.jenis_perkara_nama,
                  r.pihak2_text
                )}`
              );
            }
          });
          responseMessage = resultArray.join("\n");
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

const getJadwalSidangPidana = (tanggal = null) => {
  return new Promise((resolve, reject) => {
    let query;
    if (tanggal == null) {
      query = `SELECT nomor_perkara, pihak1_text, pihak2_text, agenda, jenis_perkara_nama, alur_perkara_id FROM perkara LEFT JOIN perkara_jadwal_sidang ON perkara.perkara_id=perkara_jadwal_sidang.perkara_id WHERE tanggal_sidang = CURDATE() AND (alur_perkara_id = 111 OR alur_perkara_id = 112 OR alur_perkara_id = 118)`;
    } else {
      let splitTanggal = tanggal.split("-");
      let tanggalReformat = `${splitTanggal[2]}-${splitTanggal[1]}-${splitTanggal[0]}`;

      query = `SELECT nomor_perkara, pihak1_text, pihak2_text, agenda, jenis_perkara_nama, alur_perkara_id FROM perkara LEFT JOIN perkara_jadwal_sidang ON perkara.perkara_id=perkara_jadwal_sidang.perkara_id WHERE tanggal_sidang = '${tanggalReformat}' AND (alur_perkara_id = 111 OR alur_perkara_id = 112 OR alur_perkara_id = 118)`;
    }
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, agenda : ${
                r.agenda
              }, PU : ${breakPihak(
                r.alur_perkara_id,
                r.jenis_perkara_nama,
                r.pihak1_text
              )}, Terdakwa : ${breakPihak(
                r.alur_perkara_id,
                r.jenis_perkara_nama,
                r.pihak2_text
              )}`
            );
          });
          responseMessage = resultArray.join("\n");
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

const getStatistik = async (year) => {
  let querySisaTahunLalu = `SELECT COUNT(perkara.perkara_id) as jumlah_sisa FROM perkara LEFT JOIN perkara_putusan ON perkara.perkara_id = perkara_putusan.perkara_id WHERE alur_perkara_id != 114 and YEAR(tanggal_pendaftaran) < ${year} AND (tanggal_putusan IS NULL OR YEAR(tanggal_putusan) = ${year})`;
  let queryMasukTahunIni = `SELECT COUNT(perkara.perkara_id) as jumlah_masuk FROM perkara LEFT JOIN       perkara_putusan ON perkara.perkara_id = perkara_putusan.perkara_id WHERE alur_perkara_id != 114 and YEAR(tanggal_pendaftaran) = ${year} `;
  let queryPutusTahunIni = `SELECT COUNT(perkara.perkara_id) as jumlah_putus FROM perkara LEFT JOIN perkara_putusan ON perkara.perkara_id = perkara_putusan.perkara_id WHERE alur_perkara_id != 114 AND YEAR(tanggal_putusan) = ${year} AND tanggal_putusan IS NOT NULL`;

  let jmlSisaTahunLalu = () => {
    return new Promise((resolve, reject) => {
      db.query(querySisaTahunLalu, async (err, result) => {
        if (err) {
          reject(err);
        } else {
          let jml = result;
          resolve(jml);
        }
      });
    });
  };

  let jmlMasukTahunIni = () => {
    return new Promise((resolve, reject) => {
      db.query(queryMasukTahunIni, async (err, result) => {
        if (err) {
          reject(err);
        } else {
          let jml = result;
          resolve(jml);
        }
      });
    });
  };

  let jmlPutusTahunIni = () => {
    return new Promise((resolve, reject) => {
      db.query(queryPutusTahunIni, async (err, result) => {
        if (err) {
          reject(err);
        } else {
          let jml = result;
          resolve(jml);
        }
      });
    });
  };

  let sisaTahunLalu = jmlSisaTahunLalu();
  let numberSisaTahunLalu = await sisaTahunLalu;
  let masukTahunIni = jmlMasukTahunIni();
  let numberMasukTahunIni = await masukTahunIni;
  let putusTahunIni = jmlPutusTahunIni();
  let numberPutusTahunIni = await putusTahunIni;
  let sisaTahunIni =
    numberSisaTahunLalu[0].jumlah_sisa +
    numberMasukTahunIni[0].jumlah_masuk -
    numberPutusTahunIni[0].jumlah_putus;
  let rasioPerkara =
    (numberPutusTahunIni[0].jumlah_putus /
      (numberSisaTahunLalu[0].jumlah_sisa +
        numberMasukTahunIni[0].jumlah_masuk)) *
    100;

  let rasioDisplay = rasioPerkara.toFixed(2);

  let message = `*Statistik Perkara Tahun ${year} (tidak termasuk perkara tilang) :* \nJumlah sisa tahun lalu : ${numberSisaTahunLalu[0].jumlah_sisa}, \nJumlah masuk : ${numberMasukTahunIni[0].jumlah_masuk} \nJumlah putus : ${numberPutusTahunIni[0].jumlah_putus} \nSisa : ${sisaTahunIni} \n*Rasio Penanganan Perkara  : ${rasioDisplay}%*`;

  return message;
};

const covid = async () => {
  let data;
  let dataCovid;
  // dataCovid = axios
  //   .get("https://data.covid19.go.id/public/api/update.json")
  //   .then((response) => {
  //     console.log(response);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  let prov = "DKI JAKARTA";
  let dataProv = await axios
    .get("https://data.covid19.go.id/public/api/prov.json")
    .then((response) => {
      let data = response.data.list_data.filter((obj) => {
        return obj.key == prov;
      });
      return `*Provinsi* : ${
        data[0].key
      } \nJumlah kasus : *${data[0].jumlah_kasus.toLocaleString()}* \nJumlah sembuh : *${data[0].jumlah_sembuh.toLocaleString()}* \nJumlah meninggal : *${data[0].jumlah_meninggal.toLocaleString()}*`;
    })
    .catch((err) => {
      return "Api error";
    });

  let dataIndonesia = await axios
    .get("https://data.covid19.go.id/public/api/update.json")
    .then((response) => {
      return `*Indonesia* \nJumlah positif : *${response.data.update.total.jumlah_positif.toLocaleString()}* \nJumlah sembuh : *${response.data.update.total.jumlah_sembuh.toLocaleString()}* \nJumlah meninggal : *${response.data.update.total.jumlah_meninggal.toLocaleString()}*`;
    })
    .catch((err) => {
      return "Api error";
    });

  let msg = `${dataProv} \n\n${dataIndonesia}`;

  console.log(msg);
};

const getBhtCapil = (month, year) => {
  let query = `SELECT nomor_perkara, tanggal_putusan, tanggal_bht FROM perkara LEFT JOIN perkara_putusan ON perkara.perkara_id=perkara_putusan.perkara_id WHERE tanggal_putusan IS NOT NULL AND  tanggal_bht IS NOT NULL  AND MONTH(tanggal_bht)=${month} AND YEAR(tanggal_bht)=${year} AND jenis_perkara_nama = 'Perceraian'`;

  return new Promise((resolve, reject) => {
    db.query(query, async (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `Nomor perkara : ${r.nomor_perkara}, tanggal putus : ${moment(
                r.tanggal_putusan
              ).format("D-M-YYYY")}, tanggal bht : ${moment(
                r.tanggal_bht
              ).format("D-M-YYYY")}`
            );
          });
          responseMessage = resultArray.join(`\n`);
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

// const stiker = async () => {
//   const media = MessageMedia.fromFilePath(
//     `./public/sticker/Naruto_Uzumaki.png`
//   );
//   media.filename = "naruto";
//   return media;
//   console.log(media);
// };
// stiker();
// getStatistik(2021).then((res) => console.log(res));
module.exports = getData;
