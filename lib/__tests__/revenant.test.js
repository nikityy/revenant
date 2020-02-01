const { authenticate, fetchWatchlist } = require('../revenant');

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
