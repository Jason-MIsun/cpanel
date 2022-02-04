const express = require("express");
//const rx = require('rxjs');
//顶部公共Processer导入

const router = express.Router();
router.all('/', function(req, res){
    res.status(200).send('')
})
module.exports = router