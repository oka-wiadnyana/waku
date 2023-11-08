// inisisalisasi database
const mysql = require("mysql");
const db = mysql.createPool({
  // sesuaikan konfigurasi dengan server
  host: "onsdeeapp.my.id",
  user: "onsdeeap_vio",
  password: "vio19092019",
  database: "onsdeeap_sikreta",
});

module.exports = db;
