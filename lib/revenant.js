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

  _getConfig() {

  }

  _setConfig() {

  }
}

module.exports = Revenant;
