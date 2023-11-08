// requiring dependencies
const moment = require("moment");
const axios = require("axios").default;
const { MessageMedia } = require("whatsapp-web.js");
const db = require("./db_config");
const mis = require("./mis");

//pool on connect
db.on("connection", (connection) => console.log("CONNECTION USING POOL"));

// inisiasi pesan masuk
const getDetailPerkara = async (message) => {
  let keyword = message.split("#");

  if (keyword.length == 1) {
    return new Promise((resolve, reject) => {
      let responseMessage = "Perintah salah silahkan ketik detail#kode";
      resolve(responseMessage);
    });
  }

  let nomor_perkara_decode = Buffer.from(keyword[1], "base64").toString(
    "ascii"
  );
  let nomor_perkara = nomor_perkara_decode.split(".");
  if (nomor_perkara[1] == "GS") {
    nomor_perkara =
      nomor_perkara[0] + "/Pdt.G.S/" + nomor_perkara[2] + "/PN Nga";
  } else {
    nomor_perkara =
      nomor_perkara[0] +
      "/Pdt." +
      nomor_perkara[1] +
      "/" +
      nomor_perkara[2] +
      "/PN Nga";
  }

  let pengadilan = "Pengadilan Negeri Negara";

  // let web = "https://pn-negara.go.id";
  return new Promise((resolve, reject) => {
    // mulai logic pesan

    let query_main_perkara = `SELECT tanggal_pendaftaran, nomor_perkara, tanggal_putusan, tanggal_bht, amar_putusan FROM perkara as a LEFT JOIN perkara_putusan as b ON a.perkara_id=b.perkara_id WHERE nomor_perkara='${nomor_perkara}'`;
    let query_jadwal = `SELECT tanggal_sidang,agenda FROM perkara LEFT JOIN perkara_jadwal_sidang ON perkara.perkara_id=perkara_jadwal_sidang.perkara_id WHERE nomor_perkara='${nomor_perkara}'`;
    // let messageJadwalSidang;

    const message_res = async () => {
      let data_main = await main_perkara(query_main_perkara);
      if (data_main.data == "Tidak ada data") {
        let mixMessage = "Tidak ada data";
        return mixMessage;
      } else {
        let data_jadwal = await jadwal_sidang(query_jadwal);
        let biaya_detail = await detail_biaya(nomor_perkara);
        let {
          tgl_pendaftaran_fix,
          tgl_putusan_fix,
          tgl_bht_fix,
          amar_putusan_fix,
          nomor_perkara_fix,
        } = data_main;

        let amarChange = amar_putusan_fix
          ? amar_putusan_fix.replace(/<\/?[^>]+>/gi, "\n")
          : "Belum putus";

        let mix = [
          `*Nomor perkara*  : ${nomor_perkara_fix}`,
          `*Tgl pendaftaran* : ${tgl_pendaftaran_fix}`,
          `*Jadwal sidang* : \n${data_jadwal}`,
          `*Tanggal putusan* : ${
            tgl_putusan_fix ? tgl_putusan_fix : "Belum putus"
          }`,
          `*Tanggal bht* : ${tgl_bht_fix ? tgl_bht_fix : "Belum putus"}`,
          `*Biaya proses perkara* : \n${biaya_detail}`,
          `*Amar putusan* : ${amarChange}`,
          `\n*Disclaimer : Biaya proses perkara diatas adalah biaya resmi yang dipungut oleh Pengadilan Negeri Negara. Tidak ada biaya lain yang dibayarkan selain biaya diatas. Apabila masih terdapat sisa dari biaya proses, mohon agar segera diambil di kasir*\n*STOP GRATIFIKASI*`,
        ];

        let mixMessage = mix.join("\n");
        return mixMessage;
      }
    };

    resolve(message_res());
  });
};

const jadwal_sidang = (query) => {
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      let messageJadwalSidang = [];
      if (err) {
        reject(err);
      } else {
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `${moment(r.tanggal_sidang).format("D-M-YYYY")} : ${r.agenda}`
            );
          });
          let msg = resultArray.join("\n");
          messageJadwalSidang.push(msg);
          3;
        } else {
          messageJadwalSidang.push(`Belum ada jadwal sidang`);
        }
        resolve(messageJadwalSidang);
      }
    });
  });
};

const detail_biaya = (nomor_perkara) => {
  return new Promise((resolve, reject) => {
    let queryBiayaMasuk = `SELECT nomor_perkara,jumlah,uraian FROM perkara LEFT JOIN perkara_biaya ON perkara.perkara_id=perkara_biaya.perkara_id WHERE nomor_perkara='${nomor_perkara}' AND jenis_transaksi=1`;
    let queryBiayaKeluar = `SELECT nomor_perkara,jumlah,uraian FROM perkara LEFT JOIN perkara_biaya ON perkara.perkara_id=perkara_biaya.perkara_id WHERE nomor_perkara='${nomor_perkara}' AND jenis_transaksi=-1`;

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
  });
};

const main_perkara = (query) => {
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      // let messageJadwalSidang;
      let resultArray;
      if (err) {
        reject(err);
      } else {
        if (result.length != 0) {
          result.forEach((r) => {
            resultArray = r;
          });
          let {
            tanggal_pendaftaran,
            nomor_perkara,
            tanggal_putusan,
            tanggal_bht,
            amar_putusan,
          } = resultArray;
          let tgl_pendaftaran_fix =
            moment(tanggal_pendaftaran).format("D-M-YYYY");
          let tgl_putusan_fix = tanggal_putusan
            ? moment(tanggal_putusan).format("D-M-YYYY")
            : "Belum putus";
          let tgl_bht_fix = tanggal_bht
            ? moment(tanggal_bht).format("D-M-YYYY")
            : "Belum BHT";
          let amar_putusan_fix = amar_putusan;
          let nomor_perkara_fix = nomor_perkara;

          // messageJadwalSidang = resultArray.join("\n");
          resultArray = {
            tgl_pendaftaran_fix,
            tgl_putusan_fix,
            tgl_bht_fix,
            amar_putusan_fix,
            nomor_perkara_fix,
          };
        } else {
          resultArray = { data: "Tidak ada data" };
        }
        resolve(resultArray);
      }
    });
  });
};

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
      }
    });
  });
};

// getDetailPerkara("detail#MTU5LkcuMjAyMg==").then((res) => console.log(res));

module.exports = getDetailPerkara;
