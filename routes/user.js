"use strict";

const express = require('express');
const router = express.Router();

const UserController = require('../controller/User/UserController');
const AccessController = require('../controller/User/AccessController');

//router.use( AccessController.CheckAccess );


router.get('/getUser' , AccessController.CheckAccess ,UserController.GetUser);
router.post('/registryUser',UserController.AddUser);
router.post('/updateUserInfo' , AccessController.CheckAccess , UserController.updateUser);
router.post('/addUserAvatar',AccessController.CheckAccess , UserController.addUserAvatar);
router.post('/removeUserAvatar',AccessController.CheckAccess , UserController.removeUserAvatar);
router.post('/GetUserBuyLot',AccessController.CheckAccess , UserController.GetUserBuyLot);
router.post('/GetUserSaleLot', AccessController.CheckAccess , UserController.GetUserSaleLot);





module.exports = router;
