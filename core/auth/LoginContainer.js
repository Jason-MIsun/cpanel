
let LoginCenterContainer = []
LoginCenterContainer.SessionIDContanier = {}
//[sessionid] [desToken,accesstoken,requestdata]
// DesToken: user msg descrypt token = AES decrypt key

class Container {
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

module.exports.addDesToken = (sessionID, desToken) => {
  // process destoken to arrary
  let desTokenArrary = []
  for (let i = 0; i < desToken.length; i++) {
    desTokenArrary[i] = Number(desToken.charAt(i))
  }
  LoginCenterContainer.SessionIDContanier[sessionID] = desTokenArrary;
}

// use sessionID to get DesToken
module.exports.getDesToken = (sessionID) => {
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

module.exports = Container