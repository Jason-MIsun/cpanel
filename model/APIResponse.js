
//返回信息处理模块

/**
 * 
 * 返回信息格式
 * {
 *   ResValue : number  返回状态码
 *   ResMessage ： string 返回信息
 * }
 * 
 * 
 * 存在正常，错误情况， 错误代码，错误信息
 */

{
    '404Error',
        '403Foribidden',
        '500ServerError'
}
class NullError extends Error {
    constructor() {
        super(null);
    }
}

class ForbiddenError extends Error {
    constructor() {
        super("权限不足 | 403 Forbidden");
    }
}

class UnavailableError extends Error {
    constructor() {
        super("请求频繁，拒绝服务 |  500 Service Unavailable");
    }
}


function isObject(data) {
    return Object.prototype.toString.call(data) === '[object Object]'
}

function isString(data) {
    return Object.prototype.toString.call(data) === '[object String]'
}

function isEmptyObject(tarObject) {
    for (let key in tarObject) {
        return false;
    }
    return true;
}

/**
 * 200回复
 *
 * @param res 响应流
 * @param statusCode 返回值
 * @public
 */
function ok(res) {
    res.status(200)
        .send('OK!')
        .end();
}

/**
 * 信息回复
 * 
 * @param {*} res 响应流
 * @param {string} msg 信息
 * @param {number} statusCode 返回代码
 * @returns 
 */

function send(res, msg, statusCode = 210000200) {
    if (!res) return
    if (isObject(msg)) {
        msg = Object.assign({ ResCode: statusCode }, msg)
    } else {
        msg = JSON.stringify({
            ResCode: statusCode,
            ResMessage: msg
        })
    }
    res.status(200)
        .send(msg)
        .end()

    return true
}

/**
 * 
 * @param {*} res 响应流
 * @param {string} objType 返回Object类型
 * @param {*} obj 返回Object
 * @returns 
 */
function sendObject(res, objType, obj) {
    if (!res && !objType) return
    if (!obj && !isEmptyObject(obj)) {
        res.status(200).send("")
    } else {
        res.status(200)
            .type(objType)
            .send(obj)
            .end()
    }
    return true
}

/**
 * 403 错误，禁止
 *
 * @param res 响应流
 * @param error 错误信息
 * @return {boolean} 
 * @public
 */
function forbidden(res, resMessage = new ForbiddenError(), statusCode = 403) {
    res.status(403)
        .send(
            JSON.stringify({
                ResValue: statusCode,
                ResMessage: resMessage
            })
        );
    res.end();
};

/**
 * 
 * @param {*} res 响应流
 * @param {string} resMessage 错误信息
 * @param {number} statusCode 错误代码
 */

function error(res, resMessage = new NullError(), statusCode = 500) {
    res.status(statusCode)
        .send(
            JSON.stringify({
                ResCode: statusCode,
                ResMessage: resMessage
            })
        );
    res.end();
};

function unavailable(res, resMessage = new UnavailableError(), statusCode = 503) {
    res.status(statusCode)
        .send(
            JSON.stringify({
                ResCode: statusCode,
                ResMessage: resMessage
            })
        );
    res.end();
};

module.exports = {
    ok, send, sendObject, forbidden, error, unavailable
}