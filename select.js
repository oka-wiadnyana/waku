const puppeteer = require("puppeteer");
const moment = require("moment");

// let month = moment().format("MM");
// let lastMonth = moment().subtract(1, "month").format("MM");

// let year = moment().format("YYYY");

let getSkorBulanan = async () => {
  let month = moment().format("MM");

  let year = moment().format("YYYY");
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  console.log(month, year);

  try {
    await page.goto("http://evaluasi.badilum.mahkamahagung.go.id/evaluasi", {
      waitUntil: "networkidle0",
      timeout: 0,
    });
    await page.waitForSelector(
      ".table.table-hover.table-striped.table-td-valign-middle.mx-auto.w-auto",
      {
        visible: true,
      }
    );
    await page.select("select#kategori", "1");
    await page.select("select#kelas", "4");
    await page.select("select#bulan_awal", month);
    await page.select("select#tahun_awal", year);
    await page.select("select#bulan_akhir", month);
    await page.select("select#tahun_akhir", year);

    const [button] = await page.$x("//button[contains(., 'CARI')]");

    if (button) {
      await button.click();
    }

    await new Promise((r) => setTimeout(r, 5000));

    const rows = await page.$$("#TabelData tbody tr");

    let responseMessage;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const pn = await row.$eval(
        "td:nth-child(4) div a",
        (element) => element.textContent
      );

      const nomor = await row.$eval(
        "td:nth-child(1) div",
        (element) => element.textContent
      );

      const nilai = await row.$eval(
        "td:nth-child(9) div b",
        (element) => element.textContent
      );

      if (pn === "Pengadilan Negeri Negara") {
        responseMessage = `Peringkat: ${nomor} \nSkor: ${nilai}`;
      }
    }
    await browser.close();
    return responseMessage;
  } catch (error) {
    responseMessage = "Koneksi ke EIS terputus";
    await browser.close();
    return responseMessage;
  }
};

let getSkorBulanLalu = async () => {
  let month = moment().format("MM");
  let lastMonth = moment().subtract(1, "month").format("MM");

  let year = moment().format("YYYY");
  if (month == "01") {
    lastMonth = "12";
    year = moment().subtract(1, "year").format("YYYY");
  } else {
    lastMonth = moment().subtract(1, "month").format("MM");
    year = moment().format("YYYY");
  }
  console.log(month, lastMonth, year);
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  try {
    await page.goto("http://evaluasi.badilum.mahkamahagung.go.id/evaluasi", {
      waitUntil: "networkidle0",
      timeout: 0,
    });
    await page.waitForSelector(
      ".table.table-hover.table-striped.table-td-valign-middle.mx-auto.w-auto",
      {
        visible: true,
      }
    );
    await page.select("select#kategori", "1");
    await page.select("select#kelas", "4");
    await page.select("select#bulan_awal", lastMonth);
    await page.select("select#tahun_awal", year);
    await page.select("select#bulan_akhir", lastMonth);
    await page.select("select#tahun_akhir", year);

    const [button] = await page.$x("//button[contains(., 'CARI')]");
    if (button) {
      await button.click();
    }

    await new Promise((r) => setTimeout(r, 5000));

    const rows = await page.$$("#TabelData tbody tr");

    let responseMessage;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const pn = await row.$eval(
        "td:nth-child(4) div a",
        (element) => element.textContent
      );

      const nomor = await row.$eval(
        "td:nth-child(1) div",
        (element) => element.textContent
      );

      const nilai = await row.$eval(
        "td:nth-child(9) div b",
        (element) => element.textContent
      );

      if (pn === "Pengadilan Negeri Negara") {
        responseMessage = `Peringkat: ${nomor} \nSkor: ${nilai}`;
      }
    }
    await browser.close();
    return responseMessage;
  } catch (error) {
    responseMessage = "Koneksi ke EIS terputus";
    await browser.close();
    return responseMessage;
  }
};

let getSkorTahunanKelas = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  try {
    await page.goto("http://evaluasi.badilum.mahkamahagung.go.id/evaluasi", {
      waitUntil: "networkidle0",
      timeout: 0,
    });
    await page.waitForSelector(
      ".table.table-hover.table-striped.table-td-valign-middle.mx-auto.w-auto",
      {
        visible: true,
      }
    );
    await page.select("select#kategori", "1");
    await page.select("select#kelas", "4");
    // await page.select("select#bulan_awal", month);
    // await page.select("select#tahun_awal", year);
    // await page.select("select#bulan_akhir", month);
    // await page.select("select#tahun_akhir", year);

    const [button] = await page.$x("//button[contains(., 'CARI')]");
    if (button) {
      await button.click();
    }

    await new Promise((r) => setTimeout(r, 5000));

    const rows = await page.$$("#TabelData tbody tr");

    let responseMessage;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const pn = await row.$eval(
        "td:nth-child(4) div a",
        (element) => element.textContent
      );

      const nomor = await row.$eval(
        "td:nth-child(1) div",
        (element) => element.textContent
      );

      const nilai = await row.$eval(
        "td:nth-child(9) div b",
        (element) => element.textContent
      );

      if (pn === "Pengadilan Negeri Negara") {
        responseMessage = `Peringkat: ${nomor} \nSkor: ${nilai}`;
      }
    }
    await browser.close();
    return responseMessage;
  } catch (error) {
    responseMessage = "Koneksi ke EIS terputus";
    await browser.close();
    return responseMessage;
  }
};

let getDataTahunan = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  try {
    await page.goto("http://evaluasi.badilum.mahkamahagung.go.id/evaluasi", {
      waitUntil: "networkidle0",
      timeout: 0,
    });

    const rows = await page.$$("#TabelData tbody tr");
    let responseMessage;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const pn = await row.$eval(
        "td:nth-child(4) div a",
        (element) => element.textContent
      );

      const nomor = await row.$eval(
        "td:nth-child(1) div",
        (element) => element.textContent
      );

      const nilai = await row.$eval(
        "td:nth-child(9) div b",
        (element) => element.textContent
      );

      if (pn === "Pengadilan Negeri Negara") {
        responseMessage = `Peringkat: ${nomor} \nSkor: ${nilai}`;
      }
    }

    await browser.close();
    return responseMessage;
  } catch (error) {
    responseMessage = "Koneksi ke EIS terputus";
    await browser.close();
    return responseMessage;
  }
};

// getSkorBulanan().then((res) => console.log(res));

module.exports = {
  getSkorBulanan,
  getSkorBulanLalu,
  getSkorTahunanKelas,
  getDataTahunan,
};
