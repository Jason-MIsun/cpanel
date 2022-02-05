
//const AccessControll= require('../db/schemas/AccessControll')

let LoginCenterContainer = []
LoginCenterContainer.SessionIDContanier = {}
//[sessionid] [AESToken,accesstoken,requestdata]
// AESToken: user msg descrypt token = AES decrypt key

class CenterContainer {
  constructor(config = {}) {
    this.StatusContainer = []
    this.SessionIDContanier = []
    this.StatusContainer[0] = ['SIMPLE_USER_ID', 'SESSION_PROFILE', ['CLIENT_IPS'], 'DATE']
  }

  isLogin(sessionID) {
    if (sessionID) {
      return this.StatusContainer[sessionID] === null
    }
    return false
  }

  addLogin(sessionID, userID, sessionProfile, ip) {
    this.StatusContainer[sessionID] = [userID, sessionProfile, [ip], Date.now()]
    this.SessionIDContanier[sessionID] = true
  }
}

module.exports.isLogin = (sessionID) => {
  if (sessionID) {
    return LoginCenterContainer[sessionID] === null
  }
  return true
}

module.exports.addLogin = (sessionID, userID, sessionProfiles) => {
  LoginCenterContainer[sessionID] = [userID, LoginCenterContainer.SessionIDContanier[sessionID], sessionProfiles, Date.now()]
  // user profile add login detailes
}

module.exports.delLogin = (sessionID) => {
  if (sessionID) {
    LoginCenterContainer[sessionID] = undefined;
    delete LoginCenterContainer[sessionID];
  } else throw new Error("sessionID is Null");
};

module.exports.addAESToken = (sessionID, AESToken) => {
  // process destoken to arrary
  let AESTokenArrary = []
  for (let i = 0; i < AESToken.length; i++) {
    AESTokenArrary[i] = Number(AESToken.charAt(i))
  }
  LoginCenterContainer.SessionIDContanier[sessionID] = AESTokenArrary;
}

// use sessionID to get AESToken
module.exports.getAESToken = (sessionID) => {
  if (sessionID) {
    if (LoginCenterContainer.SessionIDContanier[sessionID] !== undefined) {
      return LoginCenterContainer.SessionIDContanier[sessionID]
    }
    else log.error('No such Token!')
  }
  else log.error('SessionID is null!')
}

// login token auto checker
const MAX_AGE = server.session_max_age * 1000 * 60;
setInterval(() => {
  let time = Date.now();
  let oldtime = null;
  for (let k in LoginCenterContainer) {
    if (LoginCenterContainer) {
      oldtime = LoginCenterContainer[k][3];
      if (time - oldtime > MAX_AGE) {
        delete LoginCenterContainer[k];
      }
    }
  }
}, 1000 * 50); //50秒检索一遍
