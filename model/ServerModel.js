
//应用生命周期管理模块
const express = require("express")
log.info("初始化服务管理器")
let app = express()
log.info("初始化Websocket管理器")
const expressWs = require("express-ws")(app)
log.info("初始化路由管理器")
const router = express.Router();

module.exports.getApp = () => {
    return app
}

module.exports.getWs = () => {
    return expressWs
}

module.exports.getRouter = () => {
    return router
}

module.exports.setStaticFloder = (floder) => {
    express.static(floder)
}