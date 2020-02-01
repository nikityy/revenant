const cheerio = require("cheerio");

function parseWatchlistFromHtml(html) {
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

module.exports = { parseWatchlistFromHtml };
