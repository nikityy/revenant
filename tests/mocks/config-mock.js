const Snapshot = require("../../lib/snapshot");

class ConfigMock {
  getCookie() {
    return Promise.resolve(ConfigMock.COOKIE);
  }

  getWatchList() {
    return Promise.resolve(ConfigMock.WATCH_LIST);
  }

  setWatchList() {
    return Promise.resolve();
  }

  getSnapshots(queries) {
    return Promise.resolve(
      queries.map(query => Snapshot.fromJSON(ConfigMock.SNAPSHOTS[query]))
    );
  }

  setSnapshots() {
    return Promise.resolve();
  }

  setCookie() {
    return Promise.resolve();
  }
}

ConfigMock.COOKIE = "bb-token=XXX";

ConfigMock.WATCH_LIST = ["A", "B", "C"];

ConfigMock.SNAPSHOTS = {
  A: {},
  B: {},
  C: {}
};

module.exports = ConfigMock;
