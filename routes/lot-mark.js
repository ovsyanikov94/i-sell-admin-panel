"use strict";

const express = require('express');
const router = express.Router();

const LotMarkController = require('../controller/LotMarkController');

router.post('/add-lot-mark', LotMarkController.AddLotMark);
router.get('/lot-mark-list', LotMarkController.GetLotMarkList);
router.delete('/remove-lot-mark', LotMarkController.RemoveLotMark);
router.put('/update-lot-mark', LotMarkController.UpdateLotMark);

module.exports = router;



