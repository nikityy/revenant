const RutrackerApi = require('rutracker-api');
const Config = require('./config');
const { InvalidCredentialsError } = require('./errors');
const { fromKeysAndValues } = require('./utils');

class Revenant {
  constructor({ configPath }) {
    this.rutracker = new RutrackerApi();
    this.config = new Config(configPath);
  }

  login(credentials) {
    return this.rutracker.login(credentials)
      .then(() => this.rutracker.pageProvider.cookie)
      .catch(() => {
        throw new InvalidCredentialsError();
      })
      .then(cookie => this.config.setCookie(cookie));
  }

  getUpdates() {
    return this._getWatchListAndSnapshots()
      .then(([watchList, snapshots]) => {
        return this._getResultsForAllQueries(watchList)
          .then(results => {
            const updatedItems = this._getUpdatedItems(snapshots, results);

            return this._updateSnapshots(watchList, snapshots, results)
              .then(() => fromKeysAndValues(watchList, updatedItems));
          })
      });
  }

  addToWatchList(query) {
    return this.config.getWatchList().then(watchList => {
      if (!watchList.includes(query)) {
        return this.config.setWatchList([...watchList, query]);
      }
    });
  }

  removeFromWatchList(query) {
    return this.config.getWatchList().then(watchList => {
      if (watchList.includes(query)) {
        return this.config.setWatchList(watchList.filter(x => x !== query));
      }
    });
  }

  _getWatchListAndSnapshots() {
    return this.config.getWatchList()
      .then(watchList =>
          this.config.getSnapshots(watchList)
            .then(snapshots => [watchList, snapshots])
      );
  }

  _getUpdatedItems(snapshots, results) {
    return snapshots.map((snapshot, index) =>
      snapshot.getDiff(results[index])
    );
  }

  _updateSnapshots(watchList, snapshots, results) {
    snapshots.forEach((snapshot, index) => {
      snapshot.update(results[index]);
    });

    return this.config.setSnapshots(fromKeysAndValues(watchList, snapshots));
  }

  _getResultsForAllQueries(queries) {
    return this._authorizeClient()
      .then(() => Promise.all(
        queries.map(query => this._getResultsForQuery(query)))
      );
  }

  _getObjectFromQueriesAndResults(queries, results) {
    const payload = {};

    queries.forEach((query, index) => {
      payload[query] = results[index];
    });

    return payload;
  }

  _getResultsForQuery(query) {
    return this.rutracker.search({ query });
  }

  _authorizeClient() {
    if (this.rutracker.pageProvider.authorized) {
      return Promise.resolve(this.rutracker);
    } else {
      return this.config.getCookie()
        .then(cookie => {
          this.rutracker.pageProvider.authorized = true;
          this.rutracker.pageProvider.cookie = cookie;

          return this.rutracker;
        })
    }
  }
}

module.exports = Revenant;
