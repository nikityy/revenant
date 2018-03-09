class InvalidCredentialsError extends Error {
  constructor(...args) {
    super(...args);

    this.name = "InvalidCredentialsError";
    this.message =
      "Passed credentials are invalid or RuTracker has requested captcha";
  }
}

class NotAuthorizedError extends Error {
  constructor(...args) {
    super(...args);

    this.name = "NotAuthorizedError";
    this.message = "Use `login` action first";
  }
}

module.exports = {
  InvalidCredentialsError,
  NotAuthorizedError
};
