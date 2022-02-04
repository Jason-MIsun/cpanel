
const express = require("express");
const rx = require('rxjs');
const userModel = require('../db').User;
const loginCenter = require('../core/LoginCenter');
const encryptTool = require('../utils/EncryptTool')

const router = express.Router();

require('express-ws')(router)
const MAX_ALIVE_COUNT = 60

//WebSocket 会话类
class WebsocketSession {
  constructor(config = {}) {
    this.login = config.login || false;
    this.userid = config.userid || null;
    this.ws = config.ws || null;
    this.mail = config.mail || null;
    this.token = config.token || null;
    this.sessionID = config.sessionID || null;
  }
  send(data) {
    if (data) response.wsSend(data.ws, data.resK, data.resV, data.body);
  }

  getWebsocket() {
    return this.ws || null;
  }
}

//msg getter API
router.ws("/push", function (ws, req) {
  //get ws request token
  //get ws session decrypt token
  //decrypt ws msg ,data2json

  //Connection protector

  //process msg type[heartbeat, consoleMsg, wsAction]

  //heartbeat msg processer


  //Messsage processer


  //websocket msg processer
})


//加载子路由
module.exports = router