
const fs = require('fs');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(server.path.SESSION_STORE_DB_PATH)
const db = lowdb(adapter)
db.defaults({
    Session:[]
})
.write()

module.exports={
    //AccessControll:require('./schemas/AccessControll'),
    User: require('./schemas/User')
}