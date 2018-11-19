"use strict";

const express = require('express');
const router = express.Router();
const AccessController = require('../controller/AccessController');

const LotTypeController = require('../controller/LotTypeController');

router.use( AccessController.CheckAccess );
router.get('/lotType' , LotTypeController.LotTypeList );

module.exports = router;
