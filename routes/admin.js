"use strict";

const express = require('express');
const router = express.Router();

const AdminController = require('../controller/User/AdminController');
const AccessController = require('../controller/User/AccessController');

//router.use( AccessController.CheckAccess );


router.get('/getAdmin' , AccessController.CheckAccess ,AdminController.GetAdmin);

router.post('/updateAdminInfo' , AccessController.CheckAccess , AdminController.updateAdmin);

router.post('/addUserWithRole', AccessController.CheckAdminAccess , AdminController.AddUserWithRole);
router.get('/getUserList' , AccessController.CheckAccess ,AdminController.GetUserList);


module.exports = router;