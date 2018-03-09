const Revenant = require("../lib/revenant");
const {
  InvalidCredentialsError,
  NotAuthorizedError
} = require("../lib/errors");
const RutrackerMock = require("./mocks/rutracker-mock");
const ConfigMock = require("./mocks/config-mock");
const { getHashedSnapshot } = require("./utils");

const { VALID_CREDENTIALS, INVALID_CREDENTIALS, RESULTS } = RutrackerMock;
const { WATCH_LIST } = ConfigMock;

const REVENANT_CONFIG = {
  configPath: ""
};

describe("#login", () => {
  test("adds valid credentials to config", () => {
    expect.assertions(2);

    const setCookieMock = jest.fn().mockResolvedValue(true);
    const config = new ConfigMock();
    config.setCookie = setCookieMock;

    const revenant = new Revenant(REVENANT_CONFIG);
    revenant.config = config;
    revenant.rutracker = new RutrackerMock();

    return revenant.login(VALID_CREDENTIALS).then(() => {
      expect(setCookieMock).toHaveBeenCalledTimes(1);
      expect(setCookieMock).toHaveBeenCalledWith(RutrackerMock.COOKIE);
    });
  });

  test("rejects if credentials are invalid", () => {
    expect.assertions(1);

    const revenant = new Revenant(REVENANT_CONFIG);
    revenant.rutracker = new RutrackerMock();

    return expect(revenant.login(INVALID_CREDENTIALS)).rejects.toThrow(
      InvalidCredentialsError
    );
  });
});

describe("#addToWatchList", () => {
  test("adds item to config", () => {
    expect.assertions(2);

    const setWatchListMock = jest.fn().mockResolvedValue(true);
    const config = new ConfigMock();
    config.setWatchList = setWatchListMock;

    const revenant = new Revenant(REVENANT_CONFIG);
    revenant.config = config;
    revenant.rutracker = new RutrackerMock();

    return revenant.addToWatchList("D").then(() => {
      expect(setWatchListMock).toHaveBeenCalledTimes(1);
      expect(setWatchListMock).toHaveBeenCalledWith([...WATCH_LIST, "D"]);
    });
  });

  test("does nothing if item is already in list", () => {
    expect.assertions(1);

    const setWatchListMock = jest.fn().mockResolvedValue(true);
    const config = new ConfigMock();
    config.setWatchList = setWatchListMock;

    const revenant = new Revenant(REVENANT_CONFIG);
    revenant.config = config;
    revenant.rutracker = new RutrackerMock();

    return revenant.addToWatchList(WATCH_LIST[0]).then(() => {
      expect(setWatchListMock).toHaveBeenCalledTimes(0);
    });
  });
});

describe("#removeFromWatchList", () => {
  test("removes item from config", () => {
    expect.assertions(2);

    const setWatchListMock = jest.fn().mockResolvedValue(true);
    const config = new ConfigMock();
    config.setWatchList = setWatchListMock;

    const revenant = new Revenant(REVENANT_CONFIG);
    revenant.config = config;
    revenant.rutracker = new RutrackerMock();

    return revenant.removeFromWatchList("B").then(() => {
      expect(setWatchListMock).toHaveBeenCalledTimes(1);
      expect(setWatchListMock).toHaveBeenCalledWith(
        WATCH_LIST.filter(x => x !== "B")
      );
    });
  });

  test("does nothing if item is not in list", () => {
    expect.assertions(1);

    const setWatchListMock = jest.fn().mockResolvedValue(true);
    const config = new ConfigMock();
    config.setWatchList = setWatchListMock;

    const revenant = new Revenant(REVENANT_CONFIG);
    revenant.config = config;
    revenant.rutracker = new RutrackerMock();

    return revenant.removeFromWatchList("D").then(() => {
      expect(setWatchListMock).toHaveBeenCalledTimes(0);
    });
  });
});

describe("#getUpdates", () => {
  test("resolves with updated items", () => {
    expect.assertions(1);

    const config = new ConfigMock();

    const revenant = new Revenant(REVENANT_CONFIG);
    revenant.config = config;
    revenant.rutracker = new RutrackerMock();

    return expect(revenant.getUpdates()).resolves.toEqual({
      A: RESULTS.A,
      B: RESULTS.B,
      C: RESULTS.C
    });
  });

  test("adds updated items to config", () => {
    expect.assertions(2);

    const setSnapshotsMock = jest.fn().mockResolvedValue(true);
    const config = new ConfigMock();
    config.setSnapshots = setSnapshotsMock;

    const revenant = new Revenant(REVENANT_CONFIG);
    revenant.config = config;
    revenant.rutracker = new RutrackerMock();

    return revenant.getUpdates().then(() => {
      expect(setSnapshotsMock).toHaveBeenCalledTimes(1);
      expect(setSnapshotsMock).toHaveBeenCalledWith({
        A: getHashedSnapshot(RESULTS.A),
        B: getHashedSnapshot(RESULTS.B),
        C: getHashedSnapshot(RESULTS.C)
      });
    });
  });

  test("rejects if not authorized", () => {
    expect.assertions(1);

    const config = new ConfigMock();
    config.getCookie = jest.fn().mockResolvedValue(null);

    const revenant = new Revenant(REVENANT_CONFIG);
    revenant.config = config;
    revenant.rutracker = new RutrackerMock();

    return expect(revenant.getUpdates()).rejects.toThrow(NotAuthorizedError);
  });
});
