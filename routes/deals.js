"use strict";

const express = require('express');
const router = express.Router();

const dealsController = require('../controller/Deals/DealsController');

router.post('/newDeal', dealsController.createDeals);
router.post('/closeDeal', dealsController.closeDeals);
router.post('/dealByUser', dealsController.listDealByUserId);

module.exports = router;
