const { authenticate } = require('../revenant');

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
