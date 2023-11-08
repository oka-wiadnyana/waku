const moment = require("moment");
const db = require("./db_config");

const getDataPenahanan = () => {
  return new Promise((resolve, reject) => {
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
        AND tanggal_akhir <= DATE_ADD(CURDATE(),INTERVAL 15 DAY)
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
              }, 'Tanggal penahanan terakhir : ${moment(r.tanggal_akhir).format(
                "D-M-YYYY"
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

const getDataBA = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara,tanggal_sidang,agenda,panitera_nama FROM perkara LEFT JOIN perkara_jadwal_sidang ON perkara.perkara_id=perkara_jadwal_sidang.perkara_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id WHERE (alur_perkara_id=1 OR alur_perkara_id =2 OR alur_perkara_id=111 OR alur_perkara_id=112 OR alur_perkara_id=118 OR alur_perkara_id=119 OR alur_perkara_id=120 OR alur_perkara_id=121) AND (YEAR(tanggal_sidang)=YEAR(NOW()) AND tanggal_sidang < CURDATE() AND edoc_bas IS NULL) AND perkara_panitera_pn.aktif = 'Y' ORDER BY tanggal_sidang DESC`;

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
  });
};

const getDataPutusanBelumMinut = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara,tanggal_putusan,panitera_nama FROM perkara LEFT JOIN perkara_putusan ON perkara.perkara_id=perkara_putusan.perkara_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id WHERE tanggal_putusan IS NOT NULL AND tanggal_minutasi IS NULL AND perkara_panitera_pn.aktif = 'Y' ORDER BY tanggal_putusan DESC`;

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
              ).format("D-M-YYYY")}, pp : ${r.panitera_nama}`
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

const getDataBelumBhtPidana = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, v_perkara_detil.tanggal_putusan,v_perkara_detil.tanggal_minutasi,panitera_nama FROM v_perkara_detil  LEFT JOIN perkara_putusan ON v_perkara_detil.perkara_id=perkara_putusan.perkara_id LEFT JOIN perkara_panitera_pn ON v_perkara_detil.perkara_id=perkara_panitera_pn.perkara_id WHERE v_perkara_detil.tanggal_putusan IS NOT NULL AND v_perkara_detil.tanggal_minutasi IS NOT NULL AND perkara_putusan.tanggal_bht IS NULL AND permohonan_banding IS NULL AND permohonan_kasasi IS NULL AND YEAR(v_perkara_detil.tanggal_putusan)>=2019 AND (((alur_perkara_id = 111 OR alur_perkara_id = 112 OR alur_perkara_id = 113 OR alur_perkara_id = 118) AND v_perkara_detil.tanggal_minutasi <= CURDATE())) AND perkara_panitera_pn.aktif = 'Y' ORDER BY tanggal_putusan DESC`;

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
              ).format("D-M-YYYY")}, tanggal minutasi : ${moment(
                r.tanggal_minutasi
              ).format("D-M-YYYY")}, pp : ${r.panitera_nama}`
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

const getDataBelumBhtPerdata = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, v_perkara_detil.tanggal_putusan,v_perkara_detil.tanggal_minutasi,panitera_nama FROM v_perkara_detil  LEFT JOIN perkara_putusan ON v_perkara_detil.perkara_id=perkara_putusan.perkara_id LEFT JOIN perkara_panitera_pn ON v_perkara_detil.perkara_id=perkara_panitera_pn.perkara_id WHERE v_perkara_detil.tanggal_putusan IS NOT NULL AND v_perkara_detil.tanggal_minutasi IS NOT NULL AND perkara_putusan.tanggal_bht IS NULL AND permohonan_banding IS NULL AND permohonan_kasasi IS NULL AND YEAR(v_perkara_detil.tanggal_putusan)>=2019  AND (((alur_perkara_id = 1 OR alur_perkara_id = 2 OR alur_perkara_id = 8 OR alur_perkara_id = 7) AND v_perkara_detil.tanggal_minutasi <= CURDATE())) AND perkara_panitera_pn.aktif = 'Y' ORDER BY v_perkara_detil.tanggal_putusan DESC`;

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
              ).format("D-M-YYYY")}, tanggal minutasi : ${moment(
                r.tanggal_minutasi
              ).format("D-M-YYYY")}, pp : ${r.panitera_nama}`
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

const getDataBelumSerahHukum = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT id, perkara.nomor_perkara, tanggal_putusan, tanggal_minutasi, tanggal_bht FROM perkara LEFT JOIN perkara_putusan ON perkara.perkara_id=perkara_putusan.perkara_id LEFT JOIN arsip ON perkara.perkara_id=arsip.perkara_id WHERE id IS NULL AND tanggal_bht IS NOT NULL AND YEAR(tanggal_bht) >=2019 ORDER BY tanggal_bht DESC`;

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
              ).format("D-M-YYYY")}, tanggal minutasi : ${moment(
                r.tanggal_minutasi
              ).format("D-M-YYYY")}, tanggal bht : ${moment(
                r.tanggal_bht
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
  });
};

