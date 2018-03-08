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
    return Promise.all([this.config.getWatchList(), this.config.getSnapshots()])
      .then(([watchList, snapshots]) => this._getResultsForAllQueries(watchList))
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

  _getResultsForAllQueries(queries) {
    return Promise.all(queries.map(query => this._getResultsForQuery(query)))
      .then(results => this._composeQueriesAndResults(queries, results));
  }

  _composeQueriesAndResults(queries, results) {
    const payload = {};

    queries.forEach((query, index) => {
      payload[query] = results[index];
    });

    return payload;
  }

  _hasChanged(snapshot, comparable) {

  }

  _getResultsForQuery(query) {
    return this.rutracker.search({ query });
  }
}

module.exports = Revenant;
