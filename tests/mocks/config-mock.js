const Snapshot = require('../../lib/snapshot');

class ConfigMock {
  getWatchList() {
    return Promise.resolve(ConfigMock.WATCH_LIST)
  }

  setWatchList(watchList) {
    return Promise.resolve();
  }

  getSnapshots(queries) {
    return Promise.resolve(queries.map(query => new Snapshot(ConfigMock.SNAPSHOTS[query])));
  }

  setSnapshots() {
    return Promise.resolve();
  }

  setCredentials(credentials) {
    return Promise.resolve();
  }
}

ConfigMock.WATCH_LIST = [
  'A',
  'B',
  'C'
];

ConfigMock.SNAPSHOTS = {
  'A': [],
  'B': [],
  'C': []
};

module.exports = ConfigMock;
