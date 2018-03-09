const fs = require("fs");
const { promisify } = require("../lib/utils");

const readFile = promisify(fs.readFile);

module.exports = {
  readConfigFile: path => readFile(path).then(x => JSON.parse(x.toString()))
};
