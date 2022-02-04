
//微信Token管理中心
const axios = require('axios').default;
const fs = require("fs")
const UUID = require("uuid");

//微信Token有效期只有7200s，注意  s

class WxTokenProcesser {
    constructor(config = {}) {
        this.EXPIRE_TIME =  1000 * 72 // 7200s
        this.LAST_REQUEST_TIME = null
        this.request_ID_container = []
        this.timer_container = []
    }

    setTimer() {
        //
    }

    newToken() {
        token = UUID.v4()
        request_ID_container[request_ID_container.length + 1] = token
        //set new token store
        ///request new token from wxserver
    }

}

class QequestTimer {
    constructor(){
        //construct a new timer
    }
}