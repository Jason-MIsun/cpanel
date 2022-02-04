
const log4js = require("log4js");
const fs = require("fs");

//关键文件（夹）配置
for (let k in server.path) {
  let path = server.path[k]
  //文件（夹）存在性判断
  if (!fs.existsSync(path)) {
    const dirCache = {}
    const attr = path.split('/');
    let dir = attr[0]
    //文件夹创建
    for (let i = 1; i < attr.length; i++) {
      if (!dirCache[dir] && !fs.existsSync(dir)) {
        dirCache[dir] = true
        fs.mkdirSync(dir)
      }
      dir = dir + '/' + attr[i]
    }
    //文件创建
    if (!dir.endsWith("/")) {
      fs.writeFileSync(path, '')
    }
  }
  //日志文件转储
  if (fs.existsSync(path) && path.endsWith("log")) {
    let tempName = path.slice(path.lastIndexOf('/'), path.indexOf('Current'))
    let date = new Date();
    //NOTICE: Win平台日志文件名适应性配置
    let logFilename = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDay() + "_" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + '.log'
    fs.renameSync(path, './logs' + tempName + '/' + logFilename)
  }
}

//log4js 日志文件配置
log4js.configure({
  appenders: {
    //控制台输出
    consoleLog: {
      type: "stdout",
      layout: {
        category: 'Console',
        type: "pattern",
        pattern: "[%d{MM/dd hh:mm:ss}] [%[%p%]] %m"
      }
    },
    //应用日志配置
    app: {
      type: "file",
      filename: server.path.APP_DEFAULT_LOG_PATH,
      layout: {
        type: "pattern",
        pattern: "[ %d ] [%p] %m"
      }
    },
    //HTTP日志配置
    http: {
      type: "file",
      filename: server.path.HTTP_DEFAULT_LOG_PATH,
      layout: {
        type: "pattern",
        pattern: "[ %d ] [%p] %m"
      }
    },
    //数据库操作日志配置
    database: {
      type: "file",
      filename: server.path.DATABASE_DEAFAULT_LOG_PATH,
      layout: {
        type: "pattern",
        pattern: "[ %d ] [%p] %m"
      }
    }
  },
  //日志输出配置
  categories: {
    default: {
      appenders: ["consoleLog", "app"],
      level: "debug" //日志级别：DEBUG
    },
    http: {
      appenders: ["http"],
      level: "debug" //日志级别：DEBUG
    },
    database: {
      appenders: ['database'],
      level: 'debug' //日志级别：DEBUG
    }
  }
});

//实例化日志助手
const logger = log4js.getLogger("default");
const httpLogger = log4js.getLogger("http");
const databaseLogger = log4js.getLogger("database")

//设置全局变量
global.log = logger;
global.httplog = httpLogger;
global.dblog = databaseLogger;
