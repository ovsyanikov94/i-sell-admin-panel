"use strict";

const express = require('express');
const router = express.Router();

const UserController = require('../controller/UserController');

router.post('/registryUser',UserController.AddUser);
router.post('/updateUserInfo', UserController.updateUser);
router.post('/addUserAvatar', UserController.addUserAvatar);
router.post('/removeUserAvatar', UserController.removeUserAvatar);
router.post('/addUserWithRole', UserController.AddUserWithRole);

module.exports = router;
