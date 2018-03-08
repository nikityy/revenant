class InvalidCredentialsError extends Error {};

class NotAuthorizedError extends Error {};

module.exports = {
  InvalidCredentialsError,
  NotAuthorizedError
};
