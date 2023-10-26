import TelegramBot from "node-telegram-bot-api";
//import dotenv from 'dotenv'; 
import axios from 'axios';
//dotenv.config();
//const TOKEN = process.env.API_KEY;
const TOKEN = "6963386468:AAGlNAV_HHAT4jeB4JL1KBzvN25hUOZAwlY";
const bot = new TelegramBot(TOKEN, {
  //   polling: { interval: 300, autoStart: false, params: { timeout: 10 } },
  polling: true,
});

const tiktokRegex =
  /https?:\/\/(?:(www|vm)\.)?tiktok\.com\/(?:\S*\/video\/(\d+)|(t\/|)(\w+))/;

// const urls = [
//   "https://vm.tiktok.com/ZMRuHHB3G/",
//   "https://tiktok.com/@username/video/1234567890123456789",
//   "https://vm.tiktok.com/abcxyz/",
//   "https://tiktok.com/@username",
//   "https://google.com/@username/",
//   "https://tiktok.com/@username/video/1234567890123456789?lang=en&source=tw_app",
//   "https://tiktok.com/@username/video/1234567890123456789?is_copy_url=0&is_from_webapp=v1",
//   "https://tiktok.com/@username/video/1234567890123456789?_r=",
//   "https://www.tiktok.com/t/ZM2V7t4td/",
// ];

// urls.forEach((url) => {
//   const isMatch = tiktokRegex.test(url);
//   console.log(`${url} - ${isMatch ? "valid" : "invalid"}`);
// });

async function tiktok_downloader(url) {
    const options = {
      method: "GET",
      url: "https://tiktok-full-info-without-watermark.p.rapidapi.com/vid/index",
      params: {
        url: url,
      },
      headers: {
        "X-RapidAPI-Key": "e50fac2227msha1df38116388392p1dafdajsnc37a62e846cc",
        "X-RapidAPI-Host": "tiktok-full-info-without-watermark.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      // console.log(response.data);
      const tiktokLink = await response.data.video[0];
      return tiktokLink;
    } catch (error) {
      console.error(error);
    }
  }

  console.log("Bot has been started...");

    bot.on("message", (msg) => {
      console.log(msg);
      console.log(`${msg.from.username}: ${msg.text}`);
      try {
          if (tiktokRegex.test(msg.text)) {
            tiktok_downloader(msg.text)
              .then((video) => {
                bot.sendVideo(msg.chat.id, video, {
                  caption: `${msg.from.username} тиктокнул(а):`,
                });
                bot.deleteMessage(msg.chat.id, msg.message_id);
              })
              .catch((error) => {
                console.error(error);
              });
        }
      } catch (error) {
        console.error(error);
      }
    })