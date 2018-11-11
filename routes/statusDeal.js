"use strict";

const express = require('express');
const router = express.Router();

const statusDealsController = require('../controller/StatusDealsController');

router.post('/newStatusDeal', statusDealsController.createStatus);
router.post('/removeStatusDeal', statusDealsController.removeStatusDeal);
router.post('/updateStatusDeal', statusDealsController.updateStatusDeal);
router.get('/listStatusDeal', statusDealsController.ListStatus);
router.post('/listStatusDealByID', statusDealsController.ListStatusByID);

module.exports = router;
