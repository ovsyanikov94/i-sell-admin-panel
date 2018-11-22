"use strict";

const express = require('express');
const router = express.Router();

const UserController = require('../controller/UserController');
const AccessController = require('../controller/AccessController');

router.get('/getUser', AccessController.CheckAccess  ,UserController.GetUser);
router.post('/registryUser',UserController.AddUser);
router.post('/updateUserInfo', AccessController.CheckAccess , UserController.updateUser);
router.post('/addUserAvatar',AccessController.CheckAccess , UserController.addUserAvatar);
router.post('/removeUserAvatar',AccessController.CheckAccess , UserController.removeUserAvatar);
router.post('/GetUserBuyLot',AccessController.CheckAccess , UserController.GetUserBuyLot);
router.post('/GetUserSaleLot', AccessController.CheckAccess , UserController.GetUserSaleLot);


router.post('/addUserWithRole', UserController.AddUserWithRole);

module.exports = router;
