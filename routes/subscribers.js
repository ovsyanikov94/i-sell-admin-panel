"use strict";

const express = require('express');
const router = express.Router();

const SubscribersController = require('../controller/SubscribersController');

router.post('/addInSubscribers', SubscribersController.AddUserToSubscribers);
router.post('/removeInSubscribers', SubscribersController.RemoveUserToSubscribers);


module.exports = router;
