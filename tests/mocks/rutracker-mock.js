class RutrackerMock {
  login({ username, password }) {
    const validCredentials = RutrackerMock.VALID_CREDENTIALS;
    if (username === validCredentials.username && password === validCredentials.password) {
      return Promise.resolve();
    } else {
      return Promise.reject(Error());
    }
  }

  search({ query }) {
    return Promise.resolve(RutrackerMock.RESULTS[query] || []);
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

RutrackerMock.RESULTS = {
  'A': [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ],
  'B': [
    { id: '4' },
    { id: '5' },
  ],
  'C': [
    { id: '6' },
  ],
};

module.exports = RutrackerMock;
