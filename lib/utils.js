module.exports = {
  fromKeysAndValues(keys, values) {
    const object = {};

    keys.forEach((key, index) => {
      object[key] = values[index];
    });

    return object;
  }
};
