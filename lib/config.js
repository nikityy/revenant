class Config {
  constructor(path) {
    this.path = path;
  }

  getWatchList() {
    return this._getConfig.then(config => config.watch_list);
  }

  setWatchList(watchList) {

  }

  getSnapshots() {
    return this._getConfig.then(config => config.snapshots);
  }

  setCredentials(credentials) {

  }

  _readConfigFile() {

  }

  _writeConfigFile() {

  }
}

module.exports = Config;
