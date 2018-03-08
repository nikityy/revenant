const fs = require('fs');
const Snapshot = require('./snapshot');
const { promisify } = require('../lib/utils');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class Config {
  constructor(path) {
    this.path = path;
  }

  getWatchList() {
    return this._readConfigFile().then(config => config.watch_list);
  }

  setWatchList(watchList) {
    return this._readConfigFile().then(config => {
      config.watch_list = watchList;

      return this._writeConfigFile();
    });
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
    if (this.config) {
      return Promise.resolve(this.config);
    } else {
      return readFile(this.path)
        .then(data => JSON.parse(data.toString()))
        .then(config => {
          this.config = config;

          return config;
        });
    }
  }

  _writeConfigFile() {
    return writeFile(this.path, JSON.stringify(this.config));
  }
}

module.exports = Config;
