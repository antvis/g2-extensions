const { readFile } = require("fs").promises;
const path = require("path");
const NodeEnvironment = require("jest-environment-node");
const { TMP_DIR } = require("./constants");

// @see https://stackoverflow.com/questions/75047051/jest-class-extends-value-object-is-not-a-constructor-or-null
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

/**
 * @see https://jestjs.io/docs/puppeteer
 */
class Environment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    this.global.PORT = await readFile(path.join(TMP_DIR, "PORT"), "utf8");
  }
}

module.exports = Environment;