const getDataTundaJadwalSidang = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT tanggal_terakhir, nomor_perkara, panitera_nama FROM (SELECT MAX(tanggal_sidang) AS tanggal_terakhir, perkara_id FROM perkara_jadwal_sidang GROUP BY perkara_id) as jadwal_sidang LEFT JOIN perkara ON jadwal_sidang.perkara_id=perkara.perkara_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id LEFT JOIN perkara_putusan ON perkara.perkara_id=perkara_putusan.perkara_id LEFT JOIN perkara_mediasi ON perkara.perkara_id=perkara_mediasi.perkara_id WHERE tanggal_putusan IS NULL AND (mediasi_id IS NULL OR hasil_mediasi IS NOT NULL) AND tanggal_terakhir <= CURDATE() AND perkara_panitera_pn.aktif = 'Y' ORDER BY tanggal_terakhir DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${
                r.nomor_perkara
              }, tanggal sidang terakhir : ${moment(r.tanggal_terakhir).format(
                "D-M-YYYY"
              )}, PP : ${r.panitera_nama}`
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

const getDataSaksiTidakLengkap = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, panitera_nama FROM (SELECT DISTINCT(perkara_id) FROM perkara_jadwal_sidang WHERE agenda LIKE '%saksi%' AND alasan_ditunda NOT LIKE '%saksi%' AND dihadiri_oleh!=4 AND tanggal_sidang <= CURDATE()) as pemeriksaan_saksi LEFT JOIN perkara ON pemeriksaan_saksi.perkara_id=perkara.perkara_id LEFT JOIN perkara_pihak5 ON perkara.perkara_id=perkara_pihak5.perkara_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id WHERE perkara_pihak5.perkara_id IS NULL AND YEAR(perkara.tanggal_pendaftaran)>=2021 AND perkara_panitera_pn.aktif = 'Y' ORDER BY perkara.perkara_id DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, PP : ${r.panitera_nama}`
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

// const getDataPutusanBelumBeritahu = () => {
//   return new Promise((resolve, reject) => {
//     let query = `SELECT nomor_perkara, tanggal_putusan, panitera_nama FROM perkara LEFT JOIN perkara_putusan_pemberitahuan_putusan ON perkara.perkara_id=perkara_putusan_pemberitahuan_putusan.perkara_id LEFT JOIN perkara_putusan ON perkara.perkara_id=perkara_putusan.perkara_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id WHERE tanggal_putusan IS NOT NULL AND (alur_perkara_id=1 OR alur_perkara_id=2 OR alur_perkara_id=8 OR alur_perkara_id=111 OR alur_perkara_id=112 OR alur_perkara_id=113 OR alur_perkara_id=118) AND perkara_putusan_pemberitahuan_putusan.perkara_id IS NULL  AND YEAR(tanggal_putusan)>='2019' ORDER BY perkara.perkara_id DESC`;

//     db.query(query, (err, result) => {
//       if (err) {
//         reject(err);
//       } else {
//         let responseMessage;
//         if (result.length != 0) {
//           let resultArray = [];
//           result.forEach((r) => {
//             resultArray.push(
//               `No Perkara : ${r.nomor_perkara}, tanggal putusan : ${moment(
//                 r.tanggal_putusan
//               ).format("D-M-YYYY")}, PP : ${r.panitera_nama}`
//             );
//           });
//           responseMessage = resultArray.join("\n");
//         } else {
//           responseMessage = `Tidak ada data`;
//         }
//         resolve(responseMessage);
//       }
//     });
//   });
// };

