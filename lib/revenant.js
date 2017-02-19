var fs           = require('fs'),
    async        = require('async'),
    _            = require('underscore'),
    md5          = require('md5'),
    EventEmitter = require('events');

var Revenant = function(rutracker, config) {
  if (!_.isObject(rutracker) || !_.isObject(config)) {
    throw TypeError("First argument should be a RuTracker API instance, " +
                "the second should be an object.");
  }

  if (!_.has(config, 'username') || !_.has(config, 'password')) {
    throw TypeError("Second argument should has at least 'username' " +
                "and 'password' properties.");
  }

  _.extend(this, {
    state: {},
    rutracker: rutracker,
    config: {
      data_file   : config.data_file || "./data",
      watch_list  : config.watch_list || []    
    }
  });

  var that = this;
  that.on('error', console.trace.bind(console));
  rutracker.on('login', function() {
    that.emit('login');
    that.initFileCount();
  });
  rutracker.login(config.username, config.password);  

  return this;
};

Revenant.prototype = new EventEmitter();

Revenant.prototype.initFileCount = function() {
  var revenant = this,
      watch_list = this.config.watch_list,
      watch_element;

  for (var i = 0; i < watch_list.length; i++) {
    watch_element = watch_list[i];
    this.state[watch_element] = [];
  }

  fs.exists(this.config.data_file, function(exists) {
    if (exists) {
      revenant.once('read', revenant.writeDataFile);
      revenant.readDataFile(); 
    } else {
      revenant.writeDataFile();
    }
  });
};

Revenant.prototype.readDataFile = function() {
  var revenant = this;
  fs.readFile(revenant.config.data_file, 'utf8', function(err, data) {
    if (err) {
      revenant.emit('error', err);
      return;
    } else {
      var watchListKeys = revenant.config.watch_list;

      var cacheData = JSON.parse(data);
      var cacheKeys = _.keys(cacheData);

      var keysToKeep = _.intersection(watchListKeys, cacheKeys);
      var filteredData = _.pick(cacheData, keysToKeep);

      _.extend(revenant.state, filteredData);
      revenant.emit('read', revenant.state);
    }
  });
};

Revenant.prototype.writeDataFile = function() {
  var revenant = this,
      dataFilePath = this.config.data_file,
      data = JSON.stringify(this.state);

  fs.writeFile(dataFilePath, data, function(err) {
    if (err) {
      revenant.emit('error', 'Write Error: ' + err.message);
    } else {
      revenant.emit('write');
    }
  });
};

Revenant.prototype.createMD5 = function(result) {
  var staticProps = ['state', 'id', 'category', 'title', 'size'];
  var resultsOfStaticProps = _.pick(result, staticProps);

  return md5(JSON.stringify(resultsOfStaticProps));
};

Revenant.prototype.getNewResults = function(query, results) {
  var savedState = this.state[query];

  var ids = _.pluck(results, 'id');
  var oldIds = _.keys(savedState);
  var onlyNewIds = _.difference(ids, oldIds);

  return results.filter((x) => _.contains(onlyNewIds, x.id));
};

Revenant.prototype.getUpdatedResults = function(query, results) {
  var savedState = this.state[query];

  var ids = _.pluck(results, 'id');
  var oldIds = _.keys(savedState);
  var commonIds = _.intersection(ids, oldIds);
  var commonResults = results.filter((x) => _.contains(commonIds, x.id));

  var updatedResults = [];

  commonResults.forEach((result) => {
    var id = result.id;
    var oldHash = savedState[id];
    var newHash = this.createMD5(result);

    if (oldHash !== newHash) {
      updatedResults.push(result);
    }
  });

  return updatedResults;
};

Revenant.prototype.update = function() {
  var revenant  = this;

  async.each(this.config.watch_list, function (query, callback) {
    revenant.rutracker.search(query, function(results) {
      var newResults = revenant.getNewResults(query, results);
      var updatedResults = revenant.getUpdatedResults(query, results);

      var ids = _.pluck(results, 'id');
      var hashes = _.map(results, revenant.createMD5);
      revenant.state[query] = _.object(ids, hashes);

      revenant.emit('new', newResults)
      revenant.emit('update', updatedResults);

      callback();
    });
  }, function (err) {
    if (err) {
      revenant.emit('error', 'Update Error: ' + err.message);
      return;
    }

    revenant.writeDataFile();
    revenant.once('write', function() {
      revenant.emit('finishUpdate');
    });
  });
};

module.exports = Revenant;
