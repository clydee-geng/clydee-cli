const inquirer = require("inquirer");

const answerOptions = {
  获取后台管理系统前端模板: "admin-template",
  退出: "quit",
};
const question = [
  {
    type: "list" /* 上下选择框 */,
    message: "请选择操作？",
    name: "operation",
    choices: Object.keys(answerOptions),
  },
];

module.exports = {
  command: "create",
  argument: "<项目目录>",
  description: "创建一个新的项目",
  action: (projectName, options) => {
    inquirer
      .prompt(question)
      .then((res1) => {
        if (res1.operation === "退出") return;
        return require(`./${answerOptions[res1.operation]}`);
      })
      .then((res2) => {
        typeof res2 === "function" && res2(projectName);
      })
      .catch((err) => {
        console.log("err", err);
      });
  },
};
