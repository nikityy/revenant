#!/usr/bin/env node

const RutrackerApi = require("rutracker-api");

const KinopoiskWatchlist = require("../lib/kinopoisk-watchlist");
const { runRevenant } = require("../lib/revenant");

/**
 * Feel free to replace rutracker or watchlistClient with your own implementations
 */
const dependencies = {
  configPath: `${process.env.HOME}/.revenantrc.json`,
  rutracker: new RutrackerApi(),
  watchlistClient: KinopoiskWatchlist
};

runRevenant(process.argv, dependencies).catch(error => {
  console.error(error.message);
  process.exit(1);
});
