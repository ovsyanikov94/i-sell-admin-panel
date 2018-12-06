"use strict";

const express = require('express');
const router = express.Router();

const SubscribersController = require('../controller/User/SubscribersController');
const AccessController = require('../controller/User/AccessController');

router.use( AccessController.CheckAccess );

router.post('/addInSubscribers', SubscribersController.AddUserToSubscribers);
router.post('/removeInSubscribers', SubscribersController.RemoveUserToSubscribers);
router.get('/InListSubscribers',SubscribersController.InListSubscribers);
router.get('/getSubscribers',SubscribersController.getSubscribersUser);
router.get('/getSubscriptions',SubscribersController.getSubscriptionsUser);
module.exports = router;
