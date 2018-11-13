"use strict";

const express = require('express');
const router = express.Router();

const LotController = require('../controller/LotMarkController');

router.post('/add-lot-mark', LotController.AddLotMark);
router.get('/lot-mark-list', LotController.GetLotMarkList);
router.delete('/remove-lot-mark', LotController.RemoveLotMark);
router.update('/update-lot-mark', LotController.UpdateLotMark);

module.exports = router;



