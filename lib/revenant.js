const RutrackerApi = require("rutracker-api");
const Config = require("./config");
const { InvalidCredentialsError, NotAuthorizedError } = require("./errors");
const { fromKeysAndValues } = require("./utils");

class Revenant {
  constructor({ configPath }) {
    this.rutracker = new RutrackerApi();
    this.config = new Config(configPath);
  }

  login(credentials) {
    return this.rutracker
      .login(credentials)
      .then(() => this.rutracker.pageProvider.cookie)
      .catch(() => {
        throw new InvalidCredentialsError();
      })
      .then(cookie => this.config.setCookie(cookie));
  }

  getUpdates() {
    return this.getWatchListAndSnapshots().then(([watchList, snapshots]) =>
      this.getResultsForAllQueries(watchList).then(results => {
        const updatedItems = this.getUpdatedItems(snapshots, results);

        return this.updateSnapshots(watchList, snapshots, results).then(() =>
          fromKeysAndValues(watchList, updatedItems)
        );
      })
    );
  }

  getWatchList() {
    return this.config.getWatchList();
  }

  addToWatchList(query) {
    return this.config.getWatchList().then(watchList => {
      if (!watchList.includes(query)) {
        return this.config.setWatchList([...watchList, query]);
      }

      return Promise.resolve();
    });
  }

  removeFromWatchList(query) {
    return this.config.getWatchList().then(watchList => {
      if (watchList.includes(query)) {
        return this.config.setWatchList(watchList.filter(x => x !== query));
      }

      return Promise.resolve();
    });
  }

  getWatchListAndSnapshots() {
    return this.config
      .getWatchList()
      .then(watchList =>
        this.config
          .getSnapshots(watchList)
          .then(snapshots => [watchList, snapshots])
      );
  }

  getUpdatedItems(snapshots, results) {
    return snapshots.map((snapshot, index) => snapshot.getDiff(results[index]));
  }

  updateSnapshots(watchList, snapshots, results) {
    snapshots.forEach((snapshot, index) => {
      snapshot.update(results[index]);
    });

    return this.config.setSnapshots(fromKeysAndValues(watchList, snapshots));
  }

  getResultsForAllQueries(queries) {
    return this.authorizeClient().then(() =>
      Promise.all(queries.map(query => this.getResultsForQuery(query)))
    );
  }

  getResultsForQuery(query) {
    return this.rutracker.search({ query });
  }

  authorizeClient() {
    if (this.rutracker.pageProvider.authorized) {
      return Promise.resolve(this.rutracker);
    }

    return this.config.getCookie().then(cookie => {
      if (!cookie) {
        throw new NotAuthorizedError();
      }

      this.rutracker.pageProvider.authorized = true;
      this.rutracker.pageProvider.cookie = cookie;

      return this.rutracker;
    });
  }
}

module.exports = Revenant;
