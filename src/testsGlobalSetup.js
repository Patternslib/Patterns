// yarn add playwright jest-dev-server

// https://github.com/smooth-code/jest-puppeteer/tree/master/packages/jest-dev-server
// https://stackoverflow.com/questions/53960303/whats-config-start-js-in-usage-example-for-jest-dev-server

//    "globalSetup": "<rootDir>/src/testGlobalSetup.js",
//    "globalTeardown": "<rootDir>/src/testGlobalTeardown.js"

const { setup: setupDevServer } = require('jest-dev-server');

module.exports = async function globalSetup() {
  await setupDevServer({
    command: `NODE_ENV=development webpack-dev-server --config webpack/dev.config.js --open`,
    launchTimeout: 50000,
    port: 3000,
  });
  console.log("testGlobalSetup.js was invoked");
}
