
const fs = require('fs')
const lowdb = require('lowdb')
const UUID = require('uuid')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(server.path.USER_PROFILE_DB_PATH)

const db = lowdb(adapter)

db.defaults({
    Users: [],
    AdminUsers: [],
    count: 0
}).write()

function create(md5mail, credit) {
    let userID = UUID.v4()
    let nowDate = Date.parse(new Date());
    let salt = randomString(64)
    db.get('Users')
        .push({
            mail: md5mail,
            UserID: userID,
            Credit: credit,
            CreateDate: nowDate,
            Level: 5,
            LastLoginDate: null,
            _salt: salt,
            Status: true,
            ApiKey: '',
            Authority: {},
            DisablePremission: []
        }).write()
    db.update('count', n => n + 1).write()
}

function getProfile(userID) {
    return db.get('Users').find({ UserID: userID }).value()
}

function getProfilebymail(md5mail) {
    return db.get('Users').find({ mail: md5mail }).value()
}

function getCredit(md5mail) {
    return db.get('Users').find({ mail: md5mail }).value().Credit
}

function getUserID(md5mail) {
    return db.get('Users').find({ mail: md5mail }).value().UserID
}

function getmail(md5mail) {
    return db.get('Users').find({ mail: md5mail }).value().mail
}

function isUserExist(md5mail) {
    let tmp = getProfilebymail(md5mail)
    if (tmp === undefined) {
        return false
    } else {
        return true
    }
}
function randomString(len) {
    len = len || 32;
    var $chars = "ABCDEFGHIJKLNMOPQRSTUVWXYZabcdefghijklnmopqrstuvwxyz1234567890_";
    var maxPos = $chars.length;
    var pwd = "";
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

module.exports = {
    create,
    getProfile,
    getCredit,
    getUserID,
    getmail,
    isUserExist
}
