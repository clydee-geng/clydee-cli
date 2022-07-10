const { promisify } = require("util");
const download = promisify(require("git-pull-or-clone"));
const ora = require("ora"); // 用来做命令行loading的
const path = require("path");
const chalk = require("chalk");
const { spawn } = require("child_process");
const inquirer = require("inquirer");
const fs = require("fs");

const spawnFn = (...args) => {
  return new Promise((resolve) => {
    args[0] = process.platform === "win32" ? "npm.cmd" : args[0];
    const proc = spawn(...args);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    proc.on("close", () => {
      resolve();
    });
  });
};

module.exports = (projectName) => {
  const repo = "git@gitlab.com:gdc-cli/admin-template.git";
  let desc = path.resolve(`./${projectName}`);
  /**
   * path.resolve(`./${projectName}`) ===> /Users/gengdongcheng/clydee/mac文件/百度云教程/前端工程化实践/未命名文件夹/blog ==> pwd+/blog
   * path.resolve(__dirprojectName, `./${projectName}`) ===> /Users/gengdongcheng/clydee/learn_project/learn-cli/lib/opreate/blog ==> init-git.js路径+/blog
   */
  const progress = ora();

  const init = () => {
    progress.start(`项目下载中...`);

    download(repo, desc)
      .then((res) => {
        progress.succeed(`项目下载完成`);
        progress.start("安装依赖中...");
        spawnFn("npm", ["install"], { cwd: `${desc}` }).then((res) => {
          //   spawnFn("yarn", [""], { cwd: `${desc}` }).then((res) => {
          progress.succeed(`依赖安装完成`);
          console.log(
            chalk.green(`
      To get Start:
      ===========================
    
      cd ./${projectName}
      npm run dev
    
      ===========================
              `)
          );
        });
      })
      .catch((err) => {
        console.log("try err", err);
        progress.fail();
      });
  };
  //
  const dirs = fs.readdirSync(path.resolve());
  if (dirs.includes(projectName)) {
    inquirer
      .prompt([
        {
          type: "confirm",
          message: "检测到已存在同名目录，是否删除同名文件夹？",
          name: "operation",
        },
      ])
      .then((res) => {
        if (res.operation) {
          progress.start("删除同名目录中...");
          require("child_process").exec(
            `rm -rf ${desc}`,
            (error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return;
              }
              progress.succeed(`删除成功`);
              init();
            }
          );
        } else {
          desc = path.resolve(`./${projectName}_copy`);
          console.log(chalk.green(`项目即将创建到${desc}中`));
          init();
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  } else {
    init();
  }
};
