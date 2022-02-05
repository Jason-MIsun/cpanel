
//a new token processer

const LoginCenter = require('../LoginCenter')
const TokenManager = require('./TokenManager')
const svgCaptcha = require('svg-captcha')

let mTokenManager = new TokenManager()
/**
 * 新的获取AccessToken请求.
 *
 * @param data 传入数据
 * @param sessionID 请求的SessionID
 * @param trueCallBack 
 * @param falseCallBack
 * @return null
 * @public
 */

module.exports.newAccessTokenRequest = (data, sessionID, trueCallBack, falseCallBack) => {
    log.info('处理新的获取AccessToken请求')
    //检查时间是否正确
    //终端登录唯一性检查
    let requestDate = data.t
    let nowDate = Date.parse(new Date())
    if (!LoginCenter.isLogin(sessionID)) {
        let _rand = data._rand
        let AccessToken = mTokenManager.generalNewAccessToken()
        log.info('准许获取!')
        trueCallBack && trueCallBack(AccessToken, _rand, nowDate)
    } else {
        falseCallBack && falseCallBack()
    }
}
/**
 * 获取验证码
 *
 * @param requestDate 请求时间
 * @param accessToken 设备AccessToken
 * @param sessionID 会话ID
 * @param trueCallBack
 * @param falseCallBack
 * @return {boolean}
 * @public
 */
module.exports.newCaptchaTokenRequest = (requestDate, accessToken, sessionID, trueCallBack, falseCallBack) => {
    let nowDate = Date.parse(new Date());
    if (((requestDate - nowDate) > server.REQUEST_EXPIRE_TIME) ||
        (sessionID) //||
        /*(accessToken)*/) {
        falseCallBack && falseCallBack('failed to get token message!')
    }
    else {
        let captchaToken = svgCaptcha.create({
            size: 4,
            ignoreChars: '0oO1I',
            noise: 2,
            fontSize: 50,
            width: 100,
            background: '#ffffff'
        })
        trueCallBack && trueCallBack(captchaToken)
    }
}