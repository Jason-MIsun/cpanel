
const EncryptTool = require('../../utils/EncryptTool')
const LoginContainer = require('./LoginContainer')
const UserModel = require('../../db').User

let mLoginContainer = new LoginContainer()
//Passport模块
class Passport {
    constructor(config = {}) {
        log.trace('创建新的Passport')
        for (let v in config) {
            if (config[v] === undefined) {
                log.warn('请求的数据非法(空对象,位于%s)!拒绝创建Passport!SessionID: %s', v, config.sessionID)
                return
            }
        }
        try {
            //先解密相关数据
            log.trace('解密Credit获取客户端随机私钥')
            //1、RSA解密Credit内容获取AES解密密钥
            this.decryptToken = EncryptTool.rsaDecrypt(config.credit).split(':')[1]
            //2、Login Center添加解密密钥
            log.trace('Container记录目标客户端私钥并储存')
            container.addDesToken(config.sessionID, this.decryptToken)
            //3、获取SessionID，序列化AES解密密钥
            this.sessionID = config.sessionID
            let decryptTokenArrary = container.getDesToken(config.sessionID)
            //4、AES解密mail
            log.trace('解密获取用户名称')
            let mailArrary = EncryptTool.aesDecrypt(config.mail, decryptTokenArrary).split(':')
            //4、AES解密passport
            log.trace('解密获取用户账密MD5')
            let passportArrary = EncryptTool.aesDecrypt(config.passport, decryptTokenArrary).split(':')
            //5、反序列化mail数组得到真实用户名
            this.mail = mailArrary[0]
            this.realmail = EncryptTool.rsaDecrypt(mailArrary[1])
            //5、反序列化passport数组得到Access Token
            this.passport = passportArrary[0]
            this.accessToken = passportArrary[1]
            //6、打上已经初始化的标签
            this.init = true
            this.LOGIN_STATUS = false
            //日志记录
            log.info('[PassportProcesser] ' + '用户 %s(%s) 尝试登陆! Credit(MD5): %s, DcryptToken: %s. 检查凭证中......',
                this.realmail, this.mail, this.passport, this.decryptToken)
        } catch (err) {
            log.error('获取相关数据失败!请检查数据是否完整!ErrorMsg: %s', err)
            return
        }
    }
}

//PassportProcesser处理器
class PassportProcesser {
    constructor(passport) {
        log.fatal(passport)
        if (EncryptTool.isEmptyObject(passport)) {
            log.warn('Passport为空对象!拒绝处理!')
            return
        }
        this.passport = passport
    }
    checkLogin() {
        log.info('检查用户登录状态.')

        return UserModel.isUserExist(this.passport.mail) &&
            this.passport.accessToken == this.passport.accessToken && //检查统一认证标识
            this.passport == UserModel.getCredit(this.passport.mail) && //检查密码凭证是否正确
            container.isLogin(this.passport.sessionID) //检查当前设备是否登录
    }
    setLogin() {
        log.debug('Loginstatus correct! Setting Loginstatus')
        let userID = UserModel.getUserID(this.mail)
        this.req.session['UserID'] = userID
        this.req.session['captcha'] = null
        this.LOGIN_STATUS = true
        log.info('用户 [%s] 准许登录!UserID: %s, Processing...', this.mail, userID)
    }

}

module.exports.newLoginRequest = (data, trueCallBack, falseCallBack) => {
    //PASSPORT形式 md5(md5(mail)+ md5(password))
    //处理新的登录请求
    log.info("发现新的登录请求!处理请求中......")
    //创建新登陆类
    let mPassport = new Passport({
        mail: data.mail,
        passport: data.passport,
        credit: data.credit,
        sessionID: data.sessionID,
        accessToken: data.accessToken,
    })
    //检查登陆状态
    let mPassportProcesser = new PassportProcesser(mPassport)
    if (EncryptTool.isEmptyObject(mPassportProcesser)) {
        log.warn("PassportProcesser为空对象!拒绝处理!")
        //TODO:对于非空对象的处理非法请求的处理
        return falseCallBack && falseCallBack('拒绝登录，非法请求!')
    }
    if (mPassportProcesser.checkLogin()) {//检查登录
        mPassportProcesser.setLogin()//设置登录凭证
        log.info('用户 [%s] 准许登录!UserID: %s, Processing...', mail, userID)
        LoginCenter.addLogin(req.sessionID, UserModel.getUserID(mail), [ip])
        trueCallBack && trueCallBack('登录成功，准备跳转到用户首页')
    } else {
        falseCallBack && falseCallBack()
    }
}

module.exports.newSignupRequest = (req, res) => {
    let mail = EncryptTool.rsaDecrypt(req.body.mail)
    let passport = EncryptTool.rsaDecrypt(req.body.passport)
    let captcha = EncryptTool.rsaDecrypt(req.body.captcha)
    if (req.session['captcha'] != captcha) {
        req.session['captcha'] = null
        res.status(200).send(JSON.stringify({
            ResponseValue: 10010403,
            ResponseMsg: '验证码不正确!'
        }))
        return
    }
    if (mail != UserModel.getmail(mail)) {
        UserModel.create(mail, passport);
        req.session['captcha'] = null
        res.status(200).send(JSON.stringify({
            ResponseValue: 10010200,
            ResponseMsg: '注册成功!正在重定向到登录界面'
        }))
    } else {
        res.status(200).send(JSON.stringify({
            ResponseValue: 202,
            ResponseMsg: '此用户名已被占用，请更换用户名!'
        }))
    }
}
