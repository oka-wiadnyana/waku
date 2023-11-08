// inisisalisasi database
const mysql = require("mysql");
const db = mysql.createPool({
  // sesuaikan konfigurasi dengan server
  host: "localhost",
  user: "root",
  password: "",
  database: "amora",
});

var striptags = require("striptags");

const getMaxArticle = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_seri FROM seri_ziarticle`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0].nomor_seri);
      }
    });
  });
};
// console.log(stripHtml(`Some text <b>and</b> text.`).result);

const getArticle = (seri) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM ziarticles WHERE nomor_seri=${seri}`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `*Artikel seri ${r.nomor_seri}* \n${striptags(r.article, [
                "strong",
              ])
                .replace(/<\/?strong>/gm, "*")
                .replace(/&(nbsp|amp|quot|lt|gt);/g, " ")
                .replace(
                  /(nbsp|amp|quot|lt|gt);/g,
                  " "
                )} \n\n#GoZI2022#CountDownToDE2023`
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

const getArticleLength = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT COUNT(article) as article_length FROM ziarticles`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0].article_length);
      }
    });
  });
};

const getRecentArticle = async () => {
  let article_length = await getArticleLength();
  let no_seri = await getMaxArticle();

  let article = await getArticle(no_seri);
  let next_nomor = no_seri == article_length ? 1 : no_seri + 1;

  let query = `UPDATE seri_ziarticle SET nomor_seri=${next_nomor}`;

  db.query(query, (err, result) => {
    console.log(result);
  });

  return article;
};

// getRecentArticle().then((res) => console.log(res));
module.exports = getRecentArticle;
