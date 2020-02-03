const fs = require('fs');
const path = require('path');

function load ({ location }) {
  if (!fs.existsSync(location)) {
    throw new Error('The specified configuration directory is not available.');
  }

  const configFiles = fs.readdirSync(location);
  const config = {};

  configFiles.forEach(file => {
    const contents = fs.readFileSync(path.join(location, file), { encoding: 'utf8' });
    config[file] = contents.trim();
  });

  return config;
}

function lookup (location, key) {
  if (!fs.existsSync(location)) {
    throw new Error('The specified configuration directory is not available.');
  }

  if (!fs.existsSync(path.join(location, key))) {
    return undefined;
  }

  const contents = fs.readFileSync(path.join(location, key), { encoding: 'utf8' });
  return contents.trim();
};

function createKey (location, key, value) {
  if (!fs.existsSync(location)) {
    throw new Error('The specified configuration directory is not available.');
  }

  if (fs.existsSync(path.join(location, key))) {
    console.log(`Key "${key}" already exists. Not created.`);
    return false;
  }

  if (typeof value === 'object') {
    console.log('Nested objects are currently not supported.');
    return false;
  }

  fs.writeFileSync(path.join(location, key), value, { encoding: 'utf8' });
  return true;
};

function createMultiple (location, configObject) {
  if (!fs.existsSync(location)) {
    throw new Error('The specified configuration directory is not available.');
  }

  Object
    .keys(configObject)
    .forEach(key => {
      return createKey(location, key, configObject[key]);
    });

  return true;
};

module.exports = load;
module.exports.load = load;
module.exports.lookup = lookup;
module.exports.createKey = createKey;
module.exports.createMultiple = createMultiple;
