const { v4 } = require('uuid');
const faker = require('faker');
const minimist = require('minimist');
const { ClientFunction, Selector } = require('testcafe');
const { credentials } = require('./credentials');

const args = minimist(process.argv.slice(2));
const origin = credentials.origin;

const suiteId = v4();
console.log(`Test Suite Run ID => ${suiteId}`);


const readSkipConfig = (relativePath = "../../skip.json") => {
  try {
    return require(relativePath).testsSkippedById;
  } catch (err) {
    console.warn("WARNING: No skip config found. Running all tests.");
    console.log(`Expected skip.json file in the root directory of the test suite`);
    console.log(`Details: { ${err.message} }\n`);
    return [];
  }
};

const testsSkippedById = readSkipConfig();

const setupFixture = () => {
  return fixture(`${credentials.siteName} regression tests\nOrigin: ${origin}`)
    .page(origin)
    .meta({ origin });
};

const wrapTest = ({ id, ...meta }) => {
  return testsSkippedById.includes(id) && !args.debug
    ? test.meta({ id, ...meta }).skip
    : test.meta({ id, ...meta });
};

const setTestContext = (t) => {
  const getLocation = ClientFunction(() => document.location.href).with({boundTestRun: t});
  const getURLPathname = ClientFunction(() => (new URL(document.location.href).pathname)).with({boundTestRun: t});
  return {
    getLocation,
    getURLPathname
  };
};

const dataCleanUp = async (t) => {
  await t 
    .click(Selector("div.list-group > .list-group-item", {boundTestRun: t}).find("svg").nth(0))
}

module.exports.faker = faker;
module.exports.origin = origin;
module.exports.wrapTest = wrapTest;
module.exports.setupFixture = setupFixture;
module.exports.setTestContext = setTestContext;
module.exports.testsSkippedById = testsSkippedById;
module.exports.v4 = v4;
module.exports.dataCleanUp = dataCleanUp;
