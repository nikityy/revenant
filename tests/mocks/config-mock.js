class ConfigMock {
  getWatchList() {
    return Promise.resolve(ConfigMock.WATCH_LIST)
  }

  setWatchList(watchList) {
    return Promise.resolve();
  }

  getSnapshots() {
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

module.exports = ConfigMock;
