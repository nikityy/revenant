const md5 = require("md5");

class Snapshot {
  constructor(state) {
    this.state = state;
  }

  getDiff(comparables) {
    return comparables.filter(torrent => {
      const hash = this.hashTorrent(torrent);

      return this.state[torrent.id] !== hash;
    });
  }

  update(comparables) {
    Object.keys(comparables).forEach(key => {
      const torrent = comparables[key];
      const hash = this.hashTorrent(torrent);

      this.state[torrent.id] = hash;
    });
  }

  toJSON() {
    return this.state;
  }

  hashTorrent(torrent) {
    const { id, state } = torrent;
    const object = { id, state };

    return md5(JSON.stringify(object));
  }
}

Snapshot.fromJSON = state => new Snapshot(state);

module.exports = Snapshot;
