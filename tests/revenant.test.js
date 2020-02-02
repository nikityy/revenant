const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const commander = require("commander");
const fs = require("fs");
const path = require("path");
const RutrackerApi = require("rutracker-api");
const { URL } = require("url");

const KinopoiskWatchlist = require("../lib/kinopoisk-watchlist");
const { runRevenant } = require("../lib/revenant");

const InMemoryConfig = require("./stubs/in-memory-config");
const InMemoryLogger = require("./stubs/in-memory-logger");

const moviesListHtml = fs.readFileSync(
  path.join(__dirname, "responses", "kinopoisk-movies-list.html"),
  { encoding: "utf8" }
);
const searchResultsHtml = fs.readFileSync(
  path.join(__dirname, "responses", "search-results-page.html"),
  { encoding: "utf8" }
);
const noResultsHtml = fs.readFileSync(
  path.join(__dirname, "responses", "no-results-page.html"),
  { encoding: "utf8" }
);

const mock = new MockAdapter(axios);

mock
  .onGet("https://www.kinopoisk.ru/user/789114/movies/list/type/3575/#list")
  .reply(200, moviesListHtml);

mock
  .onPost("http://rutracker.org/forum/login.php")
  .reply(() => [302, null, { "set-cookie": ["bb-token=xxx"] }]);

mock
  .onPost(new RegExp("http://rutracker.org/forum/tracker.php"))
  .reply(config => {
    const url = new URL(config.url);
    const query = url.searchParams.get("nm");

    if (query === "Офицер и шпион Роман Полански") {
      return [200, searchResultsHtml];
    }

    return [200, noResultsHtml];
  });

const run = (args, configAdapter, logger) => {
  const dependencies = {
    configAdapter,
    logger,
    program: new commander.Command(),
    rutracker: new RutrackerApi(),
    watchlistClient: KinopoiskWatchlist
  };

  dependencies.rutracker.pageProvider.request = axios;

  return runRevenant(["node", "revenant", ...args], dependencies);
};

describe("check", () => {
  test("should print new torrents", async () => {
    const config = new InMemoryConfig();
    const logger = new InMemoryLogger();

    await run(["login", "-u", "username", "-p", "password"], config, logger);
    await run(
      [
        "watch",
        "https://www.kinopoisk.ru/user/789114/movies/list/type/3575/#list"
      ],
      config,
      logger
    );
    await run(["check"], config, logger);

    expect(logger.lines).toMatchSnapshot();
    expect(config.config).toMatchSnapshot();
  });
});

describe("list", () => {
  test("should print all watchlist entries", async () => {
    const config = new InMemoryConfig();
    const logger = new InMemoryLogger();

    await run(["login", "-u", "username", "-p", "password"], config, logger);
    await run(
      [
        "watch",
        "https://www.kinopoisk.ru/user/789114/movies/list/type/3575/#list"
      ],
      config,
      logger
    );
    await run(["list"], config, logger);

    expect(logger.lines).toMatchSnapshot();
    expect(config.config).toMatchSnapshot();
  });
});

describe("login", () => {
  test("should update cookie in config", async () => {
    const config = new InMemoryConfig();
    const logger = new InMemoryLogger();

    await run(["login", "-u", "username", "-p", "password"], config, logger);

    expect(logger.lines).toMatchSnapshot();
    expect(config.config).toMatchSnapshot();
  });
});
