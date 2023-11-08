const socketIO = require("socket.io");
var io2 = require("socket.io-client");
const qrcode = require("qrcode");
const http = require("http");
const fs = require("fs");
const {
  Client,
  Location,
  List,
  Buttons,
  LocalAuth,
} = require("whatsapp-web.js");
const qrcode2 = require("qrcode-terminal");
const figlet = require("figlet");
const cron = require("node-cron");
const getData = require("./query");
const groupNotif = require("./group-notif");
const mis = require("./mis");
const eis = require("./select");
const pengumuman = require("./pengumuman");
const absen = require("./absen");
const ptsp = require("./ptsp");
const detailPerkara = require("./detail");
const { getDataArsipBelum } = require("./notif-surat");
const article = require("./article-zi");
const express = require("express");
const bodyParser = require("body-parser");
var Pusher = require("pusher-client");
const PusherServer = require("pusher");
const { phoneNumberFormatter } = require("./helpers/formatter");
const { send } = require("process");
const router = express.Router();
const app = express();
const port = 3000;
const { chatWithGPT3 } = require("./gpt");

const server = http.createServer(app);
const io = socketIO(server);

// console log bot name
figlet("OKABOT", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("index.html", {
    root: __dirname,
  });
});

//inisiasi whatsapp

const client = new Client({
  puppeteer: {
    headless: false,
    args: [
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
  },
  // session is deprecated
  // session: sessionCfg,
  authStrategy: new LocalAuth(),
  qrTimeoutMs: 0,
});

const adminId = "6281337320205@c.us";
const groupId = "120363023416509037@g.us";
const socketUrl = "http://websocket.onsdeeapp.my.id:4141";

client.initialize();

client.on("qr", (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  // console.log("QR RECEIVED", qr);
  qrcode2.generate(qr, { small: true });
});

client.on("authenticated", (session) => {
  //saat diotentifikasi

  console.log("AUTHENTICATED");
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessfull
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  //saat wa sudah siap
  client.sendMessage(adminId, "Whatsapp is ready!");
  console.log("READY");
});

client.on("message", async (msg) => {
  // Pesan masuk dan keluar
  let chat = await msg.getChat();
  let message = msg.body.toLocaleLowerCase();
  let messageRaw = msg.body;
  let id = msg.from;

  console.log(`Checking message from ${id}`);
  let prefix = message.split("#");
  console.log(prefix[0]);

  if (chat.isGroup === false)
    if (prefix[0] == "detail") {
      detailPerkara(messageRaw).then((res) => {
        msg.reply(res);
      });
    } else if (prefix[0] == "ai") {
      chatWithGPT3(prefix[1]).then((res) => msg.reply(res));
    } else {
      getData(message).then((res) => {
        msg.reply(res);
      });
    }
});

// const groupId='6281337320205@c.us';

// method pengumuman
const sendPengumuman = async () => {
  try {
    let pengumumanMa = await pengumuman.getPengumumanMa();
    let pengumumanBadilum = await pengumuman.getPengumumanBadilum();
    let pengumumanPt = await pengumuman.getPengumumanPt();
    let msg = `*Pengumuman Mahkamah Agung* \n${pengumumanMa} \n\n*Pengumuman Badilum* \n${pengumumanBadilum} \n\n*Pengumuman PT Denpasar* \n${pengumumanPt} `;
    return msg;
  } catch (error) {
    console.log(error);
  }
};

cron.schedule("00 09 * * *", () => {
  sendPengumuman().then((res) => {
    client.sendMessage(groupId, res);
  });
});

cron.schedule("00 16 * * *", () => {
  sendPengumuman().then((res) => {
    client.sendMessage(groupId, res);
  });
});

// first notif function
const sendGroupFirst = async () => {
  try {
    let eisBulanan = await eis.getSkorBulanan();
    let eisBulanLalu = await eis.getSkorBulanLalu();
    let eisTahunan = await eis.getDataTahunan();
    let eisTahunanKategori = await eis.getSkorTahunanKelas();
    let promisePenahanan = groupNotif.getDataPenahanan();
    let messagePenahanan = await promisePenahanan;
    let promiseBA = groupNotif.getDataBA();
    let messageBA = await promiseBA;
    let promisePutusanBelumMinut = groupNotif.getDataPutusanBelumMinut();
    let messagePutusanBelumMinut = await promisePutusanBelumMinut;
    let promiseBelumBhtPidana = groupNotif.getDataBelumBhtPidana();
    let messageBelumBhtPidana = await promiseBelumBhtPidana;
    let promiseBelumBhtPerdata = groupNotif.getDataBelumBhtPerdata();
    let messageBelumBhtPerdata = await promiseBelumBhtPerdata;
    let promiseBelumSerahHukum = groupNotif.getDataBelumSerahHukum();
    let messageBelumSerahHukum = await promiseBelumSerahHukum;
    let promiseTundaJadwalSidang = groupNotif.getDataTundaJadwalSidang();
    let messageTundaJadwalSidang = await promiseTundaJadwalSidang;
    let promiseSaksiTidakLengkap = groupNotif.getDataSaksiTidakLengkap();
    let messageSaksiTidakLengkap = await promiseSaksiTidakLengkap;
    let promisePutusanBelumBeritahu =
      groupNotif.getDataPutusanBelumBeritahuNew();
    let messagePutusanBelumBeritahu = await promisePutusanBelumBeritahu;
    let promiseJadwalSidangPidana = groupNotif.getDataJadwalSidangPidana();
    let messageJadwalSidangPidana = await promiseJadwalSidangPidana;
    let promiseJadwalSidangPerdata = groupNotif.getDataJadwalSidangPerdata();
    let messageJadwalSidangPerdata = await promiseJadwalSidangPerdata;
    let promiseJadwalMediasi = groupNotif.getDataJadwalMediasi();
    let messageJadwalMediasi = await promiseJadwalMediasi;
    let promiseSisaPanjarPn = groupNotif.getDataSisaPanjarPn();
    let messageSisaPanjarPn = await promiseSisaPanjarPn;
    let promiseSisaPanjarBanding = groupNotif.getDataSisaPanjarBanding();
    let messageSisaPanjarBanding = await promiseSisaPanjarBanding;
    let promiseSisaPanjarKasasi = groupNotif.getDataSisaPanjarKasasi();
    let messageSisaPanjarKasasi = await promiseSisaPanjarKasasi;
    let promiseDataCourtCalendar = groupNotif.getDataCourtCalendar();
    let messageDataCourtCalendar = await promiseDataCourtCalendar;
    let promiseStatistik = groupNotif.getStatistik();
    let messageStatistik = await promiseStatistik;
    let promiseBelumBhtBanding = groupNotif.getBelumBhtBanding();
    let messageBelumBhtBanding = await promiseBelumBhtBanding;
    let promiseBelumBhtKasasi = groupNotif.getBelumBhtKasasi();
    let messageBelumBhtKasasi = await promiseBelumBhtKasasi;
    let promiseBelumPanggilan = groupNotif.getBelumPanggilan();
    let messageBelumPanggilan = await promiseBelumPanggilan;
    let promiseBelumEdocCC = groupNotif.getBelumEdocCourtCalendar();
    let messageBelumEdocCC = await promiseBelumEdocCC;
    let promiseDatabanding = groupNotif.getDataBanding();
    let messageDataBanding = await promiseDatabanding;
    let promiseDataKasasi = groupNotif.getDataKasasi();
    let messageDataKasasi = await promiseDataKasasi;
    let promiseDataPK = groupNotif.getDataPK();
    let messageDataPK = await promiseDataPK;
    let promiseDataPetitum = groupNotif.getDataEdocPetitum();
    let messageDataPetitum = await promiseDataPetitum;
    let promiseDataDakwaan = groupNotif.getDataEdocDakwaan();
    let messageDataDakwaan = await promiseDataDakwaan;
    let promiseDataEdocAnonimisasi = groupNotif.getDataEdocAnonimisasi();
    let messageDataAnonimisasi = await promiseDataEdocAnonimisasi;
    let promiseDataBelumDelegasi = groupNotif.getDataBelumDelegasi();
    let messageDataBelumDelegasi = await promiseDataBelumDelegasi;
    let promiseDataPublikasi = groupNotif.getDataPublikasi();
    let messageDataPublikasi = await promiseDataPublikasi;
    let promiseDataVerstek = groupNotif.getDataVerstek();
    let messageDataVerstek = await promiseDataVerstek;

    let msg = `*Data dari pesan ini diambil dari database SIPP dan hanya sebagai pengingat. _Data perkara yang muncul tidak selalu karena belum diinput, namun juga  karena masih sedang dalam proses (dalam waktu yang masih dibenarkan)_* \n\n*Nilai Eis Tahun ini* : \n${eisTahunan} \n\n*Nilai Eis Tahun ini Kategori kelas II 1 ~ 500 perkara* : \n${eisTahunanKategori} \n\n*Nilai Eis Bulan ini* : \n${eisBulanan}  \n\n*Nilai Eis Bulan lalu* : \n${eisBulanLalu} \n\n*Statistik Penanganan Perkara Tahun ini (tidak termasuk perkara tilang)  :* \n${messageStatistik} \n\n*Data delegasi belum dilaksanakan* : \n${messageDataBelumDelegasi} \n\n*Data penahanan yang habis dalam 15 hari* : \n${messagePenahanan} \n\n*Data Putusan yang belum diminutasi* : \n${messagePutusanBelumMinut} \n\n*Data perkara pidana yang belum berisi tanggal BHT* : \n${messageBelumBhtPidana} \n\n*Data perkara perdata yang belum berisi tanggal BHT* : \n${messageBelumBhtPerdata} \n\n*Data perkara banding yang belum berisi tanggal BHT* : \n${messageBelumBhtBanding} \n\n*Data perkara kasasi yang belum berisi tanggal BHT* : \n${messageBelumBhtKasasi} \n\n*Data perkara yang data saksi tidak lengkap* : \n${messageSaksiTidakLengkap} \n\n*Data perkara sudah putus yang belum diberitahukan* : \n${messagePutusanBelumBeritahu} \n\n*Data banding belum dikirim* : \n${messageDataBanding} \n\n*Data kasasi belum dikirm* : \n${messageDataKasasi} \n\n*Data PK belum dikirim* : \n${messageDataPK} \n\n*Perkara Perdata belum berisi Edoc Petitum* : \n${messageDataPetitum} \n\n*Perkara Pidana belum berisi Edoc Dakwaan* : \n${messageDataDakwaan} \n\n*Perkara Publikasi tidak sesuai* : \n${messageDataPublikasi}\n\n*Perkara Putusan Belum Anonimisasi* : \n${messageDataAnonimisasi}   \n\n*Jadwal sidang pidana hari ini* : \n${messageJadwalSidangPidana} \n\n*Jadwal sidang perdata hari ini* : \n${messageJadwalSidangPerdata} \n\n*Jadwal mediasi hari ini* : \n${messageJadwalMediasi} \n\n*Panggilan belum dilaksanakan/Relas belum diupload* : \n${messageBelumPanggilan} \n\n*Sisa panjar perkara tingkat pertama yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarPn} \n\n*Sisa panjar perkara tingkat banding yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarBanding} \n\n*Sisa panjar perkara tingkat kasasi yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarKasasi} \n\n*Data perkara yang belum upload BA* : \n${messageBA} \n\n*Data perkara yang belum diserahkan ke bagian hukum* : \n${messageBelumSerahHukum} \n\n*Data perkara yang belum belum terdapat data court calendar sampai putusan/penetapan* : \n${messageDataCourtCalendar} \n\n*Edoc court calendar belum upload* : \n${messageBelumEdocCC} \n\n*Jenis putusan verstek tidak sesuai* : \n${messageDataVerstek}`;

    return msg;
  } catch (error) {
    console.log(error);
  }
};
cron.schedule("38 08 * * *", () => {
  sendGroupFirst().then((res) => {
    client.sendMessage(groupId, res);
  });
});

// second notif function
const sendGroupSecond = async () => {
  try {
    let eisBulanan = await eis.getSkorBulanan();
    let eisBulanLalu = await eis.getSkorBulanLalu();
    let eisTahunan = await eis.getDataTahunan();
    let eisTahunanKategori = await eis.getSkorTahunanKelas();
    let promisePenahanan = groupNotif.getDataPenahanan();
    let messagePenahanan = await promisePenahanan;
    let promiseBA = groupNotif.getDataBA();
    let messageBA = await promiseBA;
    let promisePutusanBelumMinut = groupNotif.getDataPutusanBelumMinut();
    let messagePutusanBelumMinut = await promisePutusanBelumMinut;
    let promiseBelumBhtPidana = groupNotif.getDataBelumBhtPidana();
    let messageBelumBhtPidana = await promiseBelumBhtPidana;
    let promiseBelumBhtPerdata = groupNotif.getDataBelumBhtPerdata();
    let messageBelumBhtPerdata = await promiseBelumBhtPerdata;
    let promiseBelumSerahHukum = groupNotif.getDataBelumSerahHukum();
    let messageBelumSerahHukum = await promiseBelumSerahHukum;
    let promiseTundaJadwalSidang = groupNotif.getDataTundaJadwalSidang();
    let messageTundaJadwalSidang = await promiseTundaJadwalSidang;
    let promiseSaksiTidakLengkap = groupNotif.getDataSaksiTidakLengkap();
    let messageSaksiTidakLengkap = await promiseSaksiTidakLengkap;
    let promisePutusanBelumBeritahu =
      groupNotif.getDataPutusanBelumBeritahuNew();
    let messagePutusanBelumBeritahu = await promisePutusanBelumBeritahu;
    let promiseJadwalSidangPidana = groupNotif.getDataJadwalSidangPidana();
    let messageJadwalSidangPidana = await promiseJadwalSidangPidana;
    let promiseJadwalSidangPerdata = groupNotif.getDataJadwalSidangPerdata();
    let messageJadwalSidangPerdata = await promiseJadwalSidangPerdata;
    let promiseJadwalMediasi = groupNotif.getDataJadwalMediasi();
    let messageJadwalMediasi = await promiseJadwalMediasi;
    let promiseSisaPanjarPn = groupNotif.getDataSisaPanjarPn();
    let messageSisaPanjarPn = await promiseSisaPanjarPn;
    let promiseSisaPanjarBanding = groupNotif.getDataSisaPanjarBanding();
    let messageSisaPanjarBanding = await promiseSisaPanjarBanding;
    let promiseSisaPanjarKasasi = groupNotif.getDataSisaPanjarKasasi();
    let messageSisaPanjarKasasi = await promiseSisaPanjarKasasi;
    let promiseDataCourtCalendar = groupNotif.getDataCourtCalendar();
    let messageDataCourtCalendar = await promiseDataCourtCalendar;
    let promiseStatistik = groupNotif.getStatistik();
    let messageStatistik = await promiseStatistik;
    let promiseBelumBhtBanding = groupNotif.getBelumBhtBanding();
    let messageBelumBhtBanding = await promiseBelumBhtBanding;
    let promiseBelumBhtKasasi = groupNotif.getBelumBhtKasasi();
    let messageBelumBhtKasasi = await promiseBelumBhtKasasi;
    let promiseBelumPanggilan = groupNotif.getBelumPanggilan();
    let messageBelumPanggilan = await promiseBelumPanggilan;
    let promiseBelumEdocCC = groupNotif.getBelumEdocCourtCalendar();
    let messageBelumEdocCC = await promiseBelumEdocCC;

    let promiseDatabanding = groupNotif.getDataBanding();
    let messageDataBanding = await promiseDatabanding;
    let promiseDataKasasi = groupNotif.getDataKasasi();
    let messageDataKasasi = await promiseDataKasasi;
    let promiseDataPK = groupNotif.getDataPK();
    let messageDataPK = await promiseDataPK;
    let promiseDataPetitum = groupNotif.getDataEdocPetitum();
    let messageDataPetitum = await promiseDataPetitum;
    let promiseDataDakwaan = groupNotif.getDataEdocDakwaan();
    let messageDataDakwaan = await promiseDataDakwaan;
    let promiseDataEdocAnonimisasi = groupNotif.getDataEdocAnonimisasi();
    let messageDataAnonimisasi = await promiseDataEdocAnonimisasi;
    let promiseDataBelumDelegasi = groupNotif.getDataBelumDelegasi();
    let messageDataBelumDelegasi = await promiseDataBelumDelegasi;
    let promiseDataPublikasi = groupNotif.getDataPublikasi();
    let messageDataPublikasi = await promiseDataPublikasi;
    let promiseDataVerstek = groupNotif.getDataVerstek();
    let messageDataVerstek = await promiseDataVerstek;

    let msg = `*Data dari pesan ini diambil dari database SIPP dan hanya sebagai pengingat. _Data perkara yang muncul tidak selalu karena belum diinput, namun juga  karena masih sedang dalam proses (dalam waktu yang masih dibenarkan)_* \n\n*Nilai Eis Tahun ini* : \n${eisTahunan} \n\n*Nilai Eis Tahun ini Kategori kelas II 1 ~ 500 perkara* : \n${eisTahunanKategori} \n\n*Nilai Eis Bulan ini* : \n${eisBulanan} \n\n*Nilai Eis Bulan lalu* : \n${eisBulanLalu} \n\n*Statistik Penanganan Perkara Tahun ini (tidak termasuk perkara tilang)  :* \n${messageStatistik}  \n\n*Data delegasi belum dilaksanakan* : \n${messageDataBelumDelegasi} \n\n*Data penahanan yang habis dalam 15 hari* : \n${messagePenahanan} \n\n*Data Putusan yang belum diminutasi* : \n${messagePutusanBelumMinut} \n\n*Data perkara pidana yang belum berisi tanggal BHT* : \n${messageBelumBhtPidana} \n\n*Data perkara perdata yang belum berisi tanggal BHT* : \n${messageBelumBhtPerdata} \n\n*Data perkara banding yang belum berisi tanggal BHT* : \n${messageBelumBhtBanding} \n\n*Data perkara kasasi yang belum berisi tanggal BHT* : \n${messageBelumBhtKasasi} \n\n*Data perkara yang data saksi tidak lengkap* : \n${messageSaksiTidakLengkap} \n\n*Data perkara sudah putus yang belum diberitahukan* : \n${messagePutusanBelumBeritahu} \n\n*Data banding belum dikirim* : \n${messageDataBanding} \n\n*Data kasasi belum dikirm* : \n${messageDataKasasi} \n\n*Data PK belum dikirim* : \n${messageDataPK}  \n\n*Perkara Perdata belum berisi Edoc Petitum* : \n${messageDataPetitum} \n\n*Perkara Publikasi tidak sesuai* : \n${messageDataPublikasi} \n\n*Perkara Pidana belum berisi Edoc Dakwaan* : \n${messageDataDakwaan} \n\n*Perkara Putusan Belum Anonimisasi* : \n${messageDataAnonimisasi} \n\n*Perkara yang belum dilakukan penundaan* : \n${messageTundaJadwalSidang} \n\n*Jadwal sidang pidana hari ini* : \n${messageJadwalSidangPidana} \n\n*Jadwal sidang perdata hari ini* : \n${messageJadwalSidangPerdata} \n\n*Jadwal mediasi hari ini* : \n${messageJadwalMediasi} \n\n*Panggilan belum dilaksanakan/Relas belum diupload* : \n${messageBelumPanggilan} \n\n*Sisa panjar perkara tingkat pertama yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarPn} \n\n*Sisa panjar perkara tingkat banding yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarBanding} \n\n*Sisa panjar perkara tingkat kasasi yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarKasasi} \n\n*Data perkara yang belum upload BA* : \n${messageBA} \n\n*Data perkara yang belum diserahkan ke bagian hukum* : \n${messageBelumSerahHukum} \n\n*Data perkara yang belum belum terdapat data court calendar sampai putusan/penetapan* : \n${messageDataCourtCalendar} \n\n*Edoc court calendar belum upload* : \n${messageBelumEdocCC}  \n\n*Jenis putusan verstek tidak sesuai* : \n${messageDataVerstek}`;
    return msg;
  } catch (error) {
    console.log(error);
  }
};

// second notif
cron.schedule("35 15 * * *", () => {
  sendGroupSecond().then((res) => {
    client.sendMessage(groupId, res);
  });
});

// third notif
cron.schedule("30 19 * * *", () => {
  sendGroupSecond().then((res) => {
    client.sendMessage(groupId, res);
  });
});

cron.schedule("55 14 * * *", () => {
  sendGroupSecond().then((res) => {
    client.sendMessage(groupId, res);
  });
});

//Peringantan absen sore Senin-Kamis
cron.schedule("30 16 * * Monday-Thursday", () => {
  client.sendMessage(
    groupId,
    "Selamat sore Bapak/Ibu semuanya, silahkan melakukan absen pulang di pos absen!!"
  );
});

//Peringantan absen sore Jumat
cron.schedule("30 16 * * Friday", () => {
  client.sendMessage(
    groupId,
    "Selamat sore Bapak/Ibu semuanya, silahkan melakukan absen pulang dan absen apel di pos absen!!"
  );
});

//Peringantan absen pagi Senin
cron.schedule("15 07 * * Monday", () => {
  client.sendMessage(
    groupId,
    "Selamat pagi Bapak/Ibu semuanya, silahkan melakukan absen kehadiran dan absen apel di pos absen!!"
  );
});

//Peringantan absen pagi Selasa-Kamis

cron.schedule("15 07 * * Tuesday-Thursday", () => {
  client.sendMessage(
    groupId,
    "Selamat pagi Bapak/Ibu semuanya, silahkan melakukan absen kehadiran di pos absen!!"
  );
});

//Peringantan absen pagi Jumat
cron.schedule("45 06 * * Friday", () => {
  client.sendMessage(
    groupId,
    "Selamat pagi Bapak/Ibu semuanya, silahkan melakukan absen kehadiran di pos absen!!"
  );
});

// Notif Arsip Surat
const sendNotifSurat = async () => {
  try {
    let notifSurat = await getDataArsipBelum();

    let msg = `*Arsip surat yang belum dikumpulkan ke bagian umum* : \n${notifSurat}`;
    return msg;
  } catch (error) {
    console.log(error);
  }
};

cron.schedule("15 08 * * Monday-Friday", () => {
  sendNotifSurat().then((res) => {
    client.sendMessage(groupId, res);
    // client.sendMessage("6281337320205@g.us", res);
  });
});

// Notif Artikel ZI
const sendArticleZi = async () => {
  try {
    let article_zi = await article();

    return article_zi;
  } catch (error) {
    console.log(error);
  }
};

cron.schedule("00 10 * * Monday-Friday", () => {
  sendArticleZi().then((res) => {
    client.sendMessage(groupId, res);
  });
});

// absen pagi
cron.schedule("55 07 * * Monday-Friday", () => {
  absen.getDataMasuk().then((res) => {
    client.sendMessage(groupId, res);
  });
});
// absen sore
cron.schedule("00 17 * * *", () => {
  absen.getDataKeluar().then((res) => {
    client.sendMessage(groupId, res);
  });
});

cron.schedule("00 17 * * Monday-Friday", () => {
  absen.getDataKeluar().then((res) => {
    client.sendMessage(groupId, res);
  });
});

// surat ptsp pagi
cron.schedule("05 08 * * Monday-Friday", () => {
  ptsp.getDataSurat().then((res) => {
    client.sendMessage(groupId, res);
  });
});

// surat ptsp sora
cron.schedule("45 15 * * Monday-Friday", () => {
  ptsp.getDataSurat().then((res) => {
    client.sendMessage(groupId, res);
  });
});

client.on("change_battery", (batteryInfo) => {
  // Battery percentage for attached device has changed
  const { battery, plugged } = batteryInfo;
  console.log(`Battery: ${battery}% - Charging? ${plugged}`);
});

client.on("change_state", (state) => {
  // Client state change
  console.log("CHANGE STATE", state);
});

// whatsapp api
app.post("/send-message", async (req, res) => {
  console.log(req.body);
});

app.get("/send-message/:number/:message", async (req, res) => {
  let numberRaw = req.params.number;
  let numberId = `62${numberRaw.substring(1, 20)}@c.us`;
  let message = req.params.message;

  let split = message.split("+");
  let fix_message = split.join(" ");

  client
    .sendMessage(numberId, fix_message)
    .then((response) => {
      res.status(200).json({
        status: true,
        response: response,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        response: err,
      });
    });
});

app.get("/send-message-group/:number/:message", async (req, res) => {
  let numberRaw = req.params.number;
  let numberId = req.params.number;
  let message = req.params.message;

  let split = message.split("+");
  let fix_message = split.join(" ");

  client
    .sendMessage(numberId, fix_message)
    .then((response) => {
      res.status(200).json({
        status: true,
        response: response,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        response: err,
      });
    });
});

// pusher
const checkRegisteredNumber = async function (number) {
  const isRegistered = await client.isRegisteredUser(number);
  return isRegistered;
};

// app.use('/',router);

var socket2 = io2.connect(socketUrl, {
  reconnect: true,
});

// Add a connect listener
socket2.on("connect", () => {
  console.log(socket2.id); // x8WIv7-mJelg7on_ALbx
});

socket2.on("eptsp", async (arg) => {
  console.log(arg);
  console.log(arg.message);
  let data_message = JSON.parse(arg.message);
  let nomor_pemohon = phoneNumberFormatter(data_message.nomor_pemohon);

  let nomor_satker = phoneNumberFormatter(data_message.nomor_satker);

  const isRegisteredNumber = await checkRegisteredNumber(nomor_pemohon);
  if (!isRegisteredNumber) {
    client
      .sendMessage(
        nomor_satker,
        `${data_message.pesan_satker}, namun Nomor Handphone Pemohon tidak terdaftar sebagai nomor Whatsapp`
      )
      .then((response) => {
        console.log(nomor_satker);
      })
      .catch((err) => {
        console.log(err);
        // res.status(500).json({
        //   status: false,
        //   response: err,
        // });
      });

    return;
  }
  client
    .sendMessage(nomor_pemohon, data_message.pesan_pemohon)
    .then((response) => {
      console.log(nomor_pemohon);
    })
    .catch((err) => {
      console.log(err);
      // res.status(500).json({
      //   status: false,
      //   response: err,
      // });
    });

  await new Promise((r) => setTimeout(r, 5000));

  client
    .sendMessage(nomor_satker, data_message.pesan_satker)
    .then((response) => {
      console.log(nomor_satker);
    })
    .catch((err) => {
      console.log(err);
      // res.status(500).json({
      //   status: false,
      //   response: err,
      // });
    });
});

socket2.on("esimpatik", async (arg) => {
  console.log(arg);
  console.log(arg.message);
  let data_message = JSON.parse(arg.message);
  let nomor_tujuan = phoneNumberFormatter(data_message.nomor_tujuan);

  const isRegisteredNumber = await checkRegisteredNumber(nomor_tujuan);
  if (!isRegisteredNumber) {
    return;
  }
  client
    .sendMessage(nomor_tujuan, data_message.pesan)
    .then((response) => {
      console.log(nomor_tujuan);
    })
    .catch((err) => {
      console.log(err);
      // res.status(500).json({
      //   status: false,
      //   response: err,
      // });
    });
});

socket2.on("sikreta", async (arg) => {
  console.log(arg);

  // let data_message = JSON.parse(arg.message);
  // let nomor_tujuan = phoneNumberFormatter(data_message.nomor_tujuan);
  let pesan = arg;
  let split = pesan.split("+");
  let fix_message = split.join(" ");
  console.log(pesan);

  client
    .sendMessage(groupId, fix_message)
    .then((response) => {
      console.log(pesan);
    })
    .catch((err) => {
      console.log(err);
    });
});

server.listen(port, () => {
  console.log(`OKABOT listening at port ${port}`);
});
