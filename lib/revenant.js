const RutrackerApi = require('rutracker-api');
const { InvalidCredentialsError } = require('./errors');

class Revenant {
  constructor() {
    this.rutracker = new RutrackerApi();
  }

  login(credentials) {
    return this.rutracker.login(credentials)
      .then(() => this.config.setCredentials(credentials))
      .catch(() => {
        throw new InvalidCredentialsError();
      });
  }

  getUpdates() {
    return this._getWatchListAndSnapshots()
      .then(([watchList, snapshots]) => {
        return this._getResultsForAllQueries(watchList)
          .then(results => this._getUpdatedResults(snapshots, results))
          .then(updatedResults => this._composeQueriesAndResults(watchList, updatedResults))
          .then(payload => this.config.setSnapshots(payload).then(() => payload));
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

  _getUpdatedResults(snapshots, results) {
    return snapshots.map((snapshot, index) =>
      snapshot.getUpdatedItems(results[index])
    );
  }

  _getResultsForAllQueries(queries) {
    return Promise.all(queries.map(query => this._getResultsForQuery(query)));
  }

  _composeQueriesAndResults(queries, results) {
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
