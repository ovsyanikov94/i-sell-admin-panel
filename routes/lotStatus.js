"use strict";

const express = require('express');
const router = express.Router();

const LotStatusController = require('../controller/LotStatusController');

router.get('/lotStatusById' , LotStatusController.GetLotStatusById );
router.get('/GetListLotStatusBuy',LotStatusController.GetListLotStatusBuy);
router.get('/GetListLotStatusSale',LotStatusController.GetListLotStatusSale);
module.exports = router;
