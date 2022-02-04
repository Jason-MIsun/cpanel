// 针对API返回的数据缩写的服务模块

class NullError extends Error {
    constructor() {
        super(null);
    }
}

class ForbiddenError extends Error {
    constructor() {
        super("权限不足 | Forbidden");
    }
}

class UnavailableError extends Error {
    constructor() {
        super("请求频繁，拒绝服务 | Service Unavailable");
    }
}

module.exports.send = (res, data = "", statusCode = 200) => {
    res.send(
        JSON.stringify({
            status: statusCode,
            data: data
        })
    );
    res.end();
};

module.exports.ok = (res, statusCode = 200) => {
    res.send(
        JSON.stringify({
            status: statusCode
        })
    );
    res.end();
};

module.exports.error = (res, error = new NullError(), statusCode = 500) => {
    res.send(
        JSON.stringify({
            status: statusCode,
            error: error.message
        })
    );
    res.end();
};

module.exports.forbidden = (res, error = new ForbiddenError(), statusCode = 403) => {
    res.send(
        JSON.stringify({
            status: statusCode,
            error: error.message
        })
    );
    res.end();
};

module.exports.unavailable = (res, error = new UnavailableError(), statusCode = 503) => {
    res.send(
        JSON.stringify({
            status: statusCode,
            error: error.message
        })
    );
    res.end();
};
module.exports.sendObject = (res, objType, obj) => {
    if (!res && !objType) return
    if (!obj && !isEmptyObject(obj)) {
        res.status(200).send("")
    } else {
        res.type(objType)
        res.status(200).send(obj)
    }
    return true
}
module.exports.key = (req) => {
    return req.query.apikey || "";
};
