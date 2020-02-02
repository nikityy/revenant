const JsonConfig = require("../../lib/json-config");

class InMemoryConfig {
  constructor() {
    this.config = JsonConfig.createEmptyConfig();
  }

  async readConfig() {
    return this.config;
  }

  async saveConfig(config) {
    this.config = config;
  }
}

module.exports = InMemoryConfig;
