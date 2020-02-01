const commander = require("commander");
const chalk = require("chalk");
const RutrackerApi = require("rutracker-api");

const { readConfigFile, writeConfigFile } = require("./lib/config");
const KinopoiskWatchlist = require("./lib/kinopoisk-watchlist");
const {
  authenticate,
  downloadTorrents,
  fetchNewTorrents,
  fetchWatchlist
} = require("./lib/revenant");

const DEFAULT_CONFIG_PATH = `${process.env.HOME}/.revenantrc.json`;

function createCommand(handler) {
  return async (...args) => {
    try {
      const config = await readConfigFile(commander.config);
      const newConfig = await handler(config, ...args);

      await writeConfigFile(commander.config, newConfig);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  };
}

function getRutrackerClient(config) {
  const rutracker = new RutrackerApi();

  if (config.rutracker.cookie) {
    rutracker.pageProvider.authorized = true;
    rutracker.pageProvider.cookie = config.rutracker.cookie;
  }

  return rutracker;
}

function getWatchlistClient(config) {
  const { watchUrl } = config.kinopoisk;

  if (!watchUrl) {
    throw new Error(
      "Kinopoisk watch url is not defined. Use 'watch' command first"
    );
  }

  return new KinopoiskWatchlist(watchUrl);
}

function login(config, options) {
  const credentials = {
    username: options.username,
    password: options.password
  };
  const rutracker = getRutrackerClient(config);

  return authenticate(rutracker, credentials, config);
}

async function downloadNewTorrents(config, options) {
  const newConfig = { ...config };

  if (options.directory) {
    newConfig.downloadPath = options.directory;
  }

  const rutracker = getRutrackerClient(newConfig);
  const watchlistClient = getWatchlistClient(newConfig);
  const [, newerConfig] = await fetchWatchlist(watchlistClient, newConfig);
  const [torrents, lastConfig] = await fetchNewTorrents(rutracker, newerConfig);

  await downloadTorrents(rutracker, torrents, lastConfig);

  return lastConfig;
}

async function showWatchlist(config) {
  const watchlistClient = getWatchlistClient(config);
  const [watchlist, newConfig] = await fetchWatchlist(watchlistClient, config);

  watchlist.forEach(item => console.log(item));

  return newConfig;
}

async function setWatchUrl(config, watchUrl) {
  return {
    ...config,
    kinopoisk: { watchUrl }
  };
}

async function checkUpdates(config) {
  const rutracker = getRutrackerClient(config);
  const watchlistClient = getWatchlistClient(config);

  const [, newConfig] = await fetchWatchlist(watchlistClient, config);
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

function runRevenant(argv) {
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
    .action(createCommand(login));

  commander
    .command("watch [url]")
    .description("set kinopoisk movies list watch url")
    .action(createCommand(setWatchUrl));

  commander
    .command("download")
    .description("downloads new torrent files")
    .option("-d, --directory <str>", "download path")
    .action(createCommand(downloadNewTorrents));

  commander
    .command("list")
    .description("display all items in watch list")
    .action(createCommand(showWatchlist));

  commander
    .command("check")
    .description("check updates and print new torrents")
    .action(createCommand(checkUpdates));

  commander.parse(argv);
}

module.exports = { runRevenant };
