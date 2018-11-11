"use strict";

const express = require('express');
const router = express.Router();

const dealsController = require('../controller/DealsController');

router.post('/newDeal', dealsController.createDeals);
router.post('/closeDeal', dealsController.closeDeals);
router.post('/dealByUser', dealsController.listDealDyUserId);

module.exports = router;
