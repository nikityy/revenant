const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const fs = require("fs");
const path = require("path");
const RutrackerApi = require("rutracker-api");

const KinopoiskWatchlist = require("../lib/kinopoisk-watchlist");
const { runRevenant } = require("../lib/revenant");

const htmlPath = path.join(__dirname, "kinopoisk-movies-list.html");
const moviesListHtml = fs.readFileSync(htmlPath, { encoding: "utf8" });

const mock = new MockAdapter(axios);

mock
  .onGet("https://www.kinopoisk.ru/user/789114/movies/list/type/3575/#list")
  .reply(200, moviesListHtml);

mock
  .onPost("http://rutracker.org/forum/login.php")
  .reply(() => [302, null, { "set-cookie": ["bb-token=xxx"] }]);

class InMemoryConfig {
  constructor(config) {
    this.config = config;
  }

  async readConfig() {
    return this.config;
  }

  async saveConfig(config) {
    this.config = config;
  }
}

class InMemoryLogger {
  constructor() {
    this.lines = [];
  }

  log(...args) {
    this.lines.push(...args);
  }
}

describe("list", () => {
  test("should print all watchlist entries", async () => {
    const config = {
      downloadPath: "~/Downloads/",
      rutracker: {
        cookie: "bb-cookie:123"
      },
      kinopoisk: {
        watchUrl:
          "https://www.kinopoisk.ru/user/789114/movies/list/type/3575/#list"
      },
      version: "1",
      torrents: {
        a: ["1", "2", "3"],
        b: ["4", "5"],
        c: ["6", "7", "1"]
      },
      watchlist: ["revenant", "who's afraid of virginia woolf"]
    };

    const dependencies = {
      configAdapter: new InMemoryConfig(config),
      logger: new InMemoryLogger(),
      rutracker: new RutrackerApi(),
      watchlistClient: KinopoiskWatchlist
    };

    await runRevenant(["node", "revenant", "list"], dependencies);

    expect(dependencies.logger.lines).toMatchSnapshot();
    expect(dependencies.configAdapter.config).toMatchSnapshot();
  });
});

describe.skip("login", () => {
  test("should update cookie in config", async () => {
    const config = {
      downloadPath: "~/Downloads/",
      rutracker: {
        cookie: "bb-cookie:123"
      },
      kinopoisk: {
        watchUrl:
          "https://www.kinopoisk.ru/user/789114/movies/list/type/3575/#list"
      },
      version: "1",
      torrents: {
        a: ["1", "2", "3"],
        b: ["4", "5"],
        c: ["6", "7", "1"]
      },
      watchlist: ["revenant", "who's afraid of virginia woolf"]
    };

    const dependencies = {
      configAdapter: new InMemoryConfig(config),
      logger: new InMemoryLogger(),
      rutracker: new RutrackerApi(),
      watchlistClient: KinopoiskWatchlist
    };

    dependencies.rutracker.pageProvider.request = axios;
    axios.defaults.adapter = mock;

    await runRevenant(
      ["node", "revenant", "login", "-u", "username", "-p", "password"],
      dependencies
    );

    expect(dependencies.logger.lines).toMatchSnapshot();
    expect(dependencies.configAdapter.config).toMatchSnapshot();
  });
});
