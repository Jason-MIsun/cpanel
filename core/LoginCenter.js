
let container = require('../core/LoginCenterContainer')
let EncryptTool = require('../utils/EncryptTool')
const UserModel = require('../db').User
let svgCaptcha = require('svg-captcha');

// sessionID DEV KEY, ONLY stored by server, devices checker KEY
// AESToken  AES encrypt key, created by USER dev and the server just store it
// AccessToken 作为统一认证标识 防护作用不大？

// user should login processer
//passport md5(mail+md5(password))

module.exports.needLogin = (req, res, trueCallBack, falseCallBack) => {
    let sessionID = req.sessionID
    if (req.session['UserID'] && container.isLogin(sessionID)) {
        trueCallBack && trueCallBack();
    }
    falseCallBack && falseCallBack();
}

module.exports.addLogin = (sessionID, userID, sessionProfiles) => {
    container.addLogin(sessionID, userID, sessionProfiles)
}

module.exports.addAESToken = (sessionID, AESToken) => {
    container.addAESToken(sessionID, AESToken)
}

module.exports.getAESToken = (sessionID) => {
    return container.getAESToken(sessionID)
}

module.exports.isLogin = (SessionID) => {
    return container.isLogin(SessionID)
}

class CaptchaProcesser {
    constructor() {
        this.TIME = Date.now()
        this.REQUEST_MAX_AGE = server.REQUEST_EXPIRE_TIME
        this.container = []
        this.blockList = []
        this.INIT = true
    }

    setCheck(requestDate, sessionID) {
        //requestDate equals
        //request equals storedSession AccessToken
        //max request times once
        this.blockList["IP"] = []
        let nowDate = Date.now()
        if ((requestDate - nowDate) > server.REQUEST_EXPIRE_TIME) return false
    }

    create() {
        let captcha = svgCaptcha.create({
            size: 4,
            ignoreChars: '0oO1I',
            noise: 2,
            fontSize: 50,
            width: 100,
            background: '#cc9966'
        })
        return captcha
    }

    setCaptcha(captcha, req, res) {
        //setting captcha
        req.session['captcha'] = EncryptTool.md5(captcha.text.toLowerCase())
        res.type('svg');
        res.status(200).send(captcha.data);
    }
}

module.exports.getCaptchaProcesser = () => {
    let processer = new CaptchaProcesser()
}

class PassportProcesser {
    constructor(config = {}) {
        this.req = config.req
        this.sessionID = config.sessionID
        //Decrypt token processer
        //MUST be the first one to be decrypted!
        log.debug("Process SessionID: %s 's request! ", this.sessionID)
        this.decryptToken = EncryptTool.rsaDecrypt(config.credit).split(':')[1]
        container.addAESToken(config.sessionID, this.decryptToken)
        //Get decrypt token arrary
        let decryptTokenArrary = container.getAESToken(config.sessionID)
        //Process the got data
        let mailArrary = EncryptTool.aesDecrypt(config.mail, decryptTokenArrary).split(':')
        let passportArrary = EncryptTool.aesDecrypt(config.passport, decryptTokenArrary).split(':')
        this.mail = mailArrary[0]
        this.realmail = EncryptTool.rsaDecrypt(mailArrary[1])
        this.passport = passportArrary[0]
        this.accessToken = passportArrary[1]
        this.init = true
        this.LOGIN_STATUS = false
        //logger
        log.info('[PassportProcesser] ' + 'User %s(%s) start to login! Credit: %s, DcryptToken: %s, AccessToken: %s. Checking......',
            this.realmail, this.mail, this.passport, this.decryptToken, this.accessToken)
    }

    checkLogin() {
        log.debug('Checking user login status!')
        if (!this.init) {
            log.warn("Current user's PASSPORTP_ROCESSER CLASS had NOT been init!REFUSE to login")
            return false
        } //初始化检查
        return this.accessToken == this.req['AccessToken'] && //检查统一认证标识
            this.passport == UserModel.getCredit(this.mail) && //检查密码凭证是否正确
            container.isLogin(this.sessionID) //检查当前设备是否登录
    }

    setLogin() {
        log.debug('Loginstatus correct! Setting Loginstatus')
        let userID = UserModel.getUserID(this.mail)
        this.req.session['UserID'] = userID
        this.req.session['captcha'] = null
        this.LOGIN_STATUS = true
        log.info('用户 [%s] 准许登录!UserID: %s, Processing...', this.mail, userID)
    }

    getLogin() {

    }
}

module.exports.getProcesser = (req) => {
    return new PassportProcesser({
        mail: req.body.mail,
        passport: req.body.passport,
        credit: req.body.credit,
        sessionID: req.sessionID,
        req: req
    })
}