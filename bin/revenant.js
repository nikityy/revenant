#!/usr/bin/env node

const commander = require("commander");
const RutrackerApi = require("rutracker-api");

const JsonConfig = require("../lib/json-config");
const KinopoiskWatchlist = require("../lib/kinopoisk-watchlist");
const { runRevenant } = require("../lib/revenant");

const dependencies = {
  configAdapter: new JsonConfig(`${process.env.HOME}/.revenantrc.json`),
  logger: console,
  program: new commander.Command(),
  rutracker: new RutrackerApi(),
  watchlistAdapter: KinopoiskWatchlist
};

runRevenant(process.argv, dependencies).catch(error => {
  dependencies.logger.error(error.message);
  process.exit(1);
});
