

const crypto = require('crypto')


let adapter= new FileSync(server.db.LOGINCENTER_DB_PATH)
let db = lowdb(adapter)

db.defaults({
    LoginedUsers:[],
    count: 0
})

function login(UserID){
    db.get('LoiginedUsers')
    .push({
        UserID:UserID,
        LoginDate:new Date(),
    })
    db.update('count', n => n+1).write()
    log.info('User login')
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