
//基础配置文件载入
require("./conf/property")
//初始化日志功能
require('./utils/log')

log.info('应用启动')
log.info('加载依赖...')

const fs = require("fs");
const fsex = require("fs-extra");
const express = require("express")
const session = require("express-session");
const bodyParser = require("body-parser");
const compression = require("compression");
const sessionStore = require('./core/SessionStore')(session);
const UUID = require("uuid");

log.info("初始化Express")
let app = express()
log.info("初始化Websocket")
const expressWs = require("express-ws")(app)

log.info('初始化Middleware')

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

log.info("初始化Session配置")
app.use(
  session({
    secret: UUID.v4(),
    name: "SESSION_ID",
    cookie: {
      maxAge: server.session_max_age * 1000 * 60
    },
    store: new sessionStore({
      ttl: 300
    }),
    resave: false,
    saveUninitialized: false
  })
);
log.info('Cookie MaxAge: %s', server.session_max_age*1000*60)
log.info('禁用Expresss框架Header')
app.disable('x-powered-by');

log.info("初始化Blocker")
// 路由记录器
app.use(function (req, res, next) {
  //HTTPRequestLogger
  let RequestToken = UUID.v4() //生成RequestToken
  res.set('X-Request-Token', RequestToken)//设置RequestToken 方便查找错误源
  httplog.debug(' [%s] => %s %s \n RequestToken : %s ',
    req.ip, req.method, req.url, RequestToken)
  next()
})

log.info('初始化静态文件配置')
app.use("/public", express.static("./public"));
app.use("/common", express.static("./public/common"));

//自动加载路由模块
function autoLoadRoute(parentRoutePath, childRoutePathName) {
  if (childRoutePathName) { childRoutePathName = childRoutePathName + '/' } else { childRoutePathName = '' }
  let routeList = fs.readdirSync(parentRoutePath);
  for (let key in routeList) {
    let fileName = routeList[key];
    if (fileName.endsWith('.js')) { //针对Windows环境下的特殊处理
      let routeName = fileName.replace(".js", "");
      let targetRoute = '/' + childRoutePathName + routeName
      log.info('[ROUTELOADER] 加载MainRoute: %s', targetRoute,);
      app.use(targetRoute, require(parentRoutePath + routeName));
    } else {
      let childRoutePath = parentRoutePath + fileName + '/';
      log.info('[ROUTELOADER] 加载ChildRoute: %s', childRoutePath);
      autoLoadRoute(childRoutePath, fileName);
    }
  }
}
// Router loader 
log.info('开始加载路由......')
autoLoadRoute('./route/')

//基础部分处理
// ROOT access processer
app.get('/', function (req, res) {
  res.status(200).send('This is root website DIR')
})

// GZIP 压缩必须放到外部请求处理程序之后 否则不会被压缩识别
if (server.USE_GZIP) {
  log.info('初始化压缩功能GZIP')
  app.use(compression())
}

//HTTP服务器错误对外处理
app.use(function (err, req, res, next) {
  httplog.error(err)
  log.error(err.stack)
  res.status(500).send('error')
})

//404 processer
app.use(function (req, res) {
  // 重定向到 404 页面
  //res.status(404).send("404 Not Found")
  res.redirect("/Error/404");
  res.end();
});

//设置定时器类统一管理定时器
setInterval(() => {
  //let time = Date.now();
  //let oldtime = null;
  //let t1 = UUID.v4()
  //log.warn(time + "   " + t1);
}, 1000 * 1); //1秒检索一次

//启动程序
app.listen(3000, () => {
  log.info('App start listening on 3000')
})
process.on("uncaughtException", function (err) {
  // 是否出过错误,本变量用于自动化测试
  // 打印出错误
  log.info("服务器出现错误。。。请查日志并进行修改")
});

process.on("unhandledRejection", (reason, p) => {
});

//程序退出信号处理
process.on("SIGINT", function () {
  log.info('收到退出信号，程序终止中......')
  log.info('回收程序资源文件')
  log.info('结束')
})
//Router 作为核心外部API入口接入 注意 DEBUG 与生产环境配置隔离
//Public 作为静态文件访问入口并和真是文件夹路径隔离
//Core 应用核心逻辑 关键文件储存
  //auth 权限配置文件夹 配置权限校验等一系列功能
  //
//Conf 核心配置文件储存文件夹
//database 核心应用数据存储文件夹 后 和 MYSQL数据库交互存储数据
//logs 应用核心日志存储文件夹
//Model 应用模型文件夹

//模型整合 虚拟时间戳标识 真实时间整合 NLP语法分析外联模块
