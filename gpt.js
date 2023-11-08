const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");

const apiKey = "xxxx";
async function chatWithGPT3(prompt) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    // The response will contain the generated text

    const generatedText = `Berikut referensi atas pertanyaan/pesan yang anda kirimkan : \n\n ${response.data.choices[0].message.content} \n\n Untuk mengotipmalkan jawaban yang dihasilkan, gunakan pertanyaan yang lebih spesifik!`;
    return generatedText;
    console.log(generatedText, response.data.choices[0].message);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
}

module.exports = {
  chatWithGPT3,
};
