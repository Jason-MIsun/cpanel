
// 随机数
function generalDESToken() {
    len = 32;
    var $chars = "012345678909876543210";
    var maxPos = $chars.length;
    let a = "";
    let b = []
    let pwd = {}
    for (let i = 0; i < len; i++) {
        let d = $chars.charAt(Math.floor(Math.random() * maxPos));
        a += d
        b[i] = Number(d)
    }
    pwd.a = a
    //密匙 字符串
    pwd.b = b
    //密匙 数组
    return pwd;
}

function rsaEncrypt(key) {
    let jsencrypt = new JSEncrypt()
    jsencrypt.setPublicKey(app.PUBLICK_KEY);
    return jsencrypt.encrypt(key)
}

function aesEncrypt(rawData) {
    let rawDataBytes = aesjs.utils.utf8.toBytes(rawData);
    let aesCtr = new aesjs.ModeOfOperation.ctr(app.TOKEN.b, new aesjs.Counter(32));
    let encryptedDataBytes = aesCtr.encrypt(rawDataBytes);
    let encryptedData = aesjs.utils.hex.fromBytes(encryptedDataBytes);
    return encryptedData;
}