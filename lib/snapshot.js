class Snapshot {
  constructor(state) {
    this.state = state;
  }

  getDiff(comparables) {
    return comparables;
  }

  update(comparables) {

  }

  toJSON() {
    return this.state;
  }
}

Snapshot.fromJSON = function(state) {
  return new Snapshot(state);
}

module.exports = Snapshot;
