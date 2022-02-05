
/**
 * 开放式顶部API设计
 * 只传入顶部数据，数据处理交给后后端
 */

const express = require("express");
//const rx = require('rxjs');
//顶部公共Processer导入
const encryptTool = require('../utils/EncryptTool')
const apiResponse = require('../model/APIResponse')
const tokenProcesser = require('../core/auth/TokenProcesser')
const authenticationProcesser = require('../core/auth/AuthenticationProcesser')

const router = express.Router();

//验证码
router.get('/GetCaptchaToken', function (req, res) {
    let requestDate = req.query.s || null;
    tokenProcesser.newCaptchaTokenRequest(requestDate, req.sessionID, req["AccessToken"], (captchaToken) => {
        req.session['captcha'] = encryptTool.md5(captchaToken.text.toLowerCase());
        apiResponse.sendObject(res, "svg", captchaToken.data)
    }, (msg) => {
        apiResponse.error(res, msg)
    })
});

//Token 获取
router.get('/GetAccessToken', function (req, res) {
    //if (!req.xhr) return;
    tokenProcesser.newAccessTokenRequest(req.query, req.sessionID, (Access_Token, _rand) => {
        req.session['AccessToken'] = Access_Token;
        req.session['_rand'] = _rand;
        apiResponse.send(res, {
            AccessToken: Access_Token,
            PublicKey: server.PUBLIC_KEY,
            _rand: _rand
        })
    }, (errorMsg) => {
        apiResponse.unavailable(res, errorMsg)
    })
})

//登录
router.post('/Login', function (req, res) {
    if (!req.xhr) return;
    authenticationProcesser.newLoginRequest({
        ip: req.socket.remoteAddress,           //客户端IP
        sessionID: req.sessionID,               //客户端标识
        passport: req.body.passport,            //用户登录凭证
        credit: req.body.credit,                //用户通信凭证
        accessToken: req.session['AccessToken'],//请求刷新凭证
    }, () => {
        apiResponse.send(res, 'OK! You are redirecting to user center....')
    }, (msg) => {
        apiResponse.send(res, msg)
    })
});

//注册
router.post('/Signup', function (req, res) {
    if (!req.xhr) return;
    authenticationProcesser.newSignupRequest(req, res, () => {
        return 403
    }, () => {
        return 403
    })
})

module.exports = router