"use strict";

const express = require('express');
const router = express.Router();

const blackListController = require('../controller/BlackListController');

router.post('/addInBlackList', blackListController.AddUserToBlackList);
router.post('/removeInBlackList', blackListController.RemoveUserToBlackList);


module.exports = router;