const getDataPutusanBelumBeritahuNew = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT perkara.perkara_id, alur_perkara_id,nomor_perkara, nama, pihak,perkara_putusan_pemberitahuan_putusan.pihak_id as pihak_pemb, tanggal_pemberitahuan_putusan, tanggal_putusan,status_putusan_id FROM perkara LEFT JOIN perkara_putusan_pemberitahuan_putusan ON perkara.perkara_id=perkara_putusan_pemberitahuan_putusan.perkara_id LEFT JOIN perkara_putusan ON perkara.perkara_id=perkara_putusan.perkara_id LEFT JOIN pihak ON perkara_putusan_pemberitahuan_putusan.pihak_id=pihak.id WHERE alur_perkara_id !=114 AND tanggal_putusan is not null AND year(tanggal_putusan) > 2020 AND tanggal_pemberitahuan_putusan is null ORDER BY perkara.perkara_id DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            let pihak_jenis;
            if (r.alur_perkara_id == 1 || r.alur_perkara_id == 8) {
              pihak_jenis = r.pihak == 1 ? "Penggugat" : "Tergugat";
              if (r.status_putusan_id != 28) {
                resultArray.push(
                  `No Perkara : ${r.nomor_perkara},  tanggal putusan : ${moment(
                    r.tanggal_putusan
                  ).format(
                    "D-M-YYYY"
                  )}, pihak yang belum diberitahukan : ${pihak_jenis}`
                );
              }
            } else if (
              r.alur_perkara_id == 111 ||
              r.alur_perkara_id == 112 ||
              r.alur_perkara_id == 113 ||
              r.alur_perkara_id == 118
            ) {
              pihak_jenis = r.pihak == 1 ? "Penuntut Umum" : "Terdakwa";
              resultArray.push(
                `No Perkara : ${r.nomor_perkara},  pihak yang belum diberitahukan : ${pihak_jenis}`
              );
            } else if (r.alur_perkara_id == 119) {
              pihak_jenis = r.pihak == 1 ? "Pemohon" : "Termohon";
              resultArray.push(
                `No Perkara : ${r.nomor_perkara},  pihak yang belum diberitahukan : ${pihak_jenis}`
              );
            } else {
              pihak_jenis = "Pemohon";
              resultArray.push(
                `No Perkara : ${r.nomor_perkara},  pihak yang belum diberitahukan : ${pihak_jenis}`
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

const getDataJadwalSidangPidana = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, agenda, panitera_nama FROM perkara LEFT JOIN perkara_jadwal_sidang ON perkara.perkara_id=perkara_jadwal_sidang.perkara_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id WHERE tanggal_sidang = CURDATE() AND (alur_perkara_id=111 OR alur_perkara_id=112 OR alur_perkara_id=118) AND perkara_panitera_pn.aktif = 'Y' ORDER BY perkara.perkara_id DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, agenda : ${r.agenda}, PP : ${r.panitera_nama}`
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

const getDataJadwalSidangPerdata = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, agenda, panitera_nama FROM perkara LEFT JOIN perkara_jadwal_sidang ON perkara.perkara_id=perkara_jadwal_sidang.perkara_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id WHERE tanggal_sidang = CURDATE() AND (alur_perkara_id=1 OR alur_perkara_id=2 OR alur_perkara_id=8 OR alur_perkara_id=7) AND perkara_panitera_pn.aktif = 'Y' ORDER BY perkara.perkara_id DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, agenda : ${r.agenda}, PP : ${r.panitera_nama}`
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

const getDataJadwalMediasi = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, nama_mediator, panitera_nama FROM perkara LEFT JOIN perkara_mediasi ON perkara.perkara_id=perkara_mediasi.perkara_id  LEFT JOIN perkara_mediator ON perkara.perkara_id=perkara_mediator.perkara_id LEFT JOIN perkara_jadwal_mediasi ON perkara_mediasi.mediasi_id=perkara_jadwal_mediasi.mediasi_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id WHERE tanggal_mediasi = CURDATE() AND perkara_panitera_pn.aktif = 'Y' ORDER BY perkara.perkara_id DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, nama mediator : ${r.nama_mediator}, PP : ${r.panitera_nama}`
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

const getDataSisaPanjarPn = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, tanggal_putusan, sisa FROM v_perkara_biaya LEFT JOIN perkara_putusan ON v_perkara_biaya.perkara_id=perkara_putusan.perkara_id WHERE tahapan_terakhir_id=15 AND (alur_perkara_id = 1 OR alur_perkara_id = 2 OR alur_perkara_id = 8) AND sisa > 0 ORDER BY v_perkara_biaya.perkara_id DESC`;

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
              ).format("D-M-YYYY")}, sisa panjar : ${r.sisa.toLocaleString()}`
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

const getDataSisaPanjarBanding = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, putusan_banding, sisa FROM v_perkara_biaya_banding LEFT JOIN perkara_banding ON v_perkara_biaya_banding.perkara_id=perkara_banding.perkara_id WHERE proses_terakhir_id=400 AND (v_perkara_biaya_banding.alur_perkara_id = 1 OR v_perkara_biaya_banding.alur_perkara_id = 2 OR v_perkara_biaya_banding.alur_perkara_id = 8) AND sisa > 0 ORDER BY v_perkara_biaya_banding.perkara_id DESC`;

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
                r.putusan_banding
              ).format("D-M-YYYY")}, sisa panjar : ${r.sisa.toLocaleString()}`
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

const getDataSisaPanjarKasasi = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, putusan_kasasi, sisa FROM v_perkara_biaya_kasasi LEFT JOIN perkara_kasasi ON v_perkara_biaya_kasasi.perkara_id=perkara_kasasi.perkara_id WHERE proses_terakhir_id=500 AND (v_perkara_biaya_kasasi.alur_perkara_id = 1 OR v_perkara_biaya_kasasi.alur_perkara_id = 2 OR v_perkara_biaya_kasasi.alur_perkara_id = 8) AND sisa > 0 ORDER BY v_perkara_biaya_kasasi.perkara_id DESC`;

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
                r.putusan_kasasi
              ).format("D-M-YYYY")}, sisa panjar : ${r.sisa.toLocaleString()}`
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

const getDataCourtCalendar = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT 					
    A.tanggal_pendaftaran, 
    A.nomor_perkara, 
    A.proses_terakhir_text,
    A.para_pihak, 
    
    (SELECT panitera_nama 
    FROM perkara_panitera_pn 
    LEFT JOIN panitera_pn  ON panitera_pn.id = perkara_panitera_pn.panitera_id
    WHERE perkara_panitera_pn.perkara_id= A.perkara_id AND perkara_panitera_pn.aktif='Y' ORDER BY perkara_panitera_pn.urutan ASC) AS paniteraku,
    (SELECT GROUP_CONCAT(DISTINCT hkpn.nama_gelar ORDER BY hk.id ASC SEPARATOR '<br>') AS nama_hakim 
    FROM perkara_hakim_pn AS hk
    LEFT JOIN hakim_pn AS hkpn ON hkpn.id = hk.hakim_id
    WHERE hk.perkara_id= A.perkara_id AND hk.aktif='Y' ORDER BY hk.urutan ASC) AS majelis_hakim
          FROM perkara as A
          LEFT JOIN perkara_hakim_pn as B ON B.perkara_id=A.perkara_id
          LEFT JOIN perkara_jadwal_sidang as C ON C.perkara_id=A.perkara_id
          LEFT JOIN perkara_panitera_pn as D ON D.perkara_id=A.perkara_id
          WHERE A.alur_perkara_id NOT IN (18,112,113,114)	
          AND A.perkara_id NOT IN (SELECT perkara_id FROM perkara_court_calendar 
                                   WHERE (rencana_agenda LIKE '%putus%' OR rencana_agenda LIKE '%penetapan%' OR rencana_agenda LIKE '%cabut%' OR rencana_agenda LIKE '%gugur%' OR rencana_agenda LIKE '%akta perdamaian%' OR rencana_agenda LIKE '%P U T U S%'))
          AND B.aktif = 'Y'		
          AND D.aktif = 'Y'
          AND C.tanggal_sidang IS NOT NULL								
          AND A.perkara_id NOT IN (SELECT perkara_id FROM perkara_mediasi
                                   WHERE dimulai_mediasi IS NOT NULL 
                       AND hasil_mediasi IS NULL)
          AND YEAR(A.tanggal_pendaftaran) = 2022
          GROUP BY A.perkara_id
          ORDER BY A.perkara_id DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, PP : ${r.paniteraku}`
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

