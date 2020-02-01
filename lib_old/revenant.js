const { InvalidCredentialsError, NotAuthorizedError } = require("./errors");
const { fromKeysAndValues } = require("./utils");

class Revenant {
  constructor({ config, rutracker }) {
    this.rutracker = rutracker;
    this.config = config;
  }

  async login(credentials) {
    try {
      await this.rutracker.login(credentials);
    } catch (error) {
      throw new InvalidCredentialsError();
    }

    this.config.setCookie(this.rutracker.pageProvider.cookie);
  }

  async getUpdates() {
    const watchList = await this.config.getWatchList();
    const snapshots = await this.config.getSnapshots(watchList);
    const results = await this.getResultsForAllQueries(watchList);
    const updatedItems = this.getUpdatedItems(snapshots, results);

    await this.updateSnapshots(watchList, snapshots, results);

    return fromKeysAndValues(watchList, updatedItems);
  }

  getWatchList() {
    return this.config.getWatchList();
  }

  async addToWatchList(query) {
    return this.config.addToWatchList(query);
  }

  async removeFromWatchList(query) {
    return this.config.removeFromWatchList(query);
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

  async getResultsForAllQueries(queries) {
    await this.authorizeClient();

    return Promise.all(queries.map(query => this.rutracker.search({ query })));
  }

  async authorizeClient() {
    if (this.rutracker.pageProvider.authorized) {
      return true;
    }

    const cookie = await this.config.getCookie();

    if (!cookie) {
      throw new NotAuthorizedError();
    }

    this.rutracker.pageProvider.authorized = true;
    this.rutracker.pageProvider.cookie = cookie;

    return true;
  }
}

module.exports = Revenant;
