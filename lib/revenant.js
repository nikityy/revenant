async function authenticate(rutracker, credentials, config) {
  await rutracker.login(credentials);

  return {
    ...config,
    rutracker: {
      cookie: rutracker.pageProvider.cookie
    }
  };
}

module.exports = { authenticate };
