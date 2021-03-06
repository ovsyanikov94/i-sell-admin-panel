"use strict";

const express = require('express');
const router = express.Router();

const blockListController = require('../controller/User/BlockListController');

router.post('/addInBlockList', blockListController.AddUserToBlockList);
router.post('/removeInBlockList', blockListController.RemoveUserToBlockList);


module.exports = router;
