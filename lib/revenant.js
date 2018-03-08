const RutrackerApi = require('rutracker-api');
const { InvalidCredentialsError } = require('./errors');

class Revenant {
  constructor() {
    this.rutracker = new RutrackerApi();
  }

  login(credentials) {
    return this.rutracker.login(credentials)
      .then(() => this._setCredentials(credentials))
      .catch(() => {
        throw new InvalidCredentialsError();
      });
  }

  getUpdates() {
    return this._getWatchList()
      .then(watchList => this._getResultsForAllQueries(watchList))
  }

  addToWatchList(query) {
    return this._getWatchList().then(watchList => {
      if (!watchList.includes(query)) {
        return this._setWatchList([...watchList, query]);
      }
    });
  }

  removeFromWatchList(query) {
    return this._getWatchList().then(watchList => {
      if (watchList.includes(query)) {
        return this._setWatchList(watchList.filter(x => x !== query));
      }
    });
  }

  _getResultsForAllQueries(queries) {
    return Promise.all(queries.map(query => this._getResultsForQuery(query)))
      .then(results => {
        const payload = {};

        queries.forEach((query, index) => {
          payload[query] = results[index];
        });

        return payload;
      });
  }

  _getResultsForQuery(query) {
    return this.rutracker.search({ query });
  }

  _getWatchList() {
    return this._getConfig.then(config => config.watch_list);
  }

  _setWatchList(watchList) {

  }

  _setCredentials(credentials) {

  }

  _getConfig() {

  }

  _setConfig() {

  }
}

module.exports = Revenant;
