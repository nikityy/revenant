const axios = require("axios");
const cheerio = require("cheerio");

const Config = require("./config");

class KinopoiskConfig extends Config {
  getHtml() {
    return axios({
      url: `https://www.kinopoisk.ru/user/789114/movies/list/type/3575/#list`,
      headers: {
        Host: "www.kinopoisk.ru",
        Referrer: "https://www.kinopoisk.ru/film/1253779/",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15"
      }
    }).then(response => response.data);
  }

  getWatchList() {
    return this.getHtml().then(html => {
      const $ = cheerio.load(html);
      const watchList = [];

      if ($(".captcha-wrapper").length > 0) {
        console.warn(
          "[kinopoisk-config] Kinopoisk returned captcha test. Using cached watch list.\n"
        );

        return super.getWatchList();
      }

      $("#itemList li").each(function parseElement() {
        const title = $(this)
          .find(".info .name_rating")
          .text();
        const director = $(this)
          .find("b .lined")
          .text();

        watchList.push(`${title} ${director}`);
      });

      return this.setWatchList(watchList).then(() => watchList);
    });
  }
}

module.exports = KinopoiskConfig;
