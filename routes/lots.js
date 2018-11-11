"use strict";

const express = require('express');
const router = express.Router();

const LotController = require('../controller/LotController');

router.post('/lot' , LotController.AddLot );

module.exports = router;
