
function getAccessToken(mail, password) {
    console.debug('Start to construct post data!')
    let s = md5(mail)
    let t = Date.parse(new Date())
    console.info('Start to get AccessToken')
    $.get({
        url: app.URL('./api/GetAccessToken'),
        data: {
            s: s,
            t: t,
            _rand: Math.random()
        },
        //callback
        success: function (data) {
            console.info('Get AccessToken Successfully! Start to prase data')
            //确认PublicKey
            console.debug('Confirm PublicKey')
            if (md5(data.PublicKey) == app.KEY) {
                let token = generalDESToken();
                app.TOKEN = token
                app.PUBLICK_KEY = data.PublicKey
                app.ACCESS_TOKEN = data.AccessToken
                app.GET_ACCESS_TOKEN = true
                console.info('Confirmed PublicKey!')
                signin(mail, password)
            } else {
                alert(' CA凭证有误！拒绝登录 请联系提供者！！！');
            }

        },
        //callback
        error: function (err) {
            alert('获取AccessToken失败!错误信息: %s', err)
            console.error('GetAccessToken failed! %s', err)
        }
    })
}

function signin(mail, password) {
    console.info('Start to login')
    console.info('Construct postdata')
    let md5Mail = md5(mail)                                                                 //MD5用户名
    let md5Token = md5(app.TOKEN.a)
    let md5Passport = md5(md5Mail + md5(password));                                         //MD5 用户名＋MD5密码
    let md5Credit = app.TOKEN.a + ':' + app.ACCESS_TOKEN + ':' + app.ENCRYPT_VERSION_CODE + ':' + app.VERSION_CODE + ':' + Date.now()//用户通信凭证
    let tmpPassport = md5Mail + ':' + md5Passport + ':' + md5Token + ':' + rsaEncrypt(mail)//用户登录凭证
    // + ':' + app.ACCESS_TOKEN         //加工凭证

    let encryptedPassport = aesEncrypt(tmpPassport)
    let encryptedCredit = rsaEncrypt(md5Credit)
    //start to post data
    console.info('Start to login!')
    $.post({
        url: app.URL('./api/Login'),
        data: {
            passport: encryptedPassport,
            credit: encryptedCredit,
            _rand: Date.now()
        },
        //请求成功回调
        success: function (data) {
            data = JSON.parse(data);
            if (data.ResCode == 210000200) {
                //默认全部正确，根据返回代码确定登录成功情况
                $('#LoginButton').html('登陆成功 √').attr('disabled', 'disabled');
                //2秒后跳转首页
                setTimeout(function () {
                    $('#LoginButton').html(data.ResMessage);
                    //window.location.href = './';
                }, 2000)
            } else if (data.ResCode == 210000403) {
                //登录出现错误并显示服务器返回信息
                $('#LoginButton').html('登陆失败 X').attr('disabled', 'disabled');
                //1秒后解除按钮限制
                setTimeout(function () {
                    $('#LoginButton').html('重新验证').removeAttr('disabled');
                }, 1500)
                window.alert(data.ResMessage)
            }
        },
        //真正的请求错误
        error: function (errorMsg) {
            console.info('Login failed!Msg: %s', errorMsg)
        }
    });
}

function signup(mail, password, captcha, rand) {
    let md5Captcha = md5(captcha)
    let md5mail = md5(mail)
    let md5Passport = md5(md5mail + md5(password));
    let encryptedmail = rsaEncrypt(md5mail)
    let encryptedPassport = rsaEncrypt(md5Passport)
    let encryptedCaptcha = rsaEncrypt(md5Captcha)
    $.post({
        url: app.URL('./api/Signup'),
        data: {
            mail: encryptedmail,
            passport: encryptedPassport,
            captcha: encryptedCaptcha
        },
        success: function (data) {
            data = JSON.parse(data)
            if (data.ResponseValue == 0810200) {
                $('#SignupButton').html(data.ResponseMsg).attr('disabled', 'disabled')
                setTimeout(function () {
                    $('#captchaImg').attr('src', '../api/GetCaptchaToken');
                    $('#SignupButton').html('注册').removeAttr('disabled');
                }, 2000)
            } else if (data.ResponseValue == 0810200) {
                $('#SignupButton').html(data.ResponseMsg);
                setTimeout(function () {
                    window.location.href = './';
                }, 2000)
            } else {
                $('#SignupButton').html(data.ResponseMsg).attr('disabled', 'disabled')
                $('#captcha').html('')
                setTimeout(function () {
                    $('#captchaImg').attr('src', '../api/GetCaptchaToken');
                    $('#SignupButton').html('注册').removeAttr('disabled');
                }, 2000)
            }
        },
        error: function () {
            window.alert('获取数据失败！请检查网络！！！')
        }
    })
}

//default
//暴露公共登录API
app.login = function (mail, password) {
    if (app.GET_ACCESS_TOKEN) {
        signin(mail, password)
    } else {
        getAccessToken(mail, password)
    }
}

$(function () {
    //AccessToken 确认
    //LOGIN确认
    //暴露API
    app.requireLogin = function () {
        let button = $('#LoginButton');
        button.html('正在验证...').attr('disabled', 'disabled');
        if (!$('UserID').val() && !$('#Password').val()) {
            window.alert('请输入正确的账密!')
            button.html('登录').removeAttr('disabled')
            return
        }
        app.login($('#UserID').val(), $('#Password').val())
    }

    app.requireSignup = function () {
        let button = $('SignupButton')
        //数据校验
        app.signup($('UserID').val(), $('Password').val())
    }
})