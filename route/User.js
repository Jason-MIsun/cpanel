
const express = require("express");
const rx = require('rxjs');
const loginCenter = require('../core/LoginCenter');

const router = express.Router();

router.get('/', (req, res) => {
    // status checker
    loginCenter.needLogin(req, res,
        () => res.redirect('/User'),
        () => res.status(200).sendfile('./public/index.html'));
})

router.get('/Login', (req, res) => {
    // status checker
    loginCenter.needLogin(req, res,
        () => res.redirect('/User'),
        () => res.status(200).sendfile('./public/Login/index.html'));
});

router.get('/Signup', function (req, res) {
    res.status(200).sendfile('./public/Signup/index.html')
})

module.exports = router