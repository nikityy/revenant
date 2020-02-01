const fs = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

function createEmptyConfig() {
  return {
    downloadPath: '~',
    rutracker: {
      cookie: null
    },
    kinopoisk: {
      usedId: null,
      listId: null
    },
    version: '1',
    torrents: {},
    watchlist: []
  };
}

async function readConfigFile(filepath) {
  try {
    const content = await readFile(filepath, { encoding: 'utf8' });

    return JSON.parse(content);
  } catch (error) {
    return createEmptyConfig();
  }
}

function writeConfigFile(filepath, config) {
  return writeFile(filepath, JSON.stringify(config));
}

module.exports = { readConfigFile, writeConfigFile };
