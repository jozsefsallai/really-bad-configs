const rbc = require('.');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const configPath = path.join(__dirname, '.rbc');
const { expect } = require('chai');

describe('really-bad-configs', function () {
  beforeEach(function () {
    this.config = {
      DATABASE_HOST: 'localhost',
      DATABASE_NAME: 'really_bad_name',
      DATABASE_PASSWORD: 'secure_password',
      DATABASE_PORT: '3306',
      DATABASE_USER: 'testuser'
    };
  });

  describe('#load', function () {
    it('should load the config', function () {
      const config = rbc.load({ location: configPath });
      return expect(config).to.eql(this.config);
    });

    it('should throw if directory does not exist', function () {
      return expect(() => rbc.load({ location: 'nope' }))
        .to.throw('The specified configuration directory is not available.');
    });
  });

  describe('#lookup', function () {
    it('should fetch the value of a config key', function () {
      const password = rbc.lookup(configPath, 'DATABASE_PASSWORD');
      return expect(password).to.eql('secure_password');
    });

    it('should return undefined if the key does not exist', function () {
      const value = rbc.lookup(configPath, 'PORT');
      return expect(value).to.be.undefined;
    });

    it('should throw if directory does not exist', function () {
      return expect(() => rbc.lookup('nope', 'hey'))
        .to.throw('The specified configuration directory is not available.');
    });
  });

  describe('creation', function () {
    beforeEach(function () {
      this.testDir = path.join(__dirname, '.rbc-test');
      if (!fs.existsSync(this.testDir)) {
        fs.mkdirSync(this.testDir);
      }
    });

    afterEach(function () {
      rimraf.sync(this.testDir);
    });

    describe('#createKey', function () {
      it('should not do anything if key already exists', function () {
        return expect(rbc.createKey(path.join(__dirname, '.rbc'), 'DATABASE_HOST', 'localhost'))
          .to.be.false;
      });

      it('should not do anything if value is an object', function () {
        return expect(rbc.createKey(this.testDir, 'TEST_KEY', { hello: 'world' }))
          .to.be.false;
      });

      it('should create key', function () {
        rbc.createKey(this.testDir, 'TEST_KEY', 'testvalue');
        return expect(
          fs.readFileSync(path.join(this.testDir, 'TEST_KEY'), { encoding: 'utf8' }))
          .to.eql('testvalue');
      });

      it('should throw if directory does not exist', function () {
        return expect(() => rbc.createKey('nope', 'hey', 'hi'))
          .to.throw('The specified configuration directory is not available.');
      });
    });

    describe('#createMultiple', function () {
      it('should create config', function () {
        const config = {
          DATABASE_HOST: 'localhost',
          DATABASE_NAME: 'database',
          DATABASE_USER: 'user',
          DATABASE_PASSWORD: 'password'
        };

        rbc.createMultiple(this.testDir, config);

        const output = rbc.load({ location: this.testDir });

        return expect(output).to.eql(config);
      });

      it('should throw if directory does not exist', function () {
        return expect(() => rbc.createMultiple('nope', {}))
          .to.throw('The specified configuration directory is not available.');
      });
    });
  });

  it('main', function () {
    return expect(rbc({ location: configPath })).to.eql(this.config);
  });
});
