"use strict";

const express = require('express');
const router = express.Router();

const BiddingController = require('../controller/Lot/BiddingController');
const AccessController = require('../controller/User/AccessController');

router.post('/addBidding' , AccessController.CheckAccess ,BiddingController.AddRate);

module.exports = router;