const getStatistik = async () => {
  let querySisaTahunLalu = `SELECT COUNT(perkara.perkara_id) as jumlah_sisa FROM perkara LEFT JOIN perkara_putusan ON perkara.perkara_id = perkara_putusan.perkara_id WHERE alur_perkara_id != 114 and YEAR(tanggal_pendaftaran) < YEAR(CURDATE()) AND (tanggal_putusan IS NULL OR YEAR(tanggal_putusan) = YEAR(CURDATE()))`;
  let queryMasukTahunIni = `SELECT COUNT(perkara.perkara_id) as jumlah_masuk FROM perkara LEFT JOIN       perkara_putusan ON perkara.perkara_id = perkara_putusan.perkara_id WHERE alur_perkara_id != 114 and YEAR(tanggal_pendaftaran) = YEAR(CURDATE()) `;
  let queryPutusTahunIni = `SELECT COUNT(perkara.perkara_id) as jumlah_putus FROM perkara LEFT JOIN perkara_putusan ON perkara.perkara_id = perkara_putusan.perkara_id WHERE alur_perkara_id != 114 AND YEAR(tanggal_putusan) = YEAR(CURDATE()) AND tanggal_putusan IS NOT NULL`;

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

  let message = `Jumlah sisa tahun lalu : ${numberSisaTahunLalu[0].jumlah_sisa}, \nJumlah masuk tahun ini : ${numberMasukTahunIni[0].jumlah_masuk} \nJumlah putus tahun ini : ${numberPutusTahunIni[0].jumlah_putus} \nSisa Tahun ini : ${sisaTahunIni} \n*Rasio Penanganan Perkara Tahun Ini : ${rasioDisplay}%*`;

  return message;
};

const getBelumBhtBanding = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, putusan_banding, pemberitahuan_putusan_banding from v_perkara_detil join perkara_putusan on v_perkara_detil.perkara_id=perkara_putusan.perkara_id where pemberitahuan_putusan_banding IS NOT NULL AND tanggal_bht is null and permohonan_kasasi IS NULL AND year(pemberitahuan_putusan_banding)>=2021`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${
                r.nomor_perkara
              }, tanggal putusan banding : ${moment(r.putusan_banding).format(
                "D-M-YYY"
              )}, tanggal pemberitahuan putusan banding : ${moment(
                r.pemberitahuan_putusan_banding
              ).format("D-M-YYY")}`
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

