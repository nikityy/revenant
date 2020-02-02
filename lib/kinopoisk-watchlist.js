const axios = require("axios");
const cheerio = require("cheerio");

class KinopoiskWatchlist {
  static parseWatchlistFromHtml(html) {
    const $ = cheerio.load(html);
    const watchlist = [];

    if ($(".captcha-wrapper").length > 0) {
      throw new Error("Kinopoisk returned captcha test");
    }

    $("#itemList li").each(function parseElement() {
      const title = $(this)
        .find(".info .name_rating")
        .text();
      const director = $(this)
        .find("b .lined")
        .text();

      watchlist.push(`${title} ${director}`);
    });

    return watchlist;
  }

  static async fetch(config) {
    const response = await axios({
      url: config.kinopoisk.watchUrl,
      headers: {
        Host: "www.kinopoisk.ru",
        Referrer: "https://www.kinopoisk.ru/film/1253779/",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15"
      }
    });

    return KinopoiskWatchlist.parseWatchlistFromHtml(response.data);
  }
}

module.exports = KinopoiskWatchlist;
