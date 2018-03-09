const commander = require("commander");
const chalk = require("chalk");
const Revenant = require("./lib/revenant");

const DEFAULT_CONFIG_PATH = `${process.env.HOME}/.revenantrc.json`;

class RevenantCli {
  constructor() {
    commander.option(
      "-c, --config [path]",
      "path to config file",
      DEFAULT_CONFIG_PATH
    );

    commander
      .command("login")
      .description("authorize user with username/password pair")
      .option("-u, --username <str>", "Rutracker account username")
      .option("-p, --password <str>", "Rutracker account password")
      .action(options => {
        const { username, password } = options;
        const revenant = this.getRevenant();

        revenant
          .login({ username, password })
          .then(() => {
            console.log("Authorization complete");
          })
          .catch(this.logErrorAndExit);
      });

    commander
      .command("list")
      .description("display all items in watch list")
      .action(() => {
        const revenant = this.getRevenant();

        revenant
          .getWatchList()
          .then(this.printWatchList)
          .catch(this.logErrorAndExit);
      });

    commander
      .command("add [query]")
      .description("add item to watch list")
      .action(query => {
        const revenant = this.getRevenant();

        revenant.addToWatchList(query).catch(this.logErrorAndExit);
      });

    commander
      .command("remove [query]")
      .description("remove item from watch list")
      .action(query => {
        const revenant = this.getRevenant();

        revenant.removeFromWatchList(query).catch(this.logErrorAndExit);
      });

    commander
      .command("check")
      .description("check updates and print new torrents")
      .action(() => {
        const revenant = this.getRevenant();

        revenant
          .getUpdates()
          .then(queries => {
            Object.keys(queries).forEach(query =>
              this.announceUpdates(queries[query])
            );
          })
          .catch(this.logErrorAndExit);
      });
  }

  runWithArgv() {
    commander.parse(process.argv);
  }

  getRevenant() {
    return new Revenant({
      configPath: commander.config
    });
  }

  logErrorAndExit(error) {
    console.error(error);
    process.exit(1);
  }

  printWatchList(watchList) {
    watchList.forEach(item => console.log(item));
  }

  announceUpdates(updates) {
    updates.forEach(update => {
      console.log(
        `${chalk.green("NEW:")} [${update.formattedSize}] ${update.title}\n${
          update.url
        }\n`
      );
    });
  }
}

module.exports = RevenantCli;
