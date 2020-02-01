const fs = require("fs");
const { promisify } = require("util");

const Snapshot = require("./snapshot");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const COOKIE_PATH = "cookie";
const WATCH_LIST_PATH = "watch_list";
const SNAPSHOTS_PATH = "snapshots";

class Config {
  constructor(path) {
    this.path = path;
  }

  getCookie() {
    return this.getConfigProperty(COOKIE_PATH);
  }

  setCookie(cookie) {
    return this.setConfigProperty(COOKIE_PATH, cookie);
  }

  getWatchList() {
    return this.getConfigProperty(WATCH_LIST_PATH);
  }

  setWatchList(watchList) {
    return this.setConfigProperty(WATCH_LIST_PATH, watchList);
  }

  async addToWatchList(query) {
    const watchList = await this.getWatchList();

    if (!watchList.includes(query)) {
      return this.config.setWatchList([...watchList, query]);
    }

    return watchList;
  }

  async removeFromWatchList(query) {
    const watchList = await this.getWatchList();

    if (watchList.includes(query)) {
      return this.config.setWatchList(watchList.filter(x => x !== query));
    }

    return watchList;
  }

  getSnapshots(queries) {
    return this.getConfigProperty(SNAPSHOTS_PATH).then(snapshots =>
      queries.map(query => Snapshot.fromJSON(snapshots[query] || {}))
    );
  }

  setSnapshots(snapshots) {
    return this.setConfigProperty(SNAPSHOTS_PATH, snapshots);
  }

  getConfigProperty(path) {
    return this.readConfigFile().then(config => config[path]);
  }

  setConfigProperty(path, value) {
    return this.readConfigFile().then(config => {
      config[path] = value;

      return this.writeConfigFile();
    });
  }

  readConfigFile() {
    if (this.config) {
      return Promise.resolve(this.config);
    }

    return readFile(this.path)
      .then(data => JSON.parse(data.toString()))
      .catch(() => {
        const emptyConfig = this.getEmptyConfig();

        return writeFile(this.path, JSON.stringify(emptyConfig)).then(
          () => emptyConfig
        );
      })
      .then(config => {
        this.config = config;

        return config;
      });
  }

  writeConfigFile() {
    return writeFile(this.path, JSON.stringify(this.config));
  }

  getEmptyConfig() {
    return {
      [COOKIE_PATH]: null,
      [WATCH_LIST_PATH]: [],
      [SNAPSHOTS_PATH]: {}
    };
  }
}

module.exports = Config;