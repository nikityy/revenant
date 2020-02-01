const axios = require("axios");
const cheerio = require("cheerio");

class KinopoiskWatchlist {
  constructor(watchUrl) {
    this.watchUrl = watchUrl;
  }

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

  fetch() {
    return axios({
      url: this.watchUrl,
      headers: {
        Host: "www.kinopoisk.ru",
        Referrer: "https://www.kinopoisk.ru/film/1253779/",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15"
      }
    }).then(response =>
      KinopoiskWatchlist.parseWatchlistFromHtml(response.data)
    );
  }
}

module.exports = KinopoiskWatchlist;
