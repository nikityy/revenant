const fs = require("fs");
const Config = require("../lib/config");
const { promisify } = require("../lib/utils");
const { readConfigFile } = require("./utils");

const originalConfigPath = "./tests/mocks/config.json";
const duplicateConfigPath = "./tests/mocks/config-2.json";
const removeFile = promisify(fs.unlink);

beforeEach(
  () =>
    new Promise((resolve, reject) => {
      const stream = fs
        .createReadStream(originalConfigPath)
        .pipe(fs.createWriteStream(duplicateConfigPath));

      stream.on("close", resolve);
      stream.on("error", reject);
    })
);

afterEach(() => removeFile(duplicateConfigPath));

describe("#getCookie", () => {
  test("resolves in cookie", () => {
    expect.assertions(1);

    const config = new Config(duplicateConfigPath);

    return expect(config.getCookie()).resolves.toEqual("bb-token=XXX");
  });
});

describe("#setCookie", () => {
  test("writes updated config", () => {
    expect.assertions(1);

    const config = new Config(duplicateConfigPath);

    return config
      .setCookie("bb-token=YYY")
      .then(() => readConfigFile(duplicateConfigPath))
      .then(actualConfig =>
        expect(actualConfig.cookie).toEqual("bb-token=YYY")
      );
  });
});

describe("#getWatchList", () => {
  test("resolves in watch list", () => {
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

describe("#setWatchList", () => {
  test("writes updated config", () => {
    expect.assertions(1);

    const config = new Config(duplicateConfigPath);

    return config
      .setWatchList(["A", "B", "C"])
      .then(() => readConfigFile(duplicateConfigPath))
      .then(actualConfig =>
        expect(actualConfig.watch_list).toEqual(["A", "B", "C"])
      );
  });
});
