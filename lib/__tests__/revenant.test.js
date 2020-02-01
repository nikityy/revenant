const { authenticate, fetchNewTorrents, fetchTorrents, fetchWatchlist } = require('../revenant');

const RutrackerStub = require('../__stubs__/rutracker.stub');

describe('authenticate', () => {
  const config = { rutracker: { cookie: null } };

  test('should return a config with cookie', async () => {
    const rutracker = new RutrackerStub();
    const newConfig = await authenticate(rutracker, RutrackerStub.VALID_CREDENTIALS, config);

    expect(newConfig).toEqual({
      rutracker: {
        cookie: RutrackerStub.AUTHORIZATION_COOKIE
      }
    });
  });

  test('should throw error if invalid credentials provided', async () => {
    const rutracker = new RutrackerStub();
    const promise = authenticate(rutracker, RutrackerStub.INVALID_CREDENTIALS, config);

    return expect(promise).rejects.toEqual(Error('Invalid Credentials'));
  });
});

describe('fetchNewTorrents', () => {
  const config = {
    torrents: {
      a: ["1", "2"],
      b: ["4", "5"],
      c: ["6", "7"]
    },
    watchlist: ['a', 'b', 'c']
  };

  test('should return torrents list', async () => {
    const searchStubs = {
      a: [{id: '1'}, {id: '2'}, {id: '3'}],
      b: [{id: '4'}, {id: '5'}],
      c: [{id: '6'}, {id: '7'}, {id: '1'}],
    };
    const rutracker = new RutrackerStub(searchStubs);
    const [torrents, newConfig] = await fetchNewTorrents(rutracker, config);

    expect(torrents).toEqual({
      a: [{id: '3'}],
      b: [],
      c: [{id: '1'}]
    });
    expect(newConfig).toEqual({
      torrents: {
        a: ["1", "2", "3"],
        b: ["4", "5"],
        c: ["6", "7", "1"]
      },
      watchlist: config.watchlist
    });
  });
});

describe('fetchTorrents', () => {
  const config = { watchlist: ['a', 'b', 'c'] };

  test('should return torrents list', async () => {
    const searchStubs = {
      a: [{id: '1'}, {id: '2'}, {id: '3'}],
      b: [{id: '4'}, {id: '5'}],
      c: [{id: '6'}, {id: '7'}, {id: '1'}],
    };
    const rutracker = new RutrackerStub(searchStubs);
    const [torrents, newConfig] = await fetchTorrents(rutracker, config);

    expect(torrents).toEqual(searchStubs);
    expect(newConfig).toEqual({
      torrents: {
        a: ["1", "2", "3"],
        b: ["4", "5"],
        c: ["6", "7", "1"]
      },
      watchlist: config.watchlist
    });
  });
});

describe('fetchWatchlist', () => {
  const config = { watchlist: [] };

  test('should return watchlist', async () => {
    const watchlistClient = { fetch: async () => ['a', 'b', 'c'] };
    const [watchlist, newConfig] = await fetchWatchlist(watchlistClient, config);

    expect(watchlist).toEqual(['a', 'b', 'c']);
    expect(newConfig).toEqual({
      watchlist: ['a', 'b', 'c']
    });
  });

  test('should return watchlist from config in case of error', async () => {
    const watchlistClient = { fetch: () => { throw Error() } };
    const [watchlist, newConfig] = await fetchWatchlist(watchlistClient, config);

    expect(watchlist).toEqual(config.watchlist);
    expect(newConfig).toEqual(config);
  });
});
