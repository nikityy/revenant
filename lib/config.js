const Snapshot = require('./snapshot');

class Config {
  constructor(path) {
    this.path = path;
  }

  getWatchList() {
    return this._getConfig.then(config => config.watch_list);
  }

  setWatchList(watchList) {

  }

  getSnapshots(queries) {
    return this._getConfig.then(({ snapshots }) => queries.map(query => {
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

  }

  _writeConfigFile() {

  }
}

module.exports = Config;
