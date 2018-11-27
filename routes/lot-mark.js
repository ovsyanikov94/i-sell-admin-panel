"use strict";

const express = require('express');
const router = express.Router();

const LotMarkController = require('../controller/LotMarkController');

router.get('/lot-mark-list', LotMarkController.GetLotMarkList);
router.post('/update-lot-mark', LotMarkController.UpdateLotMark);

module.exports = router;



