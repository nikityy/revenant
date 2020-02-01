async function authenticate(rutracker, credentials, config) {
  await rutracker.login(credentials);

  return {
    ...config,
    rutracker: {
      cookie: rutracker.pageProvider.cookie
    }
  };
}

async function fetchNewTorrents(rutracker, config) {
  const [torrents, newConfig] = await fetchTorrents(rutracker, config);
  const newTorrents = {};

  newConfig.watchlist.forEach((query) => {
    const previousIds = config.torrents[query];
    const currentIds = newConfig.torrents[query];
    const newIds = currentIds.filter(id => !previousIds.includes(id));

    newTorrents[query] = torrents[query].filter(torrent => newIds.includes(torrent.id));
  });

  return [newTorrents, newConfig];
}

async function fetchTorrents(rutracker, config) {
  const { watchlist } = config;
  const torrents = await Promise.all(watchlist.map(query => rutracker.search({ query })));
  const results = {};
  const newConfig = { ...config, torrents: {} };

  watchlist.forEach((query, index) => {
    results[query] = torrents[index];
    newConfig.torrents[query] = torrents[index].map(torrent => torrent.id);
  });

  return [results, newConfig];
}

async function fetchWatchlist(watchlistClient, config) {
  try {
    const watchlist = await watchlistClient.fetch();
    const newConfig = { ...config, watchlist };

    return [watchlist, newConfig];
  } catch (error) {
    return [config.watchlist, config];
  }
}

module.exports = { authenticate, fetchNewTorrents, fetchTorrents, fetchWatchlist };