const getBelumBhtKasasi = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, putusan_kasasi, pemberitahuan_putusan_kasasi from v_perkara_detil join perkara_putusan on v_perkara_detil.perkara_id=perkara_putusan.perkara_id where pemberitahuan_putusan_kasasi IS NOT NULL AND tanggal_bht is null AND year(pemberitahuan_putusan_kasasi)>=2021`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${
                r.nomor_perkara
              }, tanggal putusan kasasi : ${moment(r.putusan_kasasi).format(
                "D-M-YYYY"
              )}, tanggal pemberitahuan putusan kasasi : ${moment(
                r.pemberitahuan_putusan_kasasi
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
  });
};

const getBelumPanggilan = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT
    perk.nomor_perkara,
    perk.perkara_id,
    perk.alur_perkara_id,
    alur.nama AS nama_alur,
   
    (
      SELECT
        GROUP_CONCAT(
          DISTINCT hkpn.nama_gelar
          ORDER BY
            hk.id ASC SEPARATOR '<br>'
        ) AS nama_hakim
      FROM
        perkara_hakim_pn AS hk
        JOIN hakim_pn AS hkpn ON hkpn.id = hk.hakim_id
      WHERE
        hk.perkara_id = perk.perkara_id
        AND hk.aktif = 'Y'
      ORDER BY
        hk.urutan ASC
    ) AS majelis_hakim,
    (
      SELECT
        GROUP_CONCAT(
          DISTINCT pp.nama
          ORDER BY
            ppp.id ASC SEPARATOR '<br>'
        ) AS nama_js
      FROM
        perkara_panitera_pn AS ppp
        JOIN panitera_pn AS pp ON pp.id = ppp.panitera_id
      WHERE
        ppp.perkara_id = perk.perkara_id
        AND ppp.aktif = 'Y'
      ORDER BY
        ppp.urutan ASC
    ) AS panitera_nama,
    (
      SELECT
        GROUP_CONCAT(
          DISTINCT jspn.nama
          ORDER BY
            pjs.id ASC SEPARATOR '<br>'
        ) AS nama_js
      FROM
        perkara_jurusita AS pjs
        JOIN jurusita AS jspn ON jspn.id = pjs.jurusita_id
      WHERE
        pjs.perkara_id = perk.perkara_id
        AND pjs.aktif = 'Y'
      ORDER BY
        pjs.urutan ASC
    ) AS jurusita,
    sidang.id AS sidang_id,
    DATE_FORMAT(sidang.tanggal_sidang, '%d-%m-%Y') AS tanggal_sidang,
    sidang.agenda,
    perkarapihak.pihak_id,
    perkarapihak.nama AS nama_pihak,
    perkarapihak.pihakke,
    perkarapihak.ketpihak,
    perkarapihak.pengacara_pihak_id,
    datarelaas.id AS relaas_id,
    DATE_FORMAT(datarelaas.tanggal_relaas, '%d-%m-%Y') AS tanggal_relaas,
    datarelaas.doc_relaas,
    sidang.urutan,
    jadwalsidang.urutan AS urutan_sebelumnya,
    jadwalsidang.dihadiri_oleh AS status_kehadiran_sebelumnya,
    (
      CASE
        WHEN(phs.tahapan_id = 12) THEN 'Y'
        ELSE 'T'
      END
    ) AS sidang_pertama
  FROM
    perkara AS perk
    JOIN perkara_jadwal_sidang AS sidang ON sidang.perkara_id = perk.perkara_id
    JOIN (
      SELECT
        p1.perkara_id,
        p1.pihak_id,
        p1.nama,
        1 AS pihakke,
        'pihak' AS ketpihak,
        '' AS pengacara_pihak_id
      FROM
        perkara_pihak1 AS p1
        JOIN perkara ON perkara.perkara_id = p1.perkara_id
      WHERE
        alur_perkara_id < 111
      UNION
      SELECT
        p2.perkara_id,
        p2.pihak_id,
        p2.nama,
        2 AS pihakke,
        'pihak' AS ketpihak,
        '' AS pengacara_pihak_id
      FROM
        perkara_pihak2 AS p2
        JOIN perkara ON perkara.perkara_id = p2.perkara_id
      WHERE
        alur_perkara_id < 111
        AND (
          status_penahanan_id IS NULL
          OR status_penahanan_id = 0
        )
        AND (
          jenis_tahanan_id = 0
          OR jenis_tahanan_id IS NULL
        )
      UNION
      SELECT
        p3.perkara_id,
        p3.pihak_id,
        p3.nama,
        3 AS pihakke,
        'intervensi' AS ketpihak,
        '' AS pengacara_pihak_id
      FROM
        perkara_pihak3 AS p3
      UNION
      SELECT
        p4.perkara_id,
        p4.pihak_id,
        p4.nama,
        4 AS pihakke,
        'turut' AS ketpihak,
        '' AS pengacara_pihak_id
      FROM
        perkara_pihak4 AS p4
      UNION
      SELECT
        p5.perkara_id,
        p5.pengacara_id,
        p5.nama,
        p5.pihak_ke AS pihhkke,
        'pengacara' AS ketpihak,
        p5.pihak_id AS pengacara_pihak_id
      FROM
        perkara_pengacara AS p5
    ) AS perkarapihak ON perkarapihak.perkara_id = perk.perkara_id
    LEFT JOIN perkara_pelaksanaan_relaas AS datarelaas ON datarelaas.pihak_id = perkarapihak.pihak_id
    AND datarelaas.perkara_id = perk.perkara_id
    AND datarelaas.sidang_id = sidang.id
    LEFT JOIN (
      SELECT
        perkara.perkara_id AS perkara_id,
        perkara_jadwal_sidang.urutan AS urutan,
        perkara_jadwal_sidang.dihadiri_oleh
      FROM
        (
          perkara
          JOIN perkara_jadwal_sidang ON (
            perkara_jadwal_sidang.perkara_id = perkara.perkara_id
          )
        )
    ) AS jadwalsidang ON (
      jadwalsidang.perkara_id = perk.perkara_id
      AND jadwalsidang.urutan = sidang.urutan - 1
    )
    LEFT JOIN perkara_penetapan_hari_sidang AS phs ON (
      phs.perkara_id = perk.perkara_id
      AND phs.jadwalsidang_id = sidang.id
    )
    JOIN alur_perkara AS alur ON alur.id = perk.alur_perkara_id
   
  WHERE
    YEAR(perk.tanggal_pendaftaran) = YEAR(CURDATE())
    AND perk.alur_perkara_id < 111
    AND perkarapihak.pihak_id NOT IN (
      SELECT
        pp.pihak_id
      FROM
        perkara_pelaksanaan_relaas
        JOIN perkara_pengacara AS pp ON pp.pengacara_id = perkara_pelaksanaan_relaas.pihak_id
        AND pp.perkara_id = perkara_pelaksanaan_relaas.perkara_id
        JOIN perkara ON pp.perkara_id = perkara.perkara_id
      WHERE
        perk.alur_perkara_id < 111
        AND perkara_pelaksanaan_relaas.perkara_id = perk.perkara_id
        AND perkara_pelaksanaan_relaas.sidang_id = sidang.id
        AND (
          perkara_pelaksanaan_relaas.tanggal_relaas IS NOT NULL
          OR perkara_pelaksanaan_relaas.tanggal_relaas <> ''
        )
        AND (
          perkara_pelaksanaan_relaas.doc_relaas IS NOT NULL
          OR perkara_pelaksanaan_relaas.doc_relaas <> ''
        )
      UNION
      SELECT
        ppb.pengacara_id
      FROM
        perkara_pelaksanaan_relaas
        JOIN perkara_pengacara AS ppb ON ppb.pihak_id = perkara_pelaksanaan_relaas.pihak_id
        AND ppb.perkara_id = perkara_pelaksanaan_relaas.perkara_id
        JOIN perkara ON ppb.perkara_id = perkara.perkara_id
      WHERE
        perk.alur_perkara_id < 111
        AND perkara_pelaksanaan_relaas.perkara_id = perk.perkara_id
        AND perkara_pelaksanaan_relaas.sidang_id = sidang.id
        AND (
          perkara_pelaksanaan_relaas.tanggal_relaas IS NOT NULL
          OR perkara_pelaksanaan_relaas.tanggal_relaas <> ''
        )
        AND (
          perkara_pelaksanaan_relaas.doc_relaas IS NOT NULL
          OR perkara_pelaksanaan_relaas.doc_relaas <> ''
        )
    )
    AND (
      (
        datarelaas.tanggal_relaas IS NULL
        OR datarelaas.tanggal_relaas = ''
      )
      OR (
        datarelaas.doc_relaas IS NULL
        OR datarelaas.doc_relaas = ''
      )
    )
    AND(
      perk.alur_perkara_id >= 1
      AND perk.alur_perkara_id <= 17
    )
    AND (
      (jadwalsidang.dihadiri_oleh <> 1)
      AND (
        jadwalsidang.dihadiri_oleh = 2
        AND (
          perkarapihak.pihakke = 2
          OR perkarapihak.pihakke = 4
        )
      )
      OR (
        jadwalsidang.dihadiri_oleh = 3
        AND perkarapihak.pihakke = 1
      )
      OR (
        jadwalsidang.dihadiri_oleh = 4
        OR jadwalsidang.dihadiri_oleh IS NULL
      )
    )
    AND DATEDIFF(CURRENT_DATE, sidang.tanggal_sidang) >= -5
    AND sidang.urutan = 1
  ORDER BY
    perk.perkara_id DESC,
    sidang.tanggal_sidang ASC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, tanggal sidang : ${r.tanggal_sidang}, nama_pihak : ${r.nama_pihak}, jurusita : ${r.jurusita}`
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

