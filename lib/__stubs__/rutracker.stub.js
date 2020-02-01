class RutrackerStub {
  constructor() {
    this.pageProvider = { cookie: null };
  }

  async login(credentials) {
    if (credentials === RutrackerStub.VALID_CREDENTIALS) {
      this.pageProvider.cookie = RutrackerStub.AUTHORIZATION_COOKIE;
    }
    if (credentials === RutrackerStub.INVALID_CREDENTIALS) {
      throw new Error('Invalid Credentials');
    }
  }
}

RutrackerStub.VALID_CREDENTIALS = {
  usename: 'testuser',
  password: '123321'
};

RutrackerStub.INVALID_CREDENTIALS = {
  usename: 'testuser_invalid',
  password: 'qwerty'
};

RutrackerStub.AUTHORIZATION_COOKIE = 'bb-cookie:123';

module.exports = RutrackerStub;