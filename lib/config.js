const fs = require('fs');
const Snapshot = require('./snapshot');
const { promisify } = require('../lib/utils');

const readFile = promisify(fs.readFile);

class Config {
  constructor(path) {
    this.path = path;
  }

  getWatchList() {
    return this._readConfigFile().then(config => config.watch_list);
  }

  setWatchList(watchList) {

  }

  getSnapshots(queries) {
    return this._readConfigFile().then(({ snapshots }) => queries.map(query => {
      if (query in snapshots) {
        return new Snapshot(snapshots[query]);
      } else {
        return new Snapshot([]);
      }
    }));
  }

  setSnapshots() {

  }

  setCredentials(credentials) {

  }

  _readConfigFile() {
    return readFile(this.path).then(data => JSON.parse(data.toString()));
  }

  _writeConfigFile() {

  }
}

module.exports = Config;
