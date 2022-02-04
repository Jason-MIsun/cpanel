
const aesjs = require('./crypto/AES')
const JSEncrypt = require('node-jsencrypt');
const cryptjs = require('crypto-js')

module.exports.md5 = function (rawData) {
    return cryptjs.MD5(rawData)
}

module.exports.aesEncrypt = function (rawData, token) {
    let rawDataBytes = aesjs.utils.utf8.toBytes(rawData);
    let aesCtr = new aesjs.ModeOfOperation.ctr(token, new aesjs.Counter(32));
    let encryptedDataBytes = aesCtr.encrypt(rawDataBytes);
    let encryptedData = aesjs.utils.hex.fromBytes(encryptedDataBytes);
    return encryptedData;
}

module.exports.aesDecrypt = function (encryptedData, token) {
    let encryptedDataBytes = aesjs.utils.hex.toBytes(encryptedData)
    let aesCtr = new aesjs.ModeOfOperation.ctr(token, new aesjs.Counter(32));
    let decryptedDataBytes = aesCtr.decrypt(encryptedDataBytes);
    let decryptedData = aesjs.utils.utf8.fromBytes(decryptedDataBytes)
    return decryptedData
}

module.exports.rsaEncrypt = function (rawData) {
    let jsencrypt = new JSEncrypt()
    jsencrypt.setPublicKey(server.PUBLIC_KEY);
    return jsencrypt.encrypt(rawData)
}

module.exports.rsaDecrypt = function (rawData) {
    let jsencrypt = new JSEncrypt()
    jsencrypt.setPrivateKey(server.PRIVATE_KEY)
    return jsencrypt.decrypt(rawData, 'utf8')
}

module.exports.isEmptyObject = function (targetObject) {
    for (let key in targetObject) {
        return false;
    }
    return true;
}
