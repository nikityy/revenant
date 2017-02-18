var assert = require('assert');
var Revenant = require('../lib/revenant');

var rutracker = { on: function() {}, login: function() {} };

describe('Revenant', function() {

  describe('#constructor', function() {

    it('should throw if provided less than 2 args', function() {
      assert.throws(Revenant.bind(null), TypeError);
      assert.throws(Revenant.bind(null, true), TypeError);
    });

    it('should throw if second arg doesn`t contain username or password', function() {
      assert.throws(function() {
        new Revenant(rutracker, {});
      });

      assert.throws(function() {
        new Revenant(rutracker, { username: '.' });
      });

      assert.throws(function() {
        new Revenant(rutracker, { password: '.' });
      });

      assert.doesNotThrow(function() {
        new Revenant(rutracker, { username: '.', password: '.' });
      });
    });

    it('should extend with provided basic config argument', function() {
      var revenant = new Revenant(rutracker, { username: '.', password: '.' });
      var defaults = {
        data_file: './data',
        watch_list: []
      };

      assert.strictEqual(typeof revenant.state, 'object');
      assert.strictEqual(revenant.rutracker, rutracker);
      assert.strictEqual(revenant.config.data_file, defaults.data_file);
      assert.strictEqual(revenant.config.watch_list.length, 0);
    });

    it('should extend with provided advanced config argument', function() {
      var config = { 
        username: '.', 
        password: '.',
        data_file: Math.round(Math.random() * 1000),
        watch_list: Math.round(Math.random() * 1000),
      };
      var revenant = new Revenant(rutracker, config);

      assert.strictEqual(typeof revenant.state, 'object');
      assert.strictEqual(revenant.rutracker, rutracker);
      assert.strictEqual(revenant.config.data_file, config.data_file);
      assert.strictEqual(revenant.config.watch_list, config.watch_list);
    });

  });

  describe('#initFileCount', function() {

  });

  describe('#readDataFile', function() {

  });

  describe('#writeDataFile', function() {

  });

  describe('#createMD5', function() {

  });

  describe('#getNewResults', function() {

  });

  describe('#update', function() {

  });
});