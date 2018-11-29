"use strict";

const express = require('express');
const router = express.Router();

const LotMarkController = require('../controller/LotMarkController');

router.post('/update-lot-mark', LotMarkController.UpdateLotMark);

router.get('/users-list-by-mark', LotMarkController.GetUsersListWithMarks);

router.get('/get-marked-lot-by-user', LotMarkController.GetCurrentLikeDislikeLotInfo);

module.exports = router;



