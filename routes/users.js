var express = require('express');
var router = express.Router();

const UserController = require('../controller/UserController');
/* GET users listing. */
router.post('/user', UserController.AddUser);

module.exports = router;
