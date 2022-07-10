const { program } = require("commander");
const { name, version } = require("../package.json");
const commands = require("./commands/index");
const { promisify } = require("util"); // util是node内置包；util.promisify() 这个方法，方便我们快捷的把原来的异步回调方法改成返回 Promise 实例的方法
const figlet = promisify(require("figlet"));
// const clear = require("clear");
const chalk = require("chalk");

// 打印欢迎画⾯
// clear(); // 先执行命令行的clear方法清屏
console.log(
  chalk.green(
    figlet.textSync("welcome to clydee-cli", {
      font: "ANSI Shadow",
      width: 200,
    })
  )
);

program
  .name(name)
  .description("使用node封装的个人cli工具")
  .version(version, "-v, --version", "查看版本号")
  .option("-h, --help", "查看所有的用法")
  .helpOption(false)
  .addHelpCommand(false);

commands.forEach((item) => {
  program
    .command(item.command)
    .description(item.description)
    .argument(item.argument)
    .action(item.action);
});

program.parse(); // parse 默认值为process.argv
