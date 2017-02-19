var chai = require('chai');
var expect = chai.expect;

var Revenant = require('../lib/revenant');

var rutracker = { on: function() {}, login: function() {} };

describe('Revenant', function() {

  describe('#constructor', function() {

    it('should throw if provided less than 2 args', function() {
      expect(Revenant.bind(null)).to.throw(TypeError);
      expect(Revenant.bind(null, true)).to.throw(TypeError);
    });

    it('should throw if second arg doesn`t contain username or password', function() {
      expect(() => new Revenant(rutracker, {})).to.throw(TypeError);
      expect(() => new Revenant(rutracker, { username: '.' })).to.throw(TypeError);
      expect(() => new Revenant(rutracker, { password: '.' })).to.throw(TypeError);
      expect(() => new Revenant(rutracker, { username: '.', password: '.' })).to.not.throw;
    });

    it('should extend with provided basic config argument', function() {
      var revenant = new Revenant(rutracker, { username: '.', password: '.' });
      var defaults = {
        data_file: './data',
        watch_list: []
      };

      expect(revenant.state).to.be.an('object');
      expect(revenant.rutracker).to.be.deep.equal(rutracker);
      expect(revenant.config.data_file).to.be.deep.equal(defaults.data_file);
      expect(revenant.config.watch_list).to.be.empty;
    });

    it('should extend with provided advanced config argument', function() {
      var config = { 
        username: '.', 
        password: '.',
        data_file: Math.round(Math.random() * 1000),
        watch_list: Math.round(Math.random() * 1000),
      };
      var revenant = new Revenant(rutracker, config);

      expect(revenant.state).to.be.an('object');
      expect(revenant.rutracker).to.be.deep.equal(rutracker);
      expect(revenant.config.data_file).to.be.deep.equal(config.data_file);
      expect(revenant.config.watch_list).to.be.deep.equal(config.watch_list);
    });

  });

  describe('#initFileCount', function() {

  });

  describe('#readDataFile', function() {

  });

  describe('#writeDataFile', function() {

  });

  describe('#createMD5', function() {
    var revenant = new Revenant(rutracker, { username: '.', password: '.' });
    var object = {
      state: 1,
      id: 'A',
      category: 'B',
      title: 'Sample',
      size: '1 MB'
    }

    it('should return same hash for same object', function() {
      var firstHash = revenant.createMD5(object);
      var secondHash = revenant.createMD5(object);

      expect(firstHash).to.be.equal(secondHash);
    });

    it('should generate hash by static fields', function() {
      var object = {
        state: 1,
        id: 'A',
        category: 'B',
        title: 'Sample',
        size: '1 MB'
      }
      var firstHash = revenant.createMD5(object);

      object.some_field = 'b';
      var secondHash = revenant.createMD5(object);

      expect(firstHash).to.be.equal(secondHash);
    });
  });

  describe('#getNewResults', function() {

  });

  describe('#update', function() {

  });
});