const puppeteer = require("puppeteer");
const moment = require("moment");

let month = moment().format("MM");
let year = moment().format("YYYY");

let getPengumumanBadilum = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto("https://badilum.mahkamahagung.go.id/", {
      waitUntil: "networkidle0",
      timeout: 0,
    });
    await page.waitForSelector(".category-module.mod-list", {
      visible: true,
    });

    const rows = await page.$x(
      "//h3/span[text()='Pengumuman']/ancestor::h3/following-sibling::ul/li"
    );
    // console.log(rows);
    let responseMessage = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const pengumuman = await row.$eval("a", (element) => element.textContent);

      let tanggal = await row.$eval("span", (element) => element.textContent);
      let counter = 1;
      const replace = (str, numSpaces = 4) =>
        str.replaceAll("\t", "".repeat(numSpaces));

      const tanggal_fix = replace(tanggal);
      const tanggal_non = tanggal_fix.replace("\n", "");
      console.log(tanggal_non);

      responseMessage.push(
        `*${i + 1}.* *Pengumuman* : ${pengumuman}, *tanggal* : ${tanggal_non}`
      );
    }
    await browser.close();
    const message = responseMessage.join("\n");
    return message;
  } catch (error) {
    responseMessage = "Koneksi ke Badilum terputus";
    await browser.close();
    return responseMessage;
  }
};

let getPengumumanMa = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto("https://www.mahkamahagung.go.id/id", {
      waitUntil: "networkidle0",
      timeout: 0,
    });
    await page.waitForSelector(".w33p.pull-right", {
      visible: true,
    });

    const rows = await page.$x(
      "//h1/span[text()=' Pengumuman']/ancestor::h1/following-sibling::article"
    );
    // console.log(rows);
    let responseMessage = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const pengumuman = await row.$eval(
        "a .title",
        (element) => element.textContent
      );

      let tanggal = await row.$eval(
        "a .date",
        (element) => element.textContent
      );
      // let counter = 1;
      const replace = (str, numSpaces = 4) =>
        str.replaceAll("\t", "".repeat(numSpaces));

      const pengumuman_fix = replace(pengumuman);
      const pengumuman_non = pengumuman_fix.replace("\n", "");
      const tanggal_fix = replace(tanggal);
      const tanggal_non = tanggal_fix.replace("\n", "");

      responseMessage.push(
        `*${
          i + 1
        }.* *Pengumuman* : ${pengumuman_non}, *tanggal* : ${tanggal_non}`
      );
    }
    await browser.close();
    const message = responseMessage.join("\n");
    return message;
  } catch (error) {
    responseMessage = "Koneksi ke Mahkamah Agung terputus";
    await browser.close();
    return responseMessage;
  }
};

let getPengumumanPt = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto("http://www.pt-denpasar.go.id/new/", {
      waitUntil: "networkidle0",
      timeout: 0,
    });
    await page.waitForSelector(".bar.blockheader", {
      visible: true,
    });

    const rows = await page.$x(
      "//div/h3[text()='Pengumuman']/ancestor::div/following-sibling::h5"
    );
    // console.log(rows);
    let responseMessage = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const pengumuman = await row.$eval("a", (element) => element.textContent);

      const replace = (str, numSpaces = 4) =>
        str.replaceAll("\t", "".repeat(numSpaces));

      const pengumuman_fix = replace(pengumuman);
      const pengumuman_non = pengumuman_fix.replace("\n", "");

      responseMessage.push(`*${i + 1}.* *Pengumuman* : ${pengumuman_non}`);
    }
    await browser.close();
    const message = responseMessage.join("\n");
    return message;
  } catch (error) {
    responseMessage = "Koneksi ke PT Denpasar terputus";
    await browser.close();
    return responseMessage;
  }
};

// getPengumumanPt().then((res) => console.log(res));
// console.log(year);
module.exports = {
  getPengumumanMa,
  getPengumumanBadilum,
  getPengumumanPt,
};
