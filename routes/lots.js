"use strict";

const express = require('express');
const router = express.Router();

const LotController = require('../controller/LotController');
const AccessController = require( "../controller/AccessController");


router.post('/lot' , AccessController.CheckAccess , LotController.AddLot );
router.post('/singleLot' , AccessController.CheckAccess , LotController.GetLotById );
router.get('/lotList' , LotController.GetLotList );
router.delete('/deleteLot/:id' , LotController.DeleteLot );
router.put('/updateLot/:id' , LotController.UpdateLot );

router.get('/lot/:id' , LotController.GetLotByID );

module.exports = router;