const getBelumEdocCourtCalendar = () => {
  return new Promise((resolve, reject) => {
    let date = new Date();
    let year = date.getFullYear();
    let query = `SELECT A.nomor_perkara, A.perkara_id, A.proses_terakhir_text, A.para_pihak FROM perkara AS A LEFT JOIN perkara_putusan AS C ON C.perkara_id=A.perkara_id LEFT JOIN perkara_edoc_calendar AS F ON F.perkara_id=A.perkara_id LEFT JOIN perkara_jadwal_sidang AS H ON H.perkara_id=A.perkara_id WHERE  YEAR(A.tanggal_pendaftaran) = ${year} AND C.tanggal_minutasi IS NULL AND H.dihadiri_oleh='1' AND TIMESTAMPDIFF(DAY,H.tanggal_sidang,NOW())>'0' AND (F.edoc_calender IS NULL OR F.edoc_calender = '') AND A.alur_perkara_id NOT IN (18,112,113,114) GROUP BY A.perkara_id ORDER BY A.tanggal_pendaftaran DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(`No Perkara : ${r.nomor_perkara}`);
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

const getDataBanding = () => {
  let query = `SELECT nomor_perkara_pn, permohonan_banding,  alur_perkara_id FROM v_perkara_banding WHERE pengiriman_berkas_banding IS NULL AND tanggal_cabut IS NULL`;

  return new Promise((resolve, reject) => {
    db.query(query, async (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            let jangka_waktu = 0;
            if (r.alur_perkara_id == 111) {
              jangka_waktu = 14;
            } else if (r.alur_perkara_id == 1 || r.alur_perkara_id == 7) {
              jangka_waktu = 30;
            }
            let tanggal_kirim = moment(r.permohonan_banding).add(
              jangka_waktu,
              "d"
            );
            resultArray.push(
              `Nomor perkara : ${
                r.nomor_perkara_pn
              }, tanggal banding : ${moment(r.permohonan_banding).format(
                "D-M-YYYY"
              )}, tanggal terakhir pengiriman = ${moment(tanggal_kirim).format(
                "D-M-YYYY"
              )}`
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

const getDataPK = () => {
  let query = `SELECT nomor_perkara_pn, permohonan_pk, alur_perkara_id, pendapat_hakim, penyerahan_kontra_pk FROM perkara_pk WHERE pengiriman_berkas_pk IS NULL AND tanggal_cabut IS NULL AND tidak_memenuhi_syarat IS NULL`;

  return new Promise((resolve, reject) => {
    db.query(query, async (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        //
        console.log(result);
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            let tanggal_kirim;
            if (r.alur_perkara_id == 111) {
              if (r.pendapat_hakim == null) {
                tanggal_kirim = "Pendapat Hakim belum diisi";
              } else {
                tanggal_kirim = `tanggal terakhir pengiriman = ${moment(
                  moment(r.pendapat_hakim).add(30, "d")
                ).format("D-M-YYYY")}`;
              }
            } else if (r.alur_perkara_id == 1 || r.alur_perkara_id == 7) {
              if (r.penyerahan_kontra_pk == null) {
                tanggal_kirim = "Kontra memori PK belum diterima";
              } else {
                tanggal_kirim = `tanggal terakhir pengiriman = ${moment(
                  moment(r.penyerahan_kontra_pk).add(30, "d")
                ).format("D-M-YYYY")}`;
              }
            }

            resultArray.push(
              `Nomor perkara : ${r.nomor_perkara_pn}, tanggal pk : ${moment(
                r.permohonan_pk
              ).format("D-M-YYYY")}, ${tanggal_kirim}`
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

const getDataEdocPetitum = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, petitum_dok, tanggal_pendaftaran FROM perkara WHERE YEAR(tanggal_pendaftaran)=2022 AND (alur_perkara_id =1 OR alur_perkara_id =2 OR alur_perkara_id =8 ) AND petitum_dok = " "`;

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
              }, 'Tanggal pendaftaran : ${moment(r.tanggal_pendaftaran).format(
                "D-M-YYYY"
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

const getDataEdocDakwaan = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, petitum_dok, tanggal_pendaftaran FROM perkara WHERE YEAR(tanggal_pendaftaran)=2022 AND (alur_perkara_id =111 OR alur_perkara_id =112 OR alur_perkara_id =113 OR alur_perkara_id =118 ) AND dakwaan_dok = " "`;

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
              }, 'Tanggal pendaftaran : ${moment(r.tanggal_pendaftaran).format(
                "D-M-YYYY"
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

const getDataEdocAnonimisasi = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, tanggal_putusan FROM perkara_putusan LEFT JOIN perkara ON perkara_putusan.perkara_id = perkara.perkara_id WHERE YEAR(tanggal_putusan)=YEAR(CURDATE()) AND tanggal_putusan IS NOT NULL AND (jenis_perkara_nama = "Perceraian" OR jenis_perkara_nama = "Permohonan Pengangkatan Anak" OR jenis_perkara_nama = "Wasiat" OR jenis_perkara_nama = "Kejahatan Terhadap Kesusilaan" OR jenis_perkara_nama = "Kekerasan Dalam Rumah Tangga" OR alur_perkara_id =118) AND amar_putusan_anonimisasi_dok IS NULL`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `Nomor perkara : ${r.nomor_perkara}, 'Tanggal putusan : ${moment(
                r.tanggal_putusan
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
  });
};

const getDataBelumDelegasi = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT delegasi_masuk.id, nomor_perkara, tgl_relaas, delegasi_masuk.diinput_tanggal FROM delegasi_masuk LEFT JOIN delegasi_proses_masuk ON delegasi_masuk.id=delegasi_proses_masuk.delegasi_id WHERE YEAR(delegasi_masuk.diinput_tanggal) >= 2022 AND (tgl_relaas IS NULL OR tgl_relaas = "")  ORDER BY delegasi_masuk.id DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;

        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `Nomor perkara : ${r.nomor_perkara}, 'Tanggal masuk : ${moment(
                r.diinput_tanggal
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
  });
};

