class RutrackerMock {
  login({ username, password }) {
    const validCredentials = RutrackerMock.VALID_CREDENTIALS;
    if (username === validCredentials.username && password === validCredentials.password) {
      return Promise.resolve();
    } else {
      return Promise.reject(Error());
    }
  }

  search() {
    return Promise.resolve();
  }
}

RutrackerMock.VALID_CREDENTIALS = {
  username: 'abc',
  password: 'abc',
};

RutrackerMock.INVALID_CREDENTIALS = {
  username: 'cba',
  password: 'cba',
};

module.exports = RutrackerMock;
