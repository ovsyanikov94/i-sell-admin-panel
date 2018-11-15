"use strict";

const express = require('express');
const router = express.Router();

const LotController = require('../controller/LotController');

router.post('/lot' , LotController.AddLot );
router.get('/lotList' , LotController.GetLotList );
router.delete('/deleteLot/:id' , LotController.DeleteLot );
router.put('/updateLot/:id' , LotController.UpdateLot );


module.exports = router;
