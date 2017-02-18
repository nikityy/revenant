var fs = require('fs');
var config_file = './config.json';

fs.exists(config_file, function(exist) {
  if (exist) {
    try {
      var stringified = fs.readFileSync(config_file, 'utf8');
      var config = JSON.parse(stringified);
    }
    catch(err){
      console.error("Invalid config.json: " + err.message);
      return err;
    }
    startWatch(config);
  } else {
    console.error('Config.JSON is not available.');
    return;
  }
});

function startWatch(config) {
  var RutrackerApi = require('rutracker-api'),
      Revenant     = require('./lib/revenant'),
      rutracker    = new RutrackerApi(),
      revenant     = new Revenant(rutracker, config);

  revenant.on('login', function() {
    revenant.on('update', function(updates) {
      updates.forEach(function(update) {
        console.log(redTextColor('NEW:') + ' [' + update.size + ']: ' + update.title + '\n');
      });
    });
    revenant.on('finishUpdate', process.exit);
    revenant.update();
  });
}

function redTextColor(text) {
  return '\033[1;32m' + text + '\033[0m';
}
