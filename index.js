const commander = require("commander");
const chalk = require("chalk");
const RutrackerApi = require("rutracker-api");

const { readConfigFile, writeConfigFile } = require('./lib/config');
const KinopoiskWatchlist = require("./lib/kinopoisk-watchlist");
const { authenticate, fetchNewTorrents, fetchWatchlist } = require("./lib/revenant");

const DEFAULT_CONFIG_PATH = `${process.env.HOME}/.revenantrc.json`;

class RevenantCli {
  constructor() {
    commander.option(
      "-c, --config [path]",
      "path to config file",
      DEFAULT_CONFIG_PATH
    );

    commander
      .command("login")
      .description("authorize user with username/password pair")
      .option("-u, --username <str>", "Rutracker account username")
      .option("-p, --password <str>", "Rutracker account password")
      .action(this.command(this.login.bind(this)));

    commander
      .command("list")
      .description("display all items in watch list")
      .action(this.command(this.showWatchlist.bind(this)));

    commander
      .command("check")
      .description("check updates and print new torrents")
      .action(this.command(this.checkUpdates.bind(this)));
  }

  run(argv) {
    commander.parse(argv);
  }

  login(config, options) {
    const credentials = {
      username: options.username,
      password: options.password
    };
    const rutracker = this.getRutrackerClient(config);

    return authenticate(rutracker, credentials, config);
  }

  async showWatchlist(config) {
    const watchlistClient = this.getWatchlistClient(config);
    const [watchlist, newConfig] = await fetchWatchlist(watchlistClient, config);

    watchlist.forEach(item => console.log(item));

    return newConfig;
  }

  async checkUpdates(config) {
    const rutracker = this.getRutrackerClient(config);
    const watchlistClient = this.getWatchlistClient(config);

    const [_, newConfig] = await fetchWatchlist(watchlistClient, config);
    const [torrents, lastConfig] = await fetchNewTorrents(rutracker, newConfig);

    Object.keys(torrents).forEach(query =>
      torrents[query].forEach(update => {
        console.log(
          `${chalk.green("NEW:")} [${update.formattedSize}] ${update.title}\n`,
          `${update.url}\n`
        );
      })
    );

    return lastConfig;
  }

  command(handler) {
    return async (...args) => {
      try {
        const config = await readConfigFile(commander.config);
        const newConfig = await handler(config, ...args);
  
        await writeConfigFile(commander.config, newConfig);
      } catch (error) {
        console.error(error.message);
        process.exit(1);
      }
    }
  }

  getRutrackerClient(config) {
    const rutracker = new RutrackerApi();

    if (config.rutracker.cookie) {
      rutracker.pageProvider.cookie = config.rutracker.cookie;
    }

    return rutracker;
  }

  getWatchlistClient(config) {
    const userId = config.kinopoisk.userId;
    const listId = config.kinopoisk.listId;

    if (!userId || !listId) {
      throw new Error('Kinopoisk userId and listId are not defined');
    }

    return new KinopoiskWatchlist(userId, listId);
  }
}

module.exports = RevenantCli;
