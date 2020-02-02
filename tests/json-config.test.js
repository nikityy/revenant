const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const removeFile = promisify(fs.unlink);

const JSONConfig = require("../lib/json-config");

const configPath = path.join(__dirname, "config.json");
const tempConfigPath = path.join(__dirname, "temp-config.json");
const unexistingConfigPath = path.join(__dirname, "unexisting-config.json");

describe("readConfigFile", () => {
  test("should read config from a json file", async () => {
    const config = await new JSONConfig(configPath).readConfig();

    expect(config).toMatchSnapshot();
  });

  test("should fallback to empty config if file does not exist", async () => {
    const config = await new JSONConfig(unexistingConfigPath).readConfig();

    expect(config).toMatchSnapshot();
  });
});

describe("writeConfigFile", () => {
  afterEach(() => removeFile(tempConfigPath));

  test("should correctly serialize and write to file", async () => {
    const originalConfig = await new JSONConfig(configPath).readConfig();

    await new JSONConfig(tempConfigPath).saveConfig(originalConfig);

    const newConfig = await new JSONConfig(tempConfigPath).readConfig();

    expect(newConfig).toEqual(originalConfig);
  });
});
