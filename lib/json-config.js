const fs = require("fs");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class JsonConfig {
  constructor(filepath) {
    this.filepath = filepath;
  }

  static createEmptyConfig() {
    return {
      downloadPath: "~",
      rutracker: {
        cookie: null
      },
      kinopoisk: {
        watchUrl: null
      },
      version: "1",
      torrents: {},
      watchlist: []
    };
  }

  async readConfig() {
    try {
      const content = await readFile(this.filepath, { encoding: "utf8" });

      return JSON.parse(content);
    } catch (error) {
      return JsonConfig.createEmptyConfig();
    }
  }

  saveConfig(config) {
    return writeFile(this.filepath, JSON.stringify(config));
  }
}

module.exports = JsonConfig;
