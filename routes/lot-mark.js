"use strict";

const express = require('express');
const router = express.Router();

const LotMarkController = require('../controller/Lot/LotMarkController');

const AccessController = require('../controller/User/AccessController');

router.post('/update-lot-mark', AccessController.CheckAccess ,LotMarkController.UpdateLotMark);

router.get('/users-list-by-mark', LotMarkController.GetUsersListWithMarks);

router.get('/get-marked-lot-by-user', LotMarkController.GetCurrentLikeDislikeLotInfo);

module.exports = router;



