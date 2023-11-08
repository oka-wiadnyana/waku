# whatsappbot-nodejs-simple
Whatsapp bot ini dibuat dengan format pesan respon khusus untuk satker Pengadilan, namun tetap bisa dikustomisasi oleh pengguna lain sesuai kebutusan. Whatsapp bot ini dibuat dengan platform [whatsapp-web-js](https://github.com/pedroslopez/whatsapp-web.js/), dan dibuat menggunakan bahasa javascript dengan runtime environment node-js.

Prerequisit :
* Smartphone yang telah terinstall aplikasi whatsapp
* Node JS

Langkah-langkah penggunaan :
1. Silahkan download terlebih dahulu [node-js](https://nodejs.org/en/download/), kemudian install di komputer yang akan dijadikan server untuk whatsapp bot. 
2. Clone atau download repo ini.
3. Jalankan terminal dan arahkan ke folder tempat hasil download repo ini.
4. Download dependencies melalui terminal :
   * Whatsapp web js
       > $ npm i whatsapp-web.js
   * moment.js :
       > $ npm i moment
   * qrcode-terminal :
       > $ npm i qrcode-terminal
   * mysql :
       > $ npm i mysql
5. Selanjutnya jalankan perintah 
   > $ node app

   pada terminal, kemudian scan barcode Whatsapp dengan Smartphone yang akan digunakan pada chromium atau terminal, dan Whatsapp bot siap digunakan
 
 ### Kustomisasi Pesan dan Database
 Untuk mengkostumisasi pesan respon, silahkan ubah di file **query.js**, dan untuk merubah koneksi ke database silahkan ubah pada file **db_config.js** 

   Feel free to contact me :

   **Telegram**: @Okawiadnyana






