
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(server.path.SESSION_STORE_DB_PATH)
const db = lowdb(adapter)
db.defaults({
  Session: []
}).write()

module.exports = function (session) {
  const Store = session.Store;

  class SessionStore extends Store {
    constructor(options = {}) {
      super(options);
      this.db = new Sessions(db, options.ttl);
      if (!options.disablePurge) {
        setInterval(() => {
          this.db.purge();
        }, 60000);
      }
    }

    all(callback) {
      callback(null, this.db.all());
    }

    clear(callback) {
      this.db.clear();
      callback(null);
    }

    destroy(sid, callback) {
      log.info('Destroy session: %s', sid)
      this.db.destroy(sid);
      callback(null);
    }

    get(sid, callback) {
      callback(null, this.db.get(sid));
    }

    length(callback) {
      callback(null, this.db.length());
    }

    set(sid, session, callback) {
      this.db.set(sid, session);
      callback(null);
    }

    touch(sid, session, callback) {
      this.set(sid, session, callback);
    }
  }

  return SessionStore;
};

class Sessions {
  constructor(db, ttl) {
    this.db = db;
    this.ttl = ttl || 86400;
  }

  get(sid) {
    const obj = this.db.find({ _id: sid }).cloneDeep().value();
    return obj ? obj.session : null;
  }

  all() {
    return this.db
      .cloneDeep()
      .map((obj) => obj.session)
      .value();
  }

  length() {
    return this.db.size().value();
  }

  set(sid, session) {
    const expires = Date.now() + this.ttl * 1000;
    const obj = { _id: sid, session, expires };
    const found = this.db.find({ _id: sid });
    if (found.value()) {
      found.assign(obj).write();
    } else {
      this.db.push(obj).write();
    }
  }

  destroy(sid) {
    this.db.remove({ _id: sid }).write();
  }

  clear() {
    this.db.remove().write();
  }

  purge() {
    const now = Date.now();
    this.db.remove((obj) => now > obj.expires).write();
  }
}