const getDataKasasi = () => {
  let query = `SELECT nomor_perkara_pn, permohonan_kasasi, alur_perkara_id FROM perkara_kasasi WHERE pengiriman_berkas_kasasi IS NULL AND tanggal_cabut IS NULL AND tidak_memenuhi_syarat IS NULL AND YEAR(permohonan_kasasi)>2021`;

  return new Promise((resolve, reject) => {
    db.query(query, async (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            let tanggal_kirim;
            if (r.alur_perkara_id == 1 || r.alur_perkara_id == 1) {
              tanggal_kirim = moment(r.permohonan_kasasi).add(65, "d");
            } else {
              tanggal_kirim = moment(r.permohonan_kasasi).add(30, "d");
            }
            resultArray.push(
              `Nomor perkara : ${r.nomor_perkara_pn}, tanggal kasasi : ${moment(
                r.permohonan_kasasi
              ).format("D-M-YYYY")}, tanggal terakhir pengiriman = ${moment(
                tanggal_kirim
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

const getDataPublikasi = () => {
  let query = `SELECT nomor_perkara, tanggal_pendaftaran, jenis_perkara_nama FROM perkara WHERE ((jenis_perkara_id IN (64,65,63,83,88,98,130,200,293,354,248) AND pihak_dipublikasikan='Y') OR (jenis_perkara_id NOT IN (64,65,63,83,88,98,130,200,293,354,248) AND pihak_dipublikasikan='T' AND alur_perkara_id !=118) OR (alur_perkara_id=118 AND pihak_dipublikasikan='Y')) AND YEAR(tanggal_pendaftaran)>=2022`;

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
              `Nomor perkara : ${
                r.nomor_perkara
              }, tanggal pendaftaran : ${moment(r.tanggal_pendaftaran).format(
                "D-M-YYYY"
              )}, jenis perkara : ${r.jenis_perkara_nama}`
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

const getDataVerstek = () => {
  let query = `SELECT a.perkara_id, nomor_perkara, DATE_FORMAT(tanggal_putusan, '%d-%m-%Y') as tanggal_putusan, hakim_nama, panitera_nama FROM perkara a JOIN perkara_panitera_pn b ON a.perkara_id=b.perkara_id JOIN perkara_hakim_pn as c ON a.perkara_id=c.perkara_id JOIN perkara_putusan as d ON a.perkara_id=d.perkara_id WHERE LOCATE('verstek',amar_putusan)>0 AND jabatan_hakim_id=1 AND (alur_perkara_id=1 OR alur_perkara_id=7) AND YEAR(tanggal_pendaftaran)>=2023 AND tanggal_putusan IS NOT NULL AND putusan_verstek='T'`;

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
              `Nomor perkara : ${r.nomor_perkara}, tanggal putusan : ${r.tanggal_putusan}, KM : ${r.hakim_nama}, PP : ${r.panitera_nama}`
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

// getDataVerstek().then((res) => console.log(res));
module.exports = {
  getDataPenahanan,
  getDataBA,
  getDataPutusanBelumMinut,
  getDataBelumBhtPidana,
  getDataBelumBhtPerdata,
  getDataBelumSerahHukum,
  getDataTundaJadwalSidang,
  getDataSaksiTidakLengkap,
  getDataPutusanBelumBeritahuNew,
  getDataJadwalSidangPidana,
  getDataJadwalSidangPerdata,
  getDataJadwalMediasi,
  getDataSisaPanjarPn,
  getDataSisaPanjarBanding,
  getDataSisaPanjarKasasi,
  getDataCourtCalendar,
  getStatistik,
  getBelumBhtBanding,
  getBelumBhtKasasi,
  getBelumPanggilan,
  getBelumEdocCourtCalendar,
  getDataBanding,
  getDataKasasi,
  getDataPK,
  getDataEdocPetitum,
  getDataEdocDakwaan,
  getDataEdocAnonimisasi,
  getDataBelumDelegasi,
  getDataPublikasi,
  getDataVerstek,
};
