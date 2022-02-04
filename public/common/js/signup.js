$(function() {
    app.requireSignup = function() {
        let mail = $("#mail").val()
        let password = $("#Password").val()
        let captcha = $("#captcha").val()

        if (mail == '' || password == '' || captcha == '') {
            window.alert('请正确填写所有项目！！！')
            return
        }
        if ($('#Password').characterCounter() < 5 || $('#Password').val().length < 5) {
            window.alert('请确保密码不少于5个字符！')
            return
        }
        $.get({
            url: app.URL("./api/GetAccessToken"),
            data: {
                s: md5(mail),
                k: Date.parse(new Date()),
                _rand: Math.random()
            },
            //callback
            success: function(data) {
                let POST_OBJECT = JSON.parse(data);
                // construct post data
                if (md5(POST_OBJECT.PublicKey) == app.KEY) {
                    app.PUBLICKEY = POST_OBJECT.PublicKey
                    app.ACCESS_TOKEN = POST_OBJECT.AccessToken
                    app.signup(mail, password, captcha.toLowerCase(), Math.random())
                } else {
                    $('#SignupButton').attr('disabled', 'disabled')
                    alert(' CA凭证有误！拒绝注册 请联系提供者！！！');
                }
            },
            error: function() {
                $('#SignupButton').attr('disabled', 'disabled')
                window.alert('获取CA凭证失败！请检查网络！！！')
            }
        });
    }
})

app.signup = function(mail, password, captcha, rand) {
    let md5Captcha = md5(captcha)
    let md5mail = md5(mail)
    let md5Passport = md5(md5mail + md5(password));
    let encryptedmail = encryptData(md5mail)
    let encryptedPassport = encryptData(md5Passport)
    let encryptedCaptcha = encryptData(md5Captcha)
    $.post({
        url: app.URL('./api/Signup'),
        data: {
            mail: encryptedmail,
            passport: encryptedPassport,
            captcha: encryptedCaptcha
        },
        success: function(data) {
            data = JSON.parse(data)
            if (data.ResponseValue == 0810200) {
                $('#SignupButton').html(data.ResponseMsg).attr('disabled', 'disabled')
                setTimeout(function() {
                    $('#captchaImg').attr('src', '../api/GetCaptchaToken');
                    $('#SignupButton').html('注册').removeAttr("disabled");
                }, 2000)
            } else if (data.ResponseValue == 0810200) {
                $('#SignupButton').html(data.ResponseMsg);
                setTimeout(function() {
                    window.location.href = "./";
                }, 2000)
            }else {
                $('#SignupButton').html(data.ResponseMsg).attr('disabled', 'disabled')
                $('#captcha').html('')
                setTimeout(function() {
                    $('#captchaImg').attr('src', '../api/GetCaptchaToken');
                    $('#SignupButton').html('注册').removeAttr("disabled");
                }, 2000)
            }
        },
        error: function() {
            window.alert('获取数据失败！请检查网络！！！')
        }
    })
}

function encryptData(key) {
    let jsencrypt = new JSEncrypt()
    jsencrypt.setPublicKey(app.PUBLICKEY);
    return jsencrypt.encrypt(key)
}
