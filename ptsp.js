const db = require("./db_config3");
const moment = require("moment");

db.on("connection", (connection) => console.log("CONNECTION USING POOL"));

const getDataSurat = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM register_surat LEFT JOIN register_surat_pelaksanaan ON register_surat.pelaksanaan_terakhir_id = register_surat_pelaksanaan.pelaksanaan_id WHERE 
      klasifikasi_surat_id = 1 AND jenis_pelaksanaan_id!=20 AND YEAR(tanggal_register) > 2022`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          let nomor = 1;
          result.forEach((r) => {
            resultArray.push(
              `${nomor++}. Nomor agenda : ${
                r.nomor_agenda
              }, 'Tanggal register : ${moment(r.tanggal_register).format(
                "D-M-YYYY"
              )}, Pengirim surat : ${r.pengirim}, Disposisi terakhir dari ${
                r.dari_jabatan
              } ke ${r.kepada_jabatan}`
            );
          });
          responseMessage = `Data surat masuk yang belum dilaksanakan : \n ${resultArray.join(
            "\n-------------------\n"
          )}`;
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

// getDataSurat().then((res) => console.log(res));
module.exports = {
  getDataSurat,
};
