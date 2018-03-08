const RutrackerApi = require('rutracker-api');
const { InvalidCredentialsError } = require('./errors');

class Revenant {
  constructor() {
    this.rutracker = new RutrackerApi();
  }

  login(credentials) {
    return this.rutracker.login(credentials)
      .then(() => this._setConfig('credentials', credentials))
      .catch(() => {
        throw new InvalidCredentialsError();
      });
  }

  addToWatchList(query) {
    return this._getWatchList().then(watchList => {
      if (!watchList.includes(query)) {
        return this._setConfig('watch_list', [...watchList, query]);
      }
    });
  }

  removeFromWatchList(query) {
    return this._getWatchList().then(watchList => {
      if (watchList.includes(query)) {
        return this._setConfig('watch_list', watchList.filter(x => x !== query));
      }
    });
  }

  _getWatchList() {
    return this._getConfig.then(config => config.watch_list);
  }

  _getConfig() {

  }

  _setConfig() {

  }
}

module.exports = Revenant;
