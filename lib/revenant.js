async function authenticate(rutracker, credentials, config) {
  await rutracker.login(credentials);

  return {
    ...config,
    rutracker: {
      cookie: rutracker.pageProvider.cookie
    }
  };
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

module.exports = { authenticate, fetchWatchlist };
