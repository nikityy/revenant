var chai = require('chai');
var expect = chai.expect;

var Revenant = require('../lib/revenant');

var rutracker = { on: function() {}, login: function() {} };
var credentials = { username: '.', password: '.' };

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
    var revenant = new Revenant(rutracker, credentials);
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
    var revenant = new Revenant(rutracker, credentials);

    it('should return correct new results', function() {
      var savedState = {
        'A': '1',
        'B': '2',
        'C': '3'
      };

      var results = [
        { id: 'E' },
        { id: 'B' },
        { id: 'C' },
        { id: 'D' }        
      ];

      var newResults = revenant.getNewResults(savedState, results);
      expect(newResults).to.be.deep.equal([
        { id: 'E' },
        { id: 'D' }
      ]);
    });
  });

  describe('#getUpdatedResults', function() {
    var revenant = new Revenant(rutracker, credentials);

    it('should return correct updated results', function() {
      var savedState = {
        'A': revenant.createMD5({ id: 'A', state: 'A' }),
        'B': revenant.createMD5({ id: 'B', state: 'B' }),
        'C': revenant.createMD5({ id: 'C', state: 'C' })
      };

      var results = [
        { id: 'A', state: 'A' },
        { id: 'B', state: 'Z' },
        { id: 'C', state: 'C' },
        { id: 'D', state: 'D' }        
      ];

      var newResults = revenant.getUpdatedResults(savedState, results);
      expect(newResults).to.be.deep.equal([
        { id: 'B', state: 'Z' },
      ]);
    });
  });

  describe('#update', function() {

  });
});