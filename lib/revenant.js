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
    return this._getConfig().then(config => {
      const { watch_list } = config;

      if (!watch_list.includes(query)) {
        return this._setConfig('watch_list', [...watch_list, query]);
      }
    });
  }

  _getConfig() {

  }

  _setConfig() {

  }
}

module.exports = Revenant;
