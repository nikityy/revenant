const fs = require("fs");
const path = require("path");

async function authenticate(rutracker, credentials, config) {
  await rutracker.login(credentials);

  return {
    ...config,
    rutracker: {
      cookie: rutracker.pageProvider.cookie
    }
  };
}

async function fetchTorrents(rutracker, config) {
  const { watchlist } = config;
  const torrents = await Promise.all(
    watchlist.map(query => rutracker.search({ query }))
  );
  const results = {};
  const newConfig = { ...config, torrents: {} };

  watchlist.forEach((query, index) => {
    results[query] = torrents[index];
    newConfig.torrents[query] = torrents[index].map(torrent => torrent.id);
  });

  return [results, newConfig];
}

async function fetchNewTorrents(rutracker, config) {
  const [torrents, newConfig] = await fetchTorrents(rutracker, config);
  const newTorrents = {};

  newConfig.watchlist.forEach(query => {
    const previousIds = config.torrents[query];
    const currentIds = newConfig.torrents[query];
    const newIds = currentIds.filter(id => !previousIds.includes(id));

    newTorrents[query] = torrents[query].filter(torrent =>
      newIds.includes(torrent.id)
    );
  });

  return [newTorrents, newConfig];
}

async function fetchWatchlist(watchlistClient, config) {
  try {
    const watchlist = await watchlistClient.fetch();
    const torrents = { ...config.torrents };
    const newConfig = { ...config, torrents, watchlist };

    watchlist.forEach(query => {
      if (!(query in torrents)) {
        torrents[query] = [];
      }
    });

    return [watchlist, newConfig];
  } catch (error) {
    console.log(`${error.message}. Using cached watch list\n`);
    return [config.watchlist, config];
  }
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

module.exports = {
  authenticate,
  downloadTorrent,
  fetchNewTorrents,
  fetchTorrents,
  fetchWatchlist
};
