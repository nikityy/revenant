class InMemoryLogger {
  constructor() {
    this.lines = [];
  }

  log(...args) {
    this.lines.push(...args);
  }
}

module.exports = InMemoryLogger;
