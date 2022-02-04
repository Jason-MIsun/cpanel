
const fs = require('fs')
const lowdb = require('lowdb')
const UUID = require('uuid')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(server.path.STATUS_CENTER_DB_PATH)

const db = lowdb(adapter)

db.default({
    LoginStatus: [],
    AppStatus: [],
    DatabaseStatus: [],
})

module.exports.addLogin = (sessionID,  userID, sessionProfiles) => {
    db.get('LoginStatus')
    .push({
        userID
    })
}