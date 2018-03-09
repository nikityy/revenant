const RutrackerApi = require('rutracker-api');
const { InvalidCredentialsError } = require('./errors');
const { fromKeysAndValues } = require('./utils');

class Revenant {
  constructor() {
    this.rutracker = new RutrackerApi();
  }

  login(credentials) {
    return this.rutracker.login(credentials)
      .then(() => {
        const cookie = this.rutracker.pageProvider.cookie;

        return this.config.setCookie(cookie);
      })
      .catch(() => {
        throw new InvalidCredentialsError();
      });
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
    return Promise.all(queries.map(query => this._getResultsForQuery(query)));
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
}

module.exports = Revenant;
