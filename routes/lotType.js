"use strict";

const express = require('express');
const router = express.Router();

const LotTypeController = require('../controller/LotTypeController');

router.post('/lotType' , LotTypeController.AddLotType );

module.exports = router;
