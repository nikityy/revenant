const Revenant = require('../lib/revenant');
const { InvalidCredentialsError } = require('../lib/errors');
const RutrackerMock = require('./mocks/rutracker-mock');
const configMock = require('./mocks/config-mock');

const { VALID_CREDENTIALS, INVALID_CREDENTIALS, RESULTS } = RutrackerMock;

describe('#login', () => {
  test('adds valid credentials to config', () => {
    expect.assertions(2);

    const setCredentialsMock = jest.fn().mockResolvedValue(true);
    const revenant = new Revenant();
    revenant._setCredentials = setCredentialsMock;
    revenant.rutracker = new RutrackerMock();

    return revenant.login(VALID_CREDENTIALS).then(() => {
      expect(setCredentialsMock).toHaveBeenCalledTimes(1);
      expect(setCredentialsMock).toHaveBeenCalledWith(VALID_CREDENTIALS);
    });
  });

  test('rejects if credentials are invalid', () => {
    expect.assertions(1);

    const revenant = new Revenant();
    revenant.rutracker = new RutrackerMock();

    return expect(revenant.login(INVALID_CREDENTIALS)).rejects.toThrow(InvalidCredentialsError);
  });
});

describe('#addToWatchList', () => {
  test('adds item to config', () => {
    expect.assertions(2);

    const getWatchListMock = jest.fn().mockResolvedValue(configMock.watch_list);
    const setWatchListMock = jest.fn().mockResolvedValue(true);
    const revenant = new Revenant();
    revenant._getWatchList = getWatchListMock;
    revenant._setWatchList = setWatchListMock;
    revenant.rutracker = new RutrackerMock();

    return revenant.addToWatchList('D').then(() => {
      expect(setWatchListMock).toHaveBeenCalledTimes(1);
      expect(setWatchListMock).toHaveBeenCalledWith([...configMock.watch_list, 'D']);
    });
  });

  test('does nothing if item is already in list', () => {
    expect.assertions(1);

    const getWatchListMock = jest.fn().mockResolvedValue(configMock.watch_list);
    const setWatchListMock = jest.fn().mockResolvedValue(true);
    const revenant = new Revenant();
    revenant._getWatchList = getWatchListMock;
    revenant._setWatchList = setWatchListMock;
    revenant.rutracker = new RutrackerMock();

    return revenant.addToWatchList(configMock.watch_list[0]).then(() => {
      expect(setWatchListMock).toHaveBeenCalledTimes(0);
    });
  });
});

describe('#removeFromWatchList', () => {
  test('removes item from config', () => {
    expect.assertions(2);

    const getWatchListMock = jest.fn().mockResolvedValue(configMock.watch_list);
    const setWatchListMock = jest.fn().mockResolvedValue(true);
    const revenant = new Revenant();
    revenant._getWatchList = getWatchListMock;
    revenant._setWatchList = setWatchListMock;
    revenant.rutracker = new RutrackerMock();

    return revenant.removeFromWatchList('B').then(() => {
      expect(setWatchListMock).toHaveBeenCalledTimes(1);
      expect(setWatchListMock).toHaveBeenCalledWith(configMock.watch_list.filter(x => x !== 'B'));
    });
  });

  test('does nothing if item is not in list', () => {
    expect.assertions(1);

    const getWatchListMock = jest.fn().mockResolvedValue(configMock.watch_list);
    const setWatchListMock = jest.fn().mockResolvedValue(true);
    const revenant = new Revenant();
    revenant._getWatchList = getWatchListMock;
    revenant._setWatchList = setWatchListMock;
    revenant.rutracker = new RutrackerMock();

    return revenant.removeFromWatchList('D').then(() => {
      expect(setWatchListMock).toHaveBeenCalledTimes(0);
    });
  });
});

describe('#getUpdates', () => {
  test('resolves with updated items', () => {
    expect.assertions(1);

    const hasChangedMock = jest.fn().mockReturnValue(true);
    const getWatchListMock = jest.fn().mockResolvedValue(configMock.watch_list);
    const revenant = new Revenant();
    revenant._getWatchList = getWatchListMock;
    revenant._hasChanged = hasChangedMock;
    revenant.rutracker = new RutrackerMock();

    return expect(revenant.getUpdates()).resolves.toEqual({
      'A': RESULTS.A,
      'B': RESULTS.B,
      'C': RESULTS.C,
    });
  });

  test('adds updated items to config', () => {
    expect.assertions(1);
  });

  test('rejects if not authorized', () => {
    expect.assertions(1);
  });
});
