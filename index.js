const commander = require('commander');
const Revenant = require('./lib/revenant');

const DEFAULT_CONFIG_PATH = './config000.json';

commander
  .option('-c, --config [path]', 'path to config file, defaults to ...', DEFAULT_CONFIG_PATH);

commander
  .command('login')
  .option('-u, --username <path>', 'Rutracker account username')
  .option('-p, --password <path>', 'Rutracker account password')
  .action((options) => {
    const { username, password } = options;
    const revenant = new Revenant({
      configPath: commander.config,
    });

    revenant.login({ username, password })
      .then(() => {
        console.log('Authorization complete');
      })
      .catch(logErrorAndExit);
  });

commander
  .command('add [query]')
  .action((query, ...args) => {
    const revenant = new Revenant({
      configPath: commander.config,
    });

    revenant.addToWatchList(query)
      .catch(logErrorAndExit);
  });

commander
  .command('remove [query]')
  .action((query, ...args) => {
    const revenant = new Revenant({
      configPath: commander.config,
    });

    revenant.removeFromWatchList(query)
      .catch(logErrorAndExit);
  });

commander
  .command('check')
  .action(() => {
    const revenant = new Revenant({
      configPath: commander.config,
    });

    revenant.getUpdates()
      .then(queries => {
        Object.keys(queries)
          .forEach(query => announceUpdates(queries[query]));
      })
      .catch(logErrorAndExit);
  });

commander.parse(process.argv);

function logErrorAndExit(error) {
  console.error(error);
  process.exit(1);
}

function announceUpdates(updates) {
  updates.forEach(update => {
    console.log(greenTextColor('NEW:') + ' [' + update.formattedSize + ']: ' + update.title + '\n' + update.url + '\n');
  });
}

function greenTextColor(text) {
  return '\033[1;32m' + text + '\033[0m';
}
