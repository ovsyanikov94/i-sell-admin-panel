"use strict";

const express = require('express');
const router = express.Router();

const LotStatusController = require('../controller/LotStatusController');

router.post('/lotStatus' , LotStatusController.AddLotStatus );

module.exports = router;
