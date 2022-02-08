const express = require("express");
const apiResponse = require('../model/APIResponse')
//const rx = require('rxjs');
const loginCenter = require('../core/LoginCenter');
const articleProcesser = require('../core/article/ArticleProcesser')

const router = express.Router();

router.get('/:articleID', (req, res) => {
    let articleID = req.params.articleID
    res.status(200).send('ok')
})