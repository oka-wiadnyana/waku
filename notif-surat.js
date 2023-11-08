const moment = require("moment");
const db = require("./db_config2");

const getDataArsipBelum = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT
        *
      FROM
        mails
        LEFT JOIN employees ON mails.employee_id=employees.id
      WHERE
        arsip IS NULL`;

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
              `${nomor++}. Nomor surat : ${
                r.nomor_surat
              }, 'Tanggal surat : ${moment(r.tanggal_surat).format(
                "D-M-YYYY"
              )}, Pemohon Surat : ${r.nama}`
            );
          });
          responseMessage = resultArray.join("\n\n");
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

// getDataArsipBelum().then((res) => console.log(res));
module.exports = {
  getDataArsipBelum,
};
