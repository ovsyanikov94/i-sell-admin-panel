"use strict";

const express = require('express');
const router = express.Router();

const UserController = require('../controller/UserController');
const AccessController = require('../controller/AccessController');
router.use( AccessController.CheckAccess );


router.get('/getUser',UserController.GetUser);
router.post('/registryUser',UserController.AddUser);
router.post('/updateUserInfo', UserController.updateUser);
router.post('/addUserAvatar', UserController.addUserAvatar);
router.post('/removeUserAvatar', UserController.removeUserAvatar);


module.exports = router;
