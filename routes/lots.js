"use strict";



const express = require('express');
const router = express.Router();

const LotController = require('../controller/LotController');
const AccessController = require( "../controller/AccessController");


router.post('/lot' , AccessController.CheckAccess , LotController.AddLot );
router.get('/singleLot' , AccessController.CheckAccess , LotController.GetLotById );
router.get('/lotList' , LotController.GetLotList );
router.delete('/deleteLot/:id',  AccessController.CheckAccess  , LotController.DeleteLot );
router.put('/updateLot/:id',  AccessController.CheckAccess  , LotController.UpdateLot );


module.exports = router;
