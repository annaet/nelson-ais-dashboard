var express = require('express')
var controller = require('./api.controller')

var router = express.Router()

router.get('/history', controller.getHistory)

module.exports = router
