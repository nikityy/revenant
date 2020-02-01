const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const removeFile = promisify(fs.unlink);

const { readConfigFile, writeConfigFile } = require('../config');

const configPath = path.join(__dirname, 'config.json');
const tempConfigPath = path.join(__dirname, 'temp-config.json');
const unexistingConfigPath = path.join(__dirname, 'unexisting-config.json');

describe('readConfigFile', () => {
  test('should read config from a json file', async () => {
    const config = await readConfigFile(configPath);

    expect(config).toMatchSnapshot();
  });

  test('should fallback to empty config if file does not exist', async () => {
    const config = await readConfigFile(unexistingConfigPath);

    expect(config).toMatchSnapshot();
  });
});

describe('writeConfigFile', () => {
  afterEach(() => removeFile(tempConfigPath));

  test('should correctly serialize and write to file', async () => {
    const originalConfig = await readConfigFile(configPath);

    await writeConfigFile(tempConfigPath, originalConfig);

    const newConfig = await readConfigFile(tempConfigPath);

    expect(newConfig).toEqual(originalConfig);
  });
});
