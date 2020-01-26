class RutrackerMock {
  constructor() {
    this.pageProvider = {
      cookie: null
    };
  }

  login({ username, password }) {
    const validCredentials = RutrackerMock.VALID_CREDENTIALS;
    if (
      username === validCredentials.username &&
      password === validCredentials.password
    ) {
      this.pageProvider.cookie = RutrackerMock.COOKIE;
      return Promise.resolve();
    }

    return Promise.reject(Error());
  }

  search({ query }) {
    return Promise.resolve(RutrackerMock.RESULTS[query] || []);
  }
}

RutrackerMock.COOKIE = "bb-token=XXX";

RutrackerMock.VALID_CREDENTIALS = {
  username: "abc",
  password: "abc"
};

RutrackerMock.INVALID_CREDENTIALS = {
  username: "cba",
  password: "cba"
};

RutrackerMock.RESULTS = {
  A: [
    { id: "1", state: "approved" },
    { id: "2", state: "approved" },
    { id: "3", state: "approved" }
  ],
  B: [
    { id: "4", state: "approved" },
    { id: "5", state: "approved" }
  ],
  C: [{ id: "6", state: "approved" }]
};

module.exports = RutrackerMock;
