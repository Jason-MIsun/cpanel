//标准URL定位器

//某些 login 页面没有 MCSERVER 全局变量，在此实例化
if (window.app === undefined)
    window.app = {};

app.KEY = '7c37dd880182083a2e76f2a477211db7'
app.VERSION_CODE = 20220101
app.PUBLICK_KEY = null
app.TOKEN = null
app.ACCESS_TOKEN = null
app.L_CONTROL = null
app.GET_ACCESS_TOKEN = false
app.PUSHED_DES_TOKEN = false

//protocol setting
app.WS_PROTOCOL = "ws://";
app.HTTP_PROTOCOL = "http://"

//URL定位器
app.URL = function (url, protocol) {
    var _protocol = protocol || app.HTTP_PROTOCOL;
    var hostName = window.location.host;
    var openURL = hostName + "/" + url;
    return _protocol + openURL;
}