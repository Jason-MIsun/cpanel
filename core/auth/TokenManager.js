
//new Token Manager
log.info('新TokenManager创建！')
class TokenManager {

    getNewToken() {
        return "A new refresh token"
    }

    generalNewAccessToken() {
        let $chars = "ABCDEFGHIJKLNMOPQRSTUVWXYZabcdefghijklnmopqrstuvwxyz1234567890";
        let maxPos = $chars.length;
        let pwd = "PW3#";
        for (let i = 0; i < server.ACCESS_TOKEN_LENGTH; i++) {
            if (i==2) pwd += '^s'
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        pwd += '-' + Date.parse(new Date())
        return pwd;
    }
}


module.exports = TokenManager