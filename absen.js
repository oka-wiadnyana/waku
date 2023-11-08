const puppeteer = require("new-puppeteer");
const username = "197007271993031002";
const password = "12345678";

let getDataMasuk = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [`--window-size=1366,768`],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  try {
    await page.goto("https://sikep.mahkamahagung.go.id/site/login", {
      waitUntil: "networkidle0",
      timeout: 0,
    });

    await page.waitForSelector(".login-box-body", {
      visible: true,
    });

    await page.type("#loginform-username", "197007271993031002");
    await page.type("#loginform-password", "12345678");

    const [button] = await page.$x("//button[contains(@name, 'login-button')]");

    if (button) {
      await button.click();
    }

    await page.waitForNavigation();

    await page.goto(
      "https://sikep.mahkamahagung.go.id/laporan/absensi-online",
      {
        waitUntil: "networkidle0",
        timeout: 0,
      }
    );

    const rows = await page.$$(
      "#crud-datatable-container > table > tbody > tr"
    );

    let time = new Date();

    let responseMessage = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const nomor = await row.$eval(
        "td:nth-child(1)",
        (element) => element.textContent
      );
      const tanggal = await row.$eval(
        "td:nth-child(2)",
        (element) => element.textContent
      );
      const nama = await row.$eval(
        "td:nth-child(4)",
        (element) => element.textContent
      );
      const jamMasuk = await row.$eval(
        "td:nth-child(6)",
        (element) => element.textContent
      );

      if (jamMasuk == "-") {
        responseMessage.push(
          `No. ${nomor}, Nama : ${nama}, tanggal : ${tanggal}, jam absen : ${jamMasuk}`
        );
      }
    }
    await browser.close();
    const absen = responseMessage.join("\n-------------------\n");
    const message = `*Data ini  (belum absen, absen karena cuti, atau absen karena alasan lain) diambil pukul ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}* \n ${absen}`;
    console.log(message);
    return message;
  } catch (error) {
    console.log(error);
  }
};

let getDataKeluar = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [`--window-size=1366,768`],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  try {
    await page.goto("https://sikep.mahkamahagung.go.id/site/login", {
      waitUntil: "networkidle0",
      timeout: 0,
    });

    await page.waitForSelector(".login-box-body", {
      visible: true,
    });

    await page.type("#loginform-username", "198507202011011008");
    await page.type("#loginform-password", "suyitno1985");

    const [button] = await page.$x("//button[contains(@name, 'login-button')]");

    if (button) {
      await button.click();
    }

    await page.waitForNavigation();

    await page.goto(
      "https://sikep.mahkamahagung.go.id/laporan/absensi-online",
      {
        waitUntil: "networkidle0",
        timeout: 0,
      }
    );

    // const liAdministrasi = await page.waitForSelector("li.treeview a", {
    //   visible: true,
    // });

    // if (liAdministrasi) {
    //   await liAdministrasi.click();
    // }

    // const liPresensi = await page.waitForSelector(
    //   "body > div > aside > section > ul > li.treeview.menu-open > ul > li:nth-child(4)"
    // );

    // // console.log(liPresensi.length);
    // await liPresensi.click();

    // const laporan = await page.waitForSelector(
    //   "body > div > aside > section > ul > li.treeview.menu-open > ul > li.treeview.menu-open > ul > li > a"
    // );

    // await laporan.click();

    // await page.waitForNavigation({ timeout: 60000 });

    const rows = await page.$$(
      "#crud-datatable-container > table > tbody > tr"
    );

    let time = new Date();

    let responseMessage = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const nomor = await row.$eval(
        "td:nth-child(1)",
        (element) => element.textContent
      );
      const tanggal = await row.$eval(
        "td:nth-child(2)",
        (element) => element.textContent
      );
      const nama = await row.$eval(
        "td:nth-child(4)",
        (element) => element.textContent
      );

      const jamKeluar = await row.$eval(
        "td:nth-child(8)",
        (element) => element.textContent
      );

      if (jamKeluar == "-") {
        responseMessage.push(
          `No. ${nomor}, Nama : ${nama}, tanggal : ${tanggal}, jam absen : ${jamKeluar}`
        );
      }
    }

    await browser.close();
    const absen = responseMessage.join("\n-------------------\n");
    const message = `*Data ini (belum absen, absen karena cuti, atau absen karena alasan lain) diambil pukul ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}* \n ${absen}`;
    console.log(message);
    return message;
  } catch (error) {
    console.log(error);
  }
};

// getDataKeluar();

module.exports = {
  getDataMasuk,
  getDataKeluar,
};
