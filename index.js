const commander = require('commander');
const Revenant = require('./lib/revenant');

const DEFAULT_CONFIG_PATH = './config000.json';

commander
  .option('-c, --config [path]', 'path to config file', DEFAULT_CONFIG_PATH);

commander
  .command('login')
  .description('authorize user with username/password pair')
  .option('-u, --username <str>', 'Rutracker account username')
  .option('-p, --password <str>', 'Rutracker account password')
  .action((options) => {
    const { username, password } = options;
    const revenant = getRevenant();

    revenant.login({ username, password })
      .then(() => {
        console.log('Authorization complete');
      })
      .catch(logErrorAndExit);
  });

commander
  .command('list')
  .description('display all items in watch list')
  .action(() => {
    const revenant = getRevenant();

    revenant.getWatchList()
      .then(printWatchList)
      .catch(logErrorAndExit);
  });

commander
  .command('add [query]')
  .description('add item to watch list')
  .action((query, ...args) => {
    const revenant = getRevenant();

    revenant.addToWatchList(query)
      .catch(logErrorAndExit);
  });

commander
  .command('remove [query]')
  .description('remove item from watch list')
  .action((query, ...args) => {
    const revenant = getRevenant();

    revenant.removeFromWatchList(query)
      .catch(logErrorAndExit);
  });

commander
  .command('check')
  .description('check updates and print new torrents')
  .action(() => {
    const revenant = getRevenant();

    revenant.getUpdates()
      .then(queries => {
        Object.keys(queries)
          .forEach(query => announceUpdates(queries[query]));
      })
      .catch(logErrorAndExit);
  });

commander.parse(process.argv);

function getRevenant() {
  return new Revenant({
    configPath: commander.config,
  });
}

function logErrorAndExit(error) {
  console.error(error);
  process.exit(1);
}

function printWatchList(watchList) {
  watchList.forEach(item => console.log(item));
}

function announceUpdates(updates) {
  updates.forEach(update => {
    console.log(greenTextColor('NEW:') + ' [' + update.formattedSize + ']: ' + update.title + '\n' + update.url + '\n');
  });
}

function greenTextColor(text) {
  return '\033[1;32m' + text + '\033[0m';
}
