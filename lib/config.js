const fs = require('fs');
const Snapshot = require('./snapshot');
const { promisify } = require('../lib/utils');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const COOKIE_PATH = 'cookie';
const WATCH_LIST_PATH = 'watch_list';
const SNAPSHOTS_PATH = 'snapshots';

class Config {
  constructor(path) {
    this.path = path;
  }

  getCookie() {
    return this._getConfigProperty(COOKIE_PATH);
  }

  setCookie(cookie) {
    return this._setConfigProperty(COOKIE_PATH, cookie);
  }

  getWatchList() {
    return this._getConfigProperty(WATCH_LIST_PATH);
  }

  setWatchList(watchList) {
    return this._setConfigProperty(WATCH_LIST_PATH, watchList);
  }

  getSnapshots(queries) {
    return this._getConfigProperty(SNAPSHOTS_PATH)
      .then(snapshots => queries.map(query => new Snapshot(snapshots[query] || [])));
  }

  setSnapshots(snapshots) {
    return this._setConfigProperty(SNAPSHOTS_PATH, snapshots);
  }

  _getConfigProperty(path) {
    return this._readConfigFile().then(config => config[path]);
  }

  _setConfigProperty(path, value) {
    return this._readConfigFile().then(config => {
      config[path] = value;

      return this._writeConfigFile();
    });
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
