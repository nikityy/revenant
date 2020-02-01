const fs = require("fs");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

function createEmptyConfig() {
  return {
    downloadPath: "~",
    rutracker: {
      cookie: null
    },
    kinopoisk: {
      watchUrl: null
    },
    version: "1",
    torrents: {},
    watchlist: []
  };
}

async function readConfigFile(filepath) {
  try {
    const content = await readFile(filepath, { encoding: "utf8" });

    return JSON.parse(content);
  } catch (error) {
    return createEmptyConfig();
  }
}

function writeConfigFile(filepath, config) {
  return writeFile(filepath, JSON.stringify(config));
}

function updateWatchlist(config, watchlist) {
  const torrents = { ...config.torrents };
  const newConfig = { ...config, torrents, watchlist };

  watchlist.forEach(query => {
    if (!(query in torrents)) {
      torrents[query] = [];
    }
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

module.exports = {
  readConfigFile,
  updateTorrents,
  updateWatchlist,
  writeConfigFile
};
