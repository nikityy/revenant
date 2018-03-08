const fs = require('fs');
const Config = require('../lib/config');
const { promisify } = require('../lib/utils');
const { readConfigFile } = require('./utils');

const originalConfigPath = './tests/mocks/config.json';
const duplicateConfigPath = './tests/mocks/config-2.json';
const createReadStream = fs.createReadStream;
const createWriteStream = fs.createWriteStream;
const removeFile = promisify(fs.unlink);

beforeEach(() => {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(originalConfigPath).pipe(createWriteStream(duplicateConfigPath));

    stream.on('close', resolve);
    stream.on('error', reject);
  });
});

afterEach(() => {
  return removeFile(duplicateConfigPath);
});

describe('#getWatchList', () => {
  test('resolves in watch list', () => {
    expect.assertions(1);

    const config = new Config(duplicateConfigPath);

    return expect(config.getWatchList()).resolves.toEqual([
      "A",
      "B",
      "C",
      "D",
      "E"
    ]);
  });
});

describe('#getWatchList', () => {
  test('resolves in watch list', () => {
    expect.assertions(1);

    const config = new Config(duplicateConfigPath);

    return config.setWatchList(['A', 'B', 'C'])
      .then(() => readConfigFile(duplicateConfigPath))
      .then(config => expect(config.watch_list).toEqual(['A', 'B', 'C']));
  });
});
