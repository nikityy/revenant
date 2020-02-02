const fs = require("fs");
const chalk = require("chalk");
const path = require("path");

async function fetchTorrents(rutracker, watchlist) {
  const torrents = await Promise.all(
    watchlist.map(query => rutracker.search({ query }))
  );
  const results = {};

  watchlist.forEach((query, index) => {
    results[query] = torrents[index];
  });

  return results;
}

function getNewTorrents(torrents, prevTorrents) {
  const newTorrents = {};

  Object.keys(torrents).forEach(query => {
    const previousIds = prevTorrents[query] || [];
    const currentIds = torrents[query].map(torrent => torrent.id);
    const newIds = currentIds.filter(id => !previousIds.includes(id));

    newTorrents[query] = torrents[query].filter(torrent =>
      newIds.includes(torrent.id)
    );
  });

  return newTorrents;
}

async function downloadTorrent(rutracker, torrent, config) {
  const stream = await rutracker.download(torrent.id);
  const filepath = path.resolve(config.downloadPath, `${torrent.id}.torrent`);

  return new Promise((resolve, reject) => {
    stream.pipe(fs.createWriteStream(filepath));

    stream.on("end", resolve);
    stream.on("error", reject);
  });
}

function setupRutracker(rutracker, config) {
  if (config.rutracker.cookie) {
    rutracker.pageProvider.authorized = true;
    rutracker.pageProvider.cookie = config.rutracker.cookie;
  }
}

async function fetchWatchlist(watchlistClient, config, logger) {
  try {
    return await watchlistClient.fetch(config);
  } catch (error) {
    logger.log(`${error.message}. Using cached watch list\n`);
    return config.watchlist;
  }
}

function updateWatchlist(config, watchlist) {
  const torrents = {};
  const newConfig = { ...config, torrents, watchlist };

  watchlist.forEach(query => {
    torrents[query] = config.torrents[query] || [];
  });

  return newConfig;
}

function updateTorrents(config, torrents) {
  const newConfig = { ...config, torrents: {} };

  Object.keys(torrents).forEach(query => {
    newConfig.torrents[query] = torrents[query].map(torrent => torrent.id);
  });

  return newConfig;
}

async function runRevenant(argv, dependencies) {
  const {
    configAdapter,
    logger,
    program,
    rutracker,
    watchlistClient
  } = dependencies;

  program
    .command("login")
    .description("authorize user with username/password pair")
    .option("-u, --username <str>", "Rutracker account username")
    .option("-p, --password <str>", "Rutracker account password")
    .action(async options => {
      const config = await configAdapter.readConfig();
      const credentials = {
        username: options.username,
        password: options.password
      };

      setupRutracker(rutracker, config);

      await rutracker.login(credentials);

      await configAdapter.saveConfig({
        ...config,
        rutracker: {
          cookie: rutracker.pageProvider.cookie
        }
      });
    });

  program
    .command("watch [url]")
    .description("set kinopoisk movies list watch url")
    .action(async watchUrl => {
      const config = await configAdapter.readConfig();

      await configAdapter.saveConfig({ ...config, kinopoisk: { watchUrl } });
    });

  program
    .command("download")
    .description("downloads new torrent files")
    .option("-d, --directory <str>", "download path")
    .action(async options => {
      const config = await configAdapter.readConfig();
      const tempConfig = { ...config };

      if (options.directory) {
        tempConfig.downloadPath = options.directory;
      }

      if (!tempConfig.downloadPath) {
        throw Error(
          'Download directory is not specified. Run this command with "-d" flag first'
        );
      }

      setupRutracker(rutracker, config);

      const watchlist = await fetchWatchlist(
        watchlistClient,
        tempConfig,
        logger
      );
      const torrents = await fetchTorrents(rutracker, watchlist);
      const newTorrents = getNewTorrents(torrents, config.torrents);

      await Promise.all(
        Object.keys(newTorrents)
          .reduce((acc, query) => acc.concat(newTorrents[query]), [])
          .map(torrent => downloadTorrent(rutracker, torrent, config))
      );

      await configAdapter.saveConfig(
        updateTorrents(updateWatchlist(tempConfig, watchlist), torrents)
      );
    });

  program
    .command("list")
    .description("display all items in watch list")
    .action(async () => {
      const config = await configAdapter.readConfig();
      const watchlist = await fetchWatchlist(watchlistClient, config, logger);

      watchlist.forEach(item => logger.log(item));

      await configAdapter.saveConfig(updateWatchlist(config, watchlist));
    });

  program
    .command("check")
    .description("check updates and print new torrents")
    .action(async () => {
      const config = await configAdapter.readConfig();

      setupRutracker(rutracker, config);

      const watchlist = await fetchWatchlist(watchlistClient, config, logger);
      const torrents = await fetchTorrents(rutracker, watchlist);
      const newTorrents = getNewTorrents(torrents, config.torrents);

      Object.keys(newTorrents).forEach(query =>
        newTorrents[query].forEach(update => {
          logger.log(
            `${chalk.green("NEW:")} [${update.formattedSize}] ${
              update.title
            }\n`,
            `${update.url}\n`
          );
        })
      );

      await configAdapter.saveConfig(
        updateTorrents(updateWatchlist(config, watchlist), torrents)
      );
    });

  await program.parseAsync(argv);
}

module.exports = { runRevenant };
