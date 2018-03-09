const fs = require("fs");
const md5 = require("md5");
const { promisify } = require("../lib/utils");

const readFile = promisify(fs.readFile);

module.exports = {
  readConfigFile: path => readFile(path).then(x => JSON.parse(x.toString())),

  getHashedSnapshot: results => {
    const snapshot = results.map(x => x.id).reduce((obj, id, index) => {
      obj[id] = results[index];

      return obj;
    }, {});

    return Object.keys(snapshot).reduce((obj, key) => {
      obj[key] = md5(JSON.stringify(snapshot[key]));

      return obj;
    }, {})
  }
};